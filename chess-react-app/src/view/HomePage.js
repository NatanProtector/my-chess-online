import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socket"; // Use this in both HomePage and ChessGame
import "../index.css";

function HomePage() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for room list updates
    socket.on("room-list-update", (roomList) => {
      setRooms(roomList);
    });

    return () => {
      socket.off("room-list-update");
    };
  }, []);

  const createRoom = () => {
    socket.emit("create-room", (response) => {
      if (response.success) {
        navigate("/game", { state: { roomKey: response.roomKey } });
      }
    });
  };

  const joinRoom = (roomKey) => {
    socket.emit("join-room", roomKey, (response) => {
      if (response.success) {
        navigate("/game", { state: { roomKey: response.roomKey } });
      } else {
        alert(response.message || "Failed to join the room");
      }
    });
  };

  const getRoomStatus = (room) => {
    if (room.status === "player-left") {
      return "Game Over - Player Left";
    }
    if (room.isFull) {
      return "Game in Progress";
    }
    return "Waiting for Player";
  };

  return (
    <div>
      <div className="header">
        <h1>Welcome to Natan's Chess Rooms</h1>
      </div>
      <div className="container">
        <div className="input-group">
          <button className="button" onClick={createRoom}>
            Create New Room
          </button>
        </div>

        <div className="rooms-container">
          <h2>Active Rooms</h2>
          {rooms.length === 0 ? (
            <p className="no-rooms">
              No active rooms. Create one to start playing!
            </p>
          ) : (
            <div className="room-list">
              {rooms.map((room) => (
                <div key={room.key} className="room-item">
                  <div className="room-info">
                    <span className="room-key">Room: {room.key}</span>
                    <span className="room-status">{getRoomStatus(room)}</span>
                    <span className="player-count">
                      {room.playerCount}/2 Players
                    </span>
                  </div>
                  <div className="room-actions">
                    {!room.isFull && room.status !== "player-left" && (
                      <button
                        className="button"
                        onClick={() => joinRoom(room.key)}
                      >
                        Join Game
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
