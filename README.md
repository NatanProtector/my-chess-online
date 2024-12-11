# Chess Online

Welcome to **Chess Online**! You can play chess with your friends by creating rooms and sharing the room code. This game is deployed and ready to use. Check it out at [Chess Online](https://my-chess-online.onrender.com).

## Features

- **Create Room**: Users can create a room in the server.
- **Join Room**: Friends can join the room using a unique code.
- **Play Chess**: Play chess together in real-time with the React chessboard interface.
- **Real-time Game Updates**: The game updates in real-time as both players make moves.

## Tech Stack

- **Backend**: Node.js (Handles server logic, room creation, and game state)
- **Frontend**: React (User interface with React Chessboard)
- **Chess Logic**: [Chess.js](https://github.com/jhlywa/chess.js/) (for handling the game logic and rules)
- **Chessboard Display**: [React Chessboard](https://www.npmjs.com/package/react-chessboard) (for rendering the chessboard)

## How It Works

1. **Create a Room**: 
   - The user creates a game room on the website, and the server generates a unique room code.
   
2. **Join a Room**: 
   - Another user can join the created room using the room code.

3. **Play Chess**: 
   - The game begins, and both players can take turns moving pieces on the chessboard.
   - The game state is synchronized between players using WebSockets to ensure real-time gameplay.

4. **Chess Logic**: 
   - The game logic is handled by [Chess.js](https://github.com/jhlywa/chess.js/), ensuring that all the rules of chess are enforced.

5. **React Chessboard**: 
   - The game board is displayed using [React Chessboard](https://www.npmjs.com/package/react-chessboard), allowing players to see and interact with the chess pieces.

## Deployment

You can play the game live at the following link:  
[Chess Online](https://my-chess-online.onrender.com)

The server is deployed and fully functional, and you can start playing immediately.

## Future Plans

- The server is up and running, and it's possible to play chess. However, there's still room for visual improvements and polish. If you'd like to contribute to improving the user interface or the overall experience, feel free to contact me!
- I am currently taking a reinforcement learning class, and I plan to develop my own chess AI. Once the AI is ready, I will add the possibility to play against it in the app.

## Contributing

If you're interested in contributing to this project, feel free to fork the repository and open a pull request. Suggestions for visual improvements and enhancements are always welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to update the links or any details specific to your project, and you're good to go!