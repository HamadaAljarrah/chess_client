import { IMoveStrategy } from "../piece"
import { Index, Square } from "../types";



export const pawnMovement: IMoveStrategy = {
    canMove: (src: Index, dest: Index, board: Square[][]) => {
        
        const dx = src.x - dest.x;
        const dy = src.y - dest.y;

        const srcBlock = board[src.y][src.x];
        const destBlock = board[dest.y][dest.x];

    
        if (srcBlock.piece?.color === 'white') {
            // White pawn moves upwards

            // Moving one square forward
            if (dy === 1 && dx === 0 && board[dest.y][dest.x].piece === null) {
                return true;
            }

            // Capturing diagonally
            if (dy === 1 && Math.abs(dx) === 1 && board[dest.y][dest.x].piece !== null && destBlock.piece?.color !== srcBlock.piece.color) {
                return true;
            }

            // Moving two squares on the first move
            if (src.y === 6 && dy === 2 && dx === 0 && board[src.y -1][src.x].piece === null && board[src.y -2][src.x].piece === null) {
                return true;
            }

        } else if (srcBlock.piece?.color === 'black') {
            // Black pawn moves downwards (increasing y)

            // Moving one square forward
            if (dy === -1 && dx === 0 && destBlock.piece === null) {
                return true;
            }

            // Capturing diagonally
            if (dy === -1 && Math.abs(dx) === 1 && destBlock.piece !== null && destBlock.piece?.color !== srcBlock.piece.color) {
                return true;
            }

            // Moving two squares on the first move
            if (src.y === 1 && dy === -2 && dx === 0 && board[src.y + 1][src.x].piece === null && board[src.y + 2][src.x].piece === null) {
                return true;
            }
        }

        return false; // Invalid move
    },
};