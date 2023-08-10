import { IMoveStrategy } from "../piece";
import { Index, Square } from "../types";


export const rookMovement: IMoveStrategy = {
    canMove: (src: Index, dest: Index, board: Square[][]) => {

        const diffX = Math.abs(src.x - dest.x);
        const diffY = Math.abs(src.y - dest.y);

        if (diffX * diffY !== 0) {
            return false; // Not moving straight
        }

        const dx = Math.sign(dest.x - src.x); // Direction of movement on x-axis
        const dy = Math.sign(dest.y - src.y); // Direction of movement on y-axis

        let x = src.x + dx;
        let y = src.y + dy;

        while (x !== dest.x || y !== dest.y) {
            
            if (board[y][x]?.piece !== null) {
                return false; // Collision detected
            }

            x += dx;
            y += dy;
        }

        const destBlock = board[dest.y][dest.x];
        const srcBlock = board[src.y][src.x];
        
        if (destBlock.piece !== null && destBlock.piece.color === srcBlock.piece?.color) {
            return false; // Cannot capture a piece of the same color
        }

        return true; // No collision and valid move
    },
};