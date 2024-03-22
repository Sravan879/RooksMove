import './index.css'
import Phaser from 'phaser';
import ChessBoard from './src/phaser/chessBoard';
import StartBoard from './src/phaser/startBoard';

const config = {
    type: Phaser.AUTO,
    width: 375,
    height: 667,
    id: 'canvas',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [StartBoard,ChessBoard]
};

// Create a Phaser game instance
const gameInstance = new Phaser.Game(config);

// Add HTML content as an overlay
document.querySelector('#app').innerHTML = `
    <div>
    </div>
`;
