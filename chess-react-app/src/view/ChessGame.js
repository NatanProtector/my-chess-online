import React, { useState, useEffect } from 'react';
import socket from './socket';
import { Chessboard } from "react-chessboard";
import { Chess } from 'chess.js';

function ChessGame({ roomKey }) {
    
    const [game, setGame] = useState(new Chess());

    const getGameOverText = () => {
        if (game.isGameOver()) {
            if (game.isCheckmate()) {
                // Checkmate: Determine the winner based on the current turn.
                const winner = game.turn() === "w" ? "Black" : "White";
                return (`Checkmate! ${winner} wins.`);
            } else if (game.isThreefoldRepetition()) {
                return ("The game is a draw by threefold repetition.");
            } else if (game.isInsufficientMaterial()) {
                return ("The game is a draw due to insufficient material.");
            } else if (game.isDraw()) {
                return ("The game is a draw.");
            } else {
                return ""
            }
        }
    }

    const transmitMove = (transmition_data) => {
        socket.emit('make-move', roomKey, transmition_data, (response) => {
            if (response.success) {
                console.log('Move made successfully', response);
            } else {
                console.error('Failed to make move:', response.message);
            }
        });
    }
    
    useEffect(() => {
        // Listen for board updates
        socket.on('update-board', (update) => {
            handleUpdateFromServer(update); // Update the board based on the received move
        });

        socket.on('player-joined', (players) => {
            console.log(`Players: ${players}`);
            
        });

        return () => socket.off('update-board');
    }, []);

    // Handle making moves
    const handleUpdateFromServer = (update) => {

        console.log(update.message);

        setGame(
            new Chess(update.board)
        );

    };

    const onDrop = (sourceSquare, targetSquare,pieceType) => {
        
        const move = {sourceSquare, targetSquare,pieceType}

        transmitMove(move);

        return true;
    };

    return (
        <div>
            <h1>Chess Game</h1>
            <h3>Room Key: {roomKey}</h3>
            <div style={{width: "420px", height: "420px"}}>
                <Chessboard 
                    position={game.fen()} 
                    onPieceDrop={onDrop} />
            </div>

            {
                game.isGameOver() && (
                    <div>
                        <h2>{getGameOverText()}</h2>
                    </div>
                )
            }
        </div>
    );
}

export default ChessGame;