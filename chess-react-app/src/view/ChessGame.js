import React, { useState, useEffect } from 'react';
import socket from './socket';
import { Chessboard } from "react-chessboard";
import { Chess } from 'chess.js';

function ChessGame({ roomKey }) {
    
    const [game, setGame] = useState(new Chess());

    const [textInput, setTextInput] = useState('');

    const [communicationLog, setCommunicationLog] = useState('Test');

    const transmitMove = () => {
        socket.emit('make-move', roomKey, textInput, (response) => {
            if (response.success) {
                console.log('Move made successfully', response);
            } else {
                console.error('Failed to make move:', response.message);
            }
        });
    }
    
    useEffect(() => {
        // Listen for board updates
        socket.on('update-board', (move) => {
            handleUpdateFromServer(move); // Update the board based on the received move
        });

        return () => socket.off('update-board');
    }, []);

    // Handle making moves
    const handleUpdateFromServer = (move) => {
        console.log('move: ', move);
        setCommunicationLog((previousLog) => {
            return previousLog + ' ' + move;
        })
    };

    const onDrop = (sourceSquare, targetSquare,pieceType) => {
        const piece = game.get(sourceSquare);

        // Check if it's a pawn moving to the last rank
        const isPromotion =
            piece?.type === "p" &&
            ((piece.color === "w" && targetSquare[1] === "8") || // White pawn to 8th rank
            (piece.color === "b" && targetSquare[1] === "1")); // Black pawn to 1st rank

        // get all moves
        const moves = game.moves({verbose: true});

        // Check if the move is valid
        const move = moves.find((move) => {

            var correct_promotion = true;

            // Get index of second char,as it will be the piece type to be promoted to.
            if (move.promotion) {

                const promotion = move.promotion.toLowerCase();
                const selectedPromotion = pieceType[1].toLowerCase();
                
                correct_promotion = selectedPromotion === promotion;
            }

            return move.from === sourceSquare && move.to === targetSquare && correct_promotion
        });

        // console.log('move: ', move);

        if (!move) {
            console.log('Invalid move');
            return false
        }       

        game.move(move);

        setGame(new Chess(game.fen())); // Update game state

        return true;
    };
  
    const resetGame = () => {
      setGame(new Chess()); // Reset the game
    };
    return (
        <div>
            <h1>Chess Game</h1>
            <h3>Room Key: {roomKey}</h3>
            <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} />
            <button onClick={transmitMove}>Make Move</button>
            <h3>{communicationLog}</h3>
            <div style={{width: "420px", height: "420px"}}>
                <Chessboard 
                    position={game.fen()} 
                    onPieceDrop={onDrop} />
            </div>
            <button onClick={resetGame} style={{ padding: "10px 20px", fontSize: "16px" }}>
                Reset Game
            </button>
            {
                game.isGameOver() && (
                    <div>
                        <h2>Game Over</h2>
                    </div>
                )
            }
        </div>
    );
}

export default ChessGame;