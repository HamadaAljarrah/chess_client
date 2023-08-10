import { safeBlock } from "@/helpers/game";
import { IMoveStrategy } from "../piece";
import { Index, Square } from "../types";

export const kingMovement: IMoveStrategy = {
    canMove: (src: Index, dest: Index, board: Square[][]) => {
        const dx = Math.abs(src.x - dest.x);
        const dy = Math.abs(src.y - dest.y);


        // Safe block
        // const king = board[src.x][src.y].piece;
        // if(king && !safeBlock(src,king.color,board)){
        //     return false;
        // }


        // Check for valid single-square move (including diagonals)
        if (
            (dx === 1 && dy === 0) ||
            (dx === 0 && dy === 1) ||
            (dx === 1 && dy === 1)
        ) {
            const destBlock = board[dest.x][dest.y];
            const srcBlock = board[src.x][src.y];

            // Same color piece check
            if (
                destBlock.piece !== null &&
                destBlock.piece?.color === srcBlock.piece?.color
            ) {
                return false; // Cannot capture a piece of the same color
            }

            return true; // Valid move
        }

        return false; // Invalid move
    },
};
