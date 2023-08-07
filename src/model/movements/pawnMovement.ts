import { IMoveStrategy } from "../piece"
import { Index, Square } from "../types";



export const pawnMovement: IMoveStrategy = {
    canMove: (src: Index, dest: Index, board: Square[][]) => {
        
        const dx = src.x - dest.x;
        const dy = src.y - dest.y;

        const srcBlock = board[src.x][src.y];

     

        if (srcBlock.piece?.color === 'white') {
            // White pawn moves upwards (decreasing y)

            // Moving one square forward
            if (dx === 1 && dy === 0 && board[dest.x][dest.y].piece === null) {
                return true;
            }

            // Capturing diagonally
            if (dx === 1 && Math.abs(dy) === 1 && board[dest.x][dest.y].piece !== null) {
                return true;
            }

            // Moving two squares on the first move
            if (src.x === 6 && dx === 2 && dy === 0 && board[src.x - 1][src.y].piece === null) {
                return true;
            }

        } else if (srcBlock.piece?.color === 'black') {
            // Black pawn moves downwards (increasing y)

            // Moving one square forward
            if (dx === -1 && dy === 0 && board[dest.x][dest.y].piece === null) {
                return true;
            }

            // Capturing diagonally
            if (dx === -1 && Math.abs(dy) === 1 && board[dest.x][dest.y].piece !== null) {
                return true;
            }

            // Moving two squares on the first move
            if (src.x === 1 && dx === -2 && dy === 0 && board[src.x + 1][src.y].piece === null) {
                return true;
            }
        }

        return false; // Invalid move
    },
};