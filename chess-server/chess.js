const Chess = require('chess.js').Chess;

class chessGameWraper {
    constructor() {
        this.game = new Chess();
    }

    // Checks if the move is valid and returns the move if its legal, null if its not
    validateMove(sourceSquare,targetSquare,pieceType) {
        
        // get all moves
        const moves = this.game.moves({verbose: true});

        // Check if the move is valid
        const move_result = moves.find((move) => {

            var correct_promotion = true;

            // Get index of second char,as it will be the piece type to be promoted to.
            if (move.promotion) {

                const promotion = move.promotion.toLowerCase();
                const selectedPromotion = pieceType[1].toLowerCase();
                
                correct_promotion = selectedPromotion === promotion;
            }

            return move.from === sourceSquare && move.to === targetSquare && correct_promotion
        });

        return move_result;
    }

    makeMove(sourceSquare, targetSquare,pieceType) {

        // Check if the move is valid
        const move = this.validateMove(sourceSquare, targetSquare,pieceType);

        if (!move) {
            return {
                success: false,
                message: 'Invalid move',
                board: this.game.fen()
            }
        }       

        this.game.move(move);

        return {
            success: true,
            message: 'Move made successfully',
            board: this.game.fen()
        }
    }

    isGameOver = () => {
        if (game.isGameOver()) {
            if (game.isCheckmate()) {
                return true;
            } else if (game.isThreefoldRepetition()) {
                return true;
            } else if (game.isInsufficientMaterial()) {
                return true;

            } else if (game.isDraw()) {
                return true
            }
        }
        return false;
    }

    getBoard = () => {
        return this.game.fen();
    }

}

module.exports = chessGameWraper