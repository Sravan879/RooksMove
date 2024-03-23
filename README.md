## INTRODUCTION

## RooksMove:
RooksMove is an engaging multiplayer game played on an 8x8 chessboard. Players strategically move their rooks across the board, aiming to reach the bottom-left corner before their opponent. Here's how it works:

Game Objective: The objective is to maneuver your rook to the bottom-left corner of the chessboard before your opponent does.

Movement Rules: Players take turns moving their rooks. Each turn, a player can move their rook any number of steps to the left or down, but not up, right, or diagonally.

Turn Timer: Each player has a time limit of 30 seconds to make their move. If a player exceeds this time limit, they lose the game.

## SERVER SETUP

## Clone the Repository
Start by cloning the RookMove repository to your local machine:
 
***
git clone https://github.com/Sravan879/RooksMove.git
***

## Navigate to the Server Directory

***
cd RookMove/ServerSide
***

## Install Node Modules
Next, install the required Node.js packages and dependencies for the server:

***
npm install
***

## Start the Server
To launch the server, use nodemon, a tool that automatically restarts the server upon code changes:

***
npm start
***

## Restart the Server
If needed, manually restart the server using the shortcut:

***
rs
***

## CLIENT SETUP

## Navigate Back to the Parent Directory
Return to the parent directory of the repository:

***
cd..
***

## Navigate to the Client Directory
Access the client directory:

***
cd ClientSide
***

## Install Node Modules
Install the necessary Node.js packages and dependencies for the client:

***
npm install
***

## Start the Client
Launch the client application:

***
npm run dev
***

This command opens the client application in a web browser, displaying the local host address. Keep this terminal window open.

## Open the Client in a New Tab
Open a new tab in your web browser and enter the same local host address displayed in the terminal. This action initializes a second client for multiplayer gameplay.

## Restart the Client
To restart the client application, use the following command:

***
r
***

