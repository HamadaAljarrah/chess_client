import { IMoveStrategy } from "../piece";
import { Index, Square } from "../types";

export const bishopMovement: IMoveStrategy = {
    canMove: (src: Index, dest: Index, board: Square[][]) => {

        if (Math.abs(src.x - dest.x) !== Math.abs(src.y - dest.y)) {
            return false; // Not moving diagonally
        }

        const dx = src.x < dest.x ? 1 : -1; // Direction of movement on x-axis
        const dy = src.y < dest.y ? 1 : -1; // Direction of movement on y-axis

        
        let x = src.x + dx;
        let y = src.y + dy;

        while (x !== dest.x && y !== dest.y) {
            
            if (board[x][y].piece !== null) {
                return false; // Collision detected
            }
            x += dx;
            y += dy;
        }

        const destBlock = board[dest.x][dest.y];
        const srcBlock = board[src.x][src.y];

        if (destBlock.piece !== null && destBlock.piece.color === srcBlock.piece?.color) {
            return false; // Cannot capture a piece of the same color
        }

        return true; // No collisions and valid move
    },
};
