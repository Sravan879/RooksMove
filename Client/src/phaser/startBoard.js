// Import necessary dependencies
import Phaser from 'phaser';
import io from 'socket.io-client';

// Define StartBoard class extending Phaser.Scene
class StartBoard extends Phaser.Scene {
    constructor() {
        super({ key: 'StartBoard' });
    }

    // Method to initialize scene
    create() {
        // Establish a socket connection to the server
        const socketConnection = io('http://localhost:3000');

        // Define the position of the "Start" button at the center of the screen
        const centerXPosition = this.cameras.main.centerX;
        const centerYPosition = this.cameras.main.centerY;

        // Create the "Start" button
        const startButton = this.add.text(centerXPosition, centerYPosition, 'Start', {
            font: '34px Arial',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive();

        // Listen for the 'playerCount' event from the server
        socketConnection.on('playerCount', (playerCount) => {
            // Check if there are at least two players
            if (playerCount >= 2) {
                // Transition to the ChessBoard scene when the button is clicked
                startButton.on('pointerdown', () => {
                    this.scene.start('ChessBoard', { socket: socketConnection });
                });
            }
        });
    }
}

// Export the StartBoard class as default
export default StartBoard;
