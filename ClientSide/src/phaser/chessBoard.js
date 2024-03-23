import Phaser from "phaser";

class ChessBoard extends Phaser.Scene {
  constructor() {
    super({ key: "ChessBoard" });
  }

  preload() {
    // Preload all necessary images
    this.load.svg("rook", "/images/rook.svg", { width: 40, height: 40 });
    this.load.svg("rookDown", "/images/rook_down.svg", {
      width: 40,
      height: 40,
    });
    this.load.svg("rookLeft", "/images/rook_left.svg", {
      width: 40,
      height: 40,
    });
    this.load.svg("finish", "/images/finish.svg", { width: 50, height: 50 });
    this.load.svg("opp_timer", "/images/opp_timer.svg", {
      width: 75,
      height: 75,
    });
    this.load.svg("timer", "/images/timer.svg", { width: 55, height: 55 });
    this.load.svg("rectangle", "/images/rectangle.svg", {
      width: 30,
      height: 30,
    });
  }

  init(data) {
    // Access the socket instance passed from IntroScene
    this.socket = data.socket;
  }

  create() {
    // Define necessary variables and constants
    let player = null;
    const sq = 41.77;

    // Function to highlight valid moves for the rook
    function highlightValidMoves() {
      // Check if the rook is active
      if (isRookActive) {
        // Create an array to store the square sprites
        const squares = [];
    
        // Loop through the squares and highlight them
        for (let x = rookPositionX - 1; x >= 0; x--) {
          // Calculate square position
          const squareX = 20.42 + x * sq + sq / 2;
          const squareY = 166.42 + rookPositionY * sq + sq / 2;
    
          // Create and configure square sprite with breathing animation
          const square = scene.add.sprite(squareX, squareY, "rectangle");
          square.setScale(0.75); // Initial scale for the breathing effect
          
          // Add an animation to the square
          scene.tweens.add({
            targets: square,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1, // Infinite animation
          });
    
          // Event listener for tap or click on the square
          square.setInteractive();
          square.on("pointerdown", () => {
            if (isRookActive) {
              // Move the rook to the selected square
              scene.socket.emit("moveRook", { x: x, y: rookPositionY });
              toggleRookActivity(); // Deactivate the rook
    
              // Remove the square highlights
              squares.forEach((s) => s.destroy());
            }
          });
    
          // Add the square to the array
          squares.push(square);
        }
    
        for (let y = rookPositionY + 1; y <= 7; y++) {
          const squareX = 20.42 + rookPositionX * sq + sq / 2;
          const squareY = 166.42 + y * sq + sq / 2;
    
          // Create a square sprite with breathing animation
          const square = scene.add.sprite(squareX, squareY, "rectangle");
          square.setScale(0.75); // Initial scale for the breathing effect
    
          // Add an animation to the square
          scene.tweens.add({
            targets: square,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1, // Infinite animation
          });
    
          // Event listener for tap or click on the square
          square.setInteractive();
          square.on("pointerdown", () => {
            if (isRookActive) {
              // Move the rook to the selected square
              scene.socket.emit("moveRook", { x: rookPositionX, y: y });
              toggleRookActivity(); // Deactivate the rook
    
              // Remove the square highlights
              squares.forEach((s) => s.destroy());
            }
          });
    
          // Add the square to the array
          squares.push(square);
        }
      }
    }
    
    // Function to toggle the activity state of the rook
    function toggleRookActivity() {
      isRookActive = !isRookActive;
    }

    // Function to determine movement direction based on old and new positions
    function getMovementDirection(oldX, oldY, newX, newY) {
    if (newX < oldX) {
        return "left";
      } else if (newY > oldY) {
        return "down";
      }
    }

    // Function to get the appropriate image key for the rook based on direction
    function getRookImageKey(direction) {
      // Choose the appropriate image key based on the direction
      switch (direction) {
        case "left":
          return "rookLeft";
        case "down":
          return "rookDown";
        default:
          return "rook"; // Default to the "rook" image
      }
    }
    
    // vertical grid line
    for (let i = 0; i <= 8; i++) {
      const x = 20.42 + i * sq; // Adjust spacing as needed
      this.add.line(0, 0, x, 0, x, 667, 0xffffff, 0.15).setOrigin(0, 0);
    }

    // horizontal grid lines
    for (let i = 0; i <= 15; i++) {
      const y = i * sq; // Adjust spacing as needed
      this.add.line(0, 0, 0, y, 375, y, 0xffffff, 0.15).setOrigin(0, 0);
    }

    // chessboard
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const x = 20.42 + col * sq; // Adjust spacing as needed
        const y = 166.42 + row * sq; // Adjust spacing as needed
        const isWhite = (row + col) % 2 === 0;

        if (isWhite) {
          // Create a white box
          this.add.rectangle(x, y, sq, sq, 0xffffff, 0.15).setOrigin(0, 0);
        }
      }
    }

    // labels for rows (1-8)
    for (let i = 0; i < 8; i++) {
      const y = 166.42 + sq * (i + 0.85); // Adjust positioning
      this.add
        .text(12.5, y, (i + 1).toString(), {
          font: "7.5px Arial",
          fill: "#fff",
          opacity: "0.15",
        })
        .setOrigin(0.5, 0.5);
    }
    
    // labels for columns (a-h)
    const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];

    for (let i = 0; i < 8; i++) {
      const x = sq * (i + 0.85) + 20; // Adjust positioning
      this.add
        .text(x, 157.5, columns[i], {
          font: "7.5px Arial",
          fill: "#fff",
          opacity: "0.15",
        })
        .setOrigin(0.5, 0.5);
    }

    // Add rotating finish image
    const finish = this.add.image(20.42+sq/2, 166.42+7.5*sq, 'finish');
    this.tweens.add({
      targets: finish,
      angle: 360, // Rotate 360 degrees (full circle)
      duration: 1500, // Rotation duration in milliseconds
      repeat: -1, // Repeat indefinitely
    })
  
    // Store the scene context
    const scene = this
    const timer1Sprite = this.add.sprite(187.5, 582, "opp_timer");
    const timeSprite = this.add.sprite(186, 80, "timer");

    // Notify server that the client is ready
    this.socket.emit("clientReady");

    // Receive player ID from the server
    this.socket.on("playerId", (playerId) => {
      console.log("Received playerId:", playerId);
      player = playerId;
    });

    let rook = null;
    let rookPositionX = null;
    let rookPositionY = null;
    let isRookActive = false;

    // Handle initial game state received from the server
    this.socket.on("initialGameState", (initialGameState) => {
      const { currentPlayer, rookPosition } = initialGameState;
      rookPositionX = rookPosition.x;
      rookPositionY = rookPosition.y;

      // Initialize rook sprite
      rook = this.add.sprite(
        20.42 + rookPositionX * sq + sq / 2,
        166.42 + rookPositionY * sq + sq / 2,
        "rook"
      );

      // Enable rook interactivity for the current player
      if (currentPlayer === player) {     
  
        rook.setInteractive(); // Allow interactions for the rook

        // Event listener for rook selection
        rook.on("pointerdown", () => {
          if (!isRookActive) {
            toggleRookActivity(isRookActive);
            highlightValidMoves(); // Highlight valid move squares
          }
        });
      }
    });

    // Handle updating game state received from the server
    function handleUpdateGameState(updatedGameState) {
      const direction = getMovementDirection(rookPositionX, rookPositionY, updatedGameState.rookPosition.x, updatedGameState.rookPosition.y);
      rookPositionX = updatedGameState.rookPosition.x;
      rookPositionY = updatedGameState.rookPosition.y;

      // Animate rook movement
      animateRook(rook, direction, () => {
        if (updatedGameState.currentPlayer === player) {
          // Enable rook interactivity for the current player
          rook.setInteractive();
          rook.on("pointerdown", () => {
            if (!isRookActive) {
              toggleRookActivity(isRookActive);
              highlightValidMoves();
            }
          });
        } else {
          // Disable rook interactivity for the opponent
          rook.disableInteractive();
        }
      });

    }

    // Animate rook movement
    function animateRook(rook, direction, onCompleteCallback) {
      // Get the appropriate image based on the direction
      const rookImageKey = getRookImageKey(direction);
      rook.setTexture(rookImageKey);
      
      // Tween to move the rook to the new position
      scene.tweens.add({
        targets: rook,
        x: 20.42 + rookPositionX * sq + sq / 2,
        y: 166.42 + rookPositionY * sq + sq / 2,
        duration: 2000, // Adjust the duration as needed
        onComplete: () => {
          rook.setTexture('rook'); // Set the rook's image
          onCompleteCallback();
        },
      });
    }    
    
    // Receive updated game state from the server
    this.socket.on('updateGameState', (updatedGameState) => {
      handleUpdateGameState(updatedGameState);
    });

    // Flag to track whether the game has ended
    let gameOver = false;

    // Handle game over event from the server
    this.socket.on('gameOver', (message) => {
      // Check if the game is already over
      if (!gameOver) {
        let textColor = '#fff'; // Default color

        // Determine text color based on win/lose message
        if (message.toLowerCase().includes('win')) {
          textColor = '#00ff00'; // Green color for win
        } else if (message.toLowerCase().includes('lost')) {
          textColor = '#ff0000'; // Red color for lose
        }

        // Display game over message on the screen
        const gameOverText = this.add.text(187.5, 332.25, message, {
          font: '18px Arial', // You can change the font here
          fill: textColor,
          wordWrap: { width: 325, useAdvancedWrap: true }
        });
        gameOverText.setOrigin(0.5);

        // Set flag to indicate game over
        gameOver = true;
      }
    });

  }
}

export default ChessBoard
