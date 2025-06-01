import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socket"; // Use this in both HomePage and ChessGame
import "../index.css";

function HomePage() {
  const [roomKey, setRoomKey] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    socket.emit("create-room", (response) => {
      if (response.success) {
        setRoomKey(response.roomKey);
        navigate("/game", { state: { roomKey: response.roomKey } });
      }
    });
  };

  const joinRoom = () => {
    if (roomKey) {
      socket.emit("join-room", roomKey, (response) => {
        if (response.success) {
          navigate("/game", { state: { roomKey: response.roomKey } }); // Pass roomKey in state
        } else {
          alert(response.message || "Failed to join the room");
        }
      });
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Welcome to Natan's Chess Rooms</h1>
      </div>
      <div className="container">
        <div className="input-group">
          <button className="button" onClick={createRoom}>
            Create Room
          </button>
        </div>
        <div className="input-group">
          <input
            className="input-field"
            type="text"
            placeholder="Enter Room Key"
            value={roomKey}
            onChange={(e) => setRoomKey(e.target.value)}
          />
          <button className="button" onClick={joinRoom}>
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
