/**
 * Problems:
 * - The game is only deletes when the room is empty after a player leaves, which is a massive flaw.
 * - The same player can connect twice to the same room
 * - The player is disconnected only when tab is closed
 * - players make moves for both white and black
 * -
 */

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const chessGameWraper = require("./chess.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = {}; // Store active rooms and players

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "..", "chess-react-app", "build")));

// Enable CORS
app.use(cors());

// Function to broadcast room list to all clients
const broadcastRoomList = () => {
  const roomList = Object.entries(rooms).map(([key, room]) => ({
    key,
    playerCount: room.players.length,
    isFull: room.players.length >= 2,
    status: room.status || "waiting", // 'waiting', 'playing', 'player-left'
  }));
  io.emit("room-list-update", roomList);
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send initial room list to new connection
  broadcastRoomList();

  // Create a room
  socket.on("create-room", (callback) => {
    console.log(`creating room`);
    const roomKey = Math.random().toString(36).substring(2, 8);
    rooms[roomKey] = {
      players: [],
      game: new chessGameWraper(),
      game_arangement: null,
      status: "waiting",
    };
    rooms[roomKey].players.push(socket.id);
    socket.join(roomKey);
    console.log(`Room created: ${roomKey}`);
    broadcastRoomList();
    callback({ success: true, roomKey: roomKey });
  });

  // Join a room
  socket.on("join-room", (roomKey, callback) => {
    if (!rooms[roomKey]) {
      callback({ success: false, message: "Room does not exist" });
      return;
    }

    if (rooms[roomKey].status === "player-left") {
      callback({
        success: false,
        message: "Game is over - waiting for players to leave",
      });
      return;
    }

    if (rooms[roomKey].players.length < 2) {
      rooms[roomKey].players.push(socket.id);
      socket.join(roomKey);
      callback({ success: true, roomKey: roomKey });
      broadcastRoomList();

      if (rooms[roomKey].players.length === 2) {
        const game_arangement = [];
        const colors = ["b", "w"];
        rooms[roomKey].players.forEach((element) => {
          game_arangement.push({
            id: element,
            color: colors.pop(),
          });
        });

        rooms[roomKey].game_arangement = game_arangement;
        rooms[roomKey].status = "playing";

        setTimeout(() => {
          io.to(roomKey).emit("player-joined", game_arangement);
        }, 100);
      }
    } else {
      callback({ success: false, message: "Room is full" });
    }
  });

  // Make a move
  socket.on("make-move", (roomKey, move, callback) => {
    if (!rooms[roomKey] || rooms[roomKey].status !== "playing") {
      callback({ success: false, message: "Game is not active" });
      return;
    }

    if (rooms[roomKey].game_arangement == null) {
      callback({ success: false, message: "Game not started" });
      return;
    }

    // Check correct turn
    if (
      rooms[roomKey].game.turn() !==
      rooms[roomKey].game_arangement.find((player) => player.id === socket.id)
        ?.color
    ) {
      callback({ success: false, message: "It is not your turn" });
      return;
    }

    const result = rooms[roomKey].game.makeMove(
      move.sourceSquare,
      move.targetSquare,
      move.pieceType
    );

    if (result && result.success) {
      const update = {
        message: result.message,
        board: rooms[roomKey].game.getBoard(),
      };

      io.to(roomKey).emit("update-board", update);
      callback({ success: true, message: "Move accepted" });
    } else {
      callback({ success: false, message: "Invalid move" });
    }
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    for (const [key, room] of Object.entries(rooms)) {
      if (room.players.includes(socket.id)) {
        room.players = room.players.filter((id) => id !== socket.id);

        if (room.status === "playing") {
          room.status = "player-left";
          io.to(key).emit("player-left", {
            message: "A player has left the game",
          });
        }

        broadcastRoomList();
      }

      if (room.players.length === 0) {
        delete rooms[key];
        console.log(`Room ${key} deleted`);
        broadcastRoomList();
      }
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "src", "index.html"));
});
app.get("/game/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "chess-react-app", "build", "index.html")
  );
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
