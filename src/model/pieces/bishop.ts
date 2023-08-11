import { Color, Index, Square } from "../types";
import { Piece } from "../piece";
import { inBoundary } from "@/helpers/game";

export class Bishop extends Piece {
    constructor(color: Color, index: Index) {
        const image =
            color === "black"
                ? "./pieces/BLACK_BISHOP.png"
                : "./pieces/WHITE_BISHOP.png";
        super(color, image, index);
    }

    public clone(): Bishop {
        return new Bishop(this.color, this.index);
    }

    public getValidMoves(board: Square[][]): Index[] {
        const { x, y } = this.index;
        const indexes: Index[] = [];

        const possibleMoves = [
            { dx: 1, dy: 1 }, // Down-right
            { dx: 1, dy: -1 }, // Up-right
            { dx: -1, dy: 1 }, // Down-left
            { dx: -1, dy: -1 }, // Up-left
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
