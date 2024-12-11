import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from './socket'; // Use this in both HomePage and ChessGame


function HomePage() {
    const [roomKey, setRoomKey] = useState('');
    const navigate = useNavigate();

    const createRoom = () => {
        socket.emit('create-room', (response) => {
            if (response.success) {
                setRoomKey(response.roomKey);
                navigate('/game', { state: { roomKey: response.roomKey } });
            }
        });
    };

    const joinRoom = () => {
        if (roomKey) {
            socket.emit('join-room', roomKey, (response) => {
                if (response.success) {
                    navigate('/game', { state: { roomKey: response.roomKey } }); // Pass roomKey in state
                } else {
                    alert(response.message || 'Failed to join the room');
                }
            });
        }
    };

    return (
        <div>
            <h1>Welcome to Natan's Chess Rooms</h1>
            <button onClick={createRoom}>Create Room</button>
            <div>
                <input
                    type="text"
                    placeholder="Enter Room Key"
                    value={roomKey}
                    onChange={(e) => setRoomKey(e.target.value)}
                />
                <button onClick={joinRoom}>Join Room</button>
            </div>
        </div>
    );
}

export default HomePage;
