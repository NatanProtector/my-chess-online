const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');


const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = {}; // Store active rooms and players

// Serve static files from the React app
app.use(express.static(path.join(__dirname,'..','chess-react-app', 'build')));

// Enable CORS
app.use(cors());

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Create a room
    socket.on('create-room', (callback) => {
        console.log(`creating room`);
        
        const roomKey = Math.random().toString(36).substring(2, 8); // Generate a random 6-char key
        rooms[roomKey] = { players: [] };
        socket.join(roomKey);
        console.log(`Room created: ${roomKey}`);
        callback(roomKey); // Send the key back to the client
    });

    // Join a room
    socket.on('join-room', (roomKey, callback) => {
        if (rooms[roomKey] && rooms[roomKey].players.length < 2) {
            rooms[roomKey].players.push(socket.id);
            socket.join(roomKey);
            console.log(`User ${socket.id} joined room ${roomKey}`);
            callback({ success: true });
            console.log(`Players: ${rooms[roomKey].players.join(', ')}`);
            io.to(roomKey).emit('player-joined', rooms[roomKey].players); // Notify both players
        } else {
            callback({ success: false, message: 'Room is full or does not exist' });
        }
    });

    // Make a move
    socket.on('make-move', (roomKey, move, callback) => {
        console.log(`Move in room ${roomKey}:`,move);

        // Validate the move or perform necessary checks here if needed
        const isValid = true; // Replace this with your actual validation logic

        if (isValid) {
            // Broadcast the move to other clients in the room
            socket.broadcast.to(roomKey).emit('update-board', move);

            // Respond to the client with success
            callback({ success: true, message: 'Move accepted' });
        } else {
            // Respond to the client with an error
            callback({ success: false, message: 'Invalid move' });
        }
    });

    // Handle disconnects
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const [key, room] of Object.entries(rooms)) {
            if (room.players.includes(socket.id)) {
                room.players = room.players.filter((id) => id !== socket.id);
                io.to(key).emit('player-left', socket.id);
                if (room.players.length === 0) delete rooms[key];
                break;
            }
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..','build','src', 'index.html'));    
    // Respond with the react app
})
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'chess-react-app', 'build', 'index.html'));
  });

server.listen(3000, () => {
    console.log('Server running on port 3000');
});