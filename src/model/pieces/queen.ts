import { Color, Index, Square } from "../types";
import { Piece } from "./piece";
import { inBoundary } from "@/helpers/game";

export class Queen extends Piece {
    constructor(color: Color, index:Index) {
        const image =
            color === "black"
                ? "./pieces/BLACK_QUEEN.png"
                : "./pieces/WHITE_QUEEN.png";
        super(color, image,index,9);
    }

    public clone(): Queen {
        return new Queen(this.color, this.index)
        
    }

    getValidMoves(board: Square[][]): Index[] {
        const indexes: Index[] = [];
        const { x, y } = this.index;

        const possibleMoves = [
            { dx: 1, dy: 1 }, // Down-right
            { dx: 1, dy: -1 }, // Up-right
            { dx: -1, dy: 1 }, // Down-left
            { dx: -1, dy: -1 }, // Up-left
            { dx: 1, dy: 0 }, // Right
            { dx: -1, dy: 0 }, // Left
            { dx: 0, dy: 1 }, // Down
            { dx: 0, dy: -1 }, // Up
            
        ];

        for (const move of possibleMoves) {
            let newX = x + move.dx;
            let newY = y + move.dy;

            while (inBoundary(newX, newY)) {
                const piece = board[newY][newX].piece;


                if (!board[newY][newX].piece) {
                    indexes.push({ x: newX, y: newY });

                } else if (piece && piece.color !== this.color) {
                    
                    indexes.push({ x: newX, y: newY });
                    break; // Stop in this direction after capturing

                } else {
                    
                    break; // Stop in this direction if a friendly piece is encountered
                }

                newX += move.dx;
                newY += move.dy;
            }
        }

        return indexes;
    }
}
