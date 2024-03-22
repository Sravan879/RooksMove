// Import necessary dependencies
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Initialize Express app and create HTTP server
const app = express();
const server = createServer(app);

// Create Socket.IO server instance with CORS settings
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Serve index.html on root route
app.get('/', (req, res) => {
  res.sendFile(new URL('./index.html', import.meta.url).pathname);
});

// Initialize chessboard state
const initialState = initializeChessboardState();
// Initialize players array
const players = [];
// Set turn timeout duration to 30 seconds
const turnTimeout = 30000; // 30 seconds 

// Function to initialize chessboard state
function initializeChessboardState() {
  return {
    rookPosition: { x: 7, y: 0 },
    currentPlayer: 1,
  };
}

// Event listener for new socket connections
io.on('connection', handleNewConnection);

// Start the server listening on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Function to handle new socket connection
function handleNewConnection(socket) {
  console.log('Player has connected');
  let timer; // Timer for the current player's turn

  // Assign a unique player ID to the connected player
  const playerId = players.length + 1;

  // Add the player to the list
  const player = {
    id: playerId,
    socket: socket,
  };
  players.push(player);
  io.emit('playerCount', players.length);

  // Event listener for clientReady event
  socket.on('clientReady', handleClientReady);

  // Event listener for moveRook event
  socket.on('moveRook', handleMoveRook);

  // Event listener for socket disconnection
  socket.on('disconnect', handleDisconnect);

  // Start the timer for the first player's turn
  if (players.length === 2) {
    startTurnTimer();
  }

  // Function to handle clientReady event
  function handleClientReady() {
    // Emit the player's ID to the client so they can identify themselves
    socket.emit('playerId', playerId);

    // When the client is ready, emit the 'initialGameState'
    socket.emit('initialGameState', initialState);
  }

  // Function to handle moveRook event
  function handleMoveRook(newPosition) {
    // Identify the current player by their player ID
    const currentPlayer = players.find((p) => p.socket === socket);
    if (currentPlayer && initialState.currentPlayer === currentPlayer.id) {
      clearTimeout(timer); // Reset the timer for the current player's turn

      initialState.rookPosition = newPosition;
      // Switch the current player's turn
      initialState.currentPlayer = currentPlayer.id === 1 ? 2 : 1;

      // Restart the turn timer
      startTurnTimer();

      // Broadcast the move and the current player to all players
      io.emit('updateGameState', initialState);

      if (newPosition.x === 0 && newPosition.y === 7) {
        // The current player has won
        io.to(currentPlayer.socket.id).emit('gameOver', 'Congratulations! You win!');
        // The other player has lost
        const otherPlayer = players.find((p) => p.id !== currentPlayer.id);
        io.to(otherPlayer.socket.id).emit('gameOver', 'You lost! Your opponent has reached the end!');
        return;
      }
    }
  }

  // Function to start turn timer
  function startTurnTimer() {
    timer = setTimeout(() => {
      // Declare the current player as the loser due to timeout
      const currentPlayer = players.find((p) => p.socket === socket);
      io.to(currentPlayer.socket.id).emit('gameOver', "Game Over! Time's up! You lost!");
      
      // Declare the other player as the winner
      const otherPlayer = players.find((p) => p.id !== currentPlayer.id);
      io.to(otherPlayer.socket.id).emit('gameOver', "Congratulations! Your opponent's time ran out. You win!");
    }, turnTimeout);
  }

  // Function to handle socket disconnection
  function handleDisconnect() {
    console.log('Player has disconnected');
    // Remove the disconnected player from the list
    const index = players.findIndex((p) => p.id === playerId);
    if (index !== -1) {
      players.splice(index, 1);
    }
  }
}
