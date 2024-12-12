import React, { useState, useEffect } from 'react';
import socket from './socket';
import { Chessboard } from "react-chessboard";
import { Chess } from 'chess.js';

function ChessGame({ roomKey }) {
    
    const [game, setGame] = useState(new Chess());

    const [game_arangement, setGameArangement] = useState([]);

    const [game_state_text, setGameStateText] = useState("");

    const getMyColor = (game_arangement) => {
        const myColor = game_arangement.find((player) => player.id === socket.id)?.color;
        return myColor;
    };

    const updateGameStateText = () => {
        const myColor = getMyColor(game_arangement);
        const currentTurnColor = game.turn() === "w" ? "White" : "Black";

        var result = ""

        if (game_arangement.length < 2) {
            result = ("Waiting for second player");
        }
        else if (game.isGameOver()) {
            if (game.isCheckmate()) {
                // Checkmate: Determine the winner based on the current turn.       
                result = (`Checkmate! ${currentTurnColor} wins.`);
            } else if (game.isThreefoldRepetition()) {
                result = ("The game is a draw by threefold repetition.");
            } else if (game.isInsufficientMaterial()) {
                result = ("The game is a draw due to insufficient material.");
            } else if (game.isDraw()) {
                result = ("The game is a draw.");
            } else {
                result = ("Game Over")
            }
        } else {
            
            if (myColor === game.turn()) {

                result = ("Your turn");

            } else {

                result = (`${currentTurnColor}'s turn`);
            }
               
        }
        setGameStateText(result);
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
            handleUpdateFromServer(update);
            updateGameStateText();
        });

        socket.on('player-joined', (game_arangement) => {

            handlePlayerJoined(game_arangement);
            updateGameStateText();
        });        

        return () => socket.off('update-board');
    }, []);

    useEffect(() => {
        updateGameStateText();
    }, [game, game_arangement]);

    const handleUpdateFromServer = (update) => {

        setGame(
            new Chess(update.board)
        );

    };

    const handlePlayerJoined = (game_arangement) => {

        setGameArangement(game_arangement);
    }

    const onDrop = (sourceSquare, targetSquare,pieceType) => {
        
        const move = {sourceSquare, targetSquare,pieceType}

        if (game.turn() !== getMyColor(game_arangement)) {
            console.log("It is not your turn");
            return false;
        }        

        transmitMove(move);

        return true;
    };

    return (
        <div>
            <h1>Chess Game</h1>
            <h3>Room Key: {roomKey}</h3>
            <h3>{game_state_text}</h3>
            <div style={{width: "420px", height: "420px"}}>
                {
                    game_arangement.length === 2 &&
                        <Chessboard 
                        boardOrientation={getMyColor(game_arangement) === "w" ? "white" : "black"}
                        position={game.fen()} 
                        onPieceDrop={onDrop}
                    />     
                }

            </div>
        </div>
    );
}

export default ChessGame;