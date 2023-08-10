import { IMoveStrategy } from "../piece";
import { Index, Square } from "../types";

export const knightMovement: IMoveStrategy = {
    canMove: (src: Index, dest: Index, board: Square[][]) => {
        if (Math.abs(src.x - dest.x) * Math.abs(src.y - dest.y) !== 2) {
            return false;
        }

        const destBlock = board[dest.y][dest.x];
        const srcBlock = board[src.y][src.x];

        if (
            destBlock.piece !== null &&
            destBlock.piece.color === srcBlock.piece?.color
        ) {
            return false; // Cannot capture a piece of the same color
        }

        return true;
    },
};
