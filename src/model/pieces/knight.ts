import { Color, Index, Square } from "../types";
import { Piece } from "./piece";
import {  inBoundary } from "@/helpers/game";

export class Knight extends Piece {
    constructor(color: Color, index: Index) {
        const image =
            color === "black"
                ? "./pieces/BLACK_KNIGHT.png"
                : "./pieces/WHITE_KNIGHT.png";
        super(color, image, index,3);
    }

    public clone(): Knight {
        return new Knight(this.color, this.index);
    }

    public getValidMoves(board: Square[][]): Index[] {
        const indexes: Index[] = [];
        const { x, y } = this.index;

        const possibleMoves = [
            { dx: 1, dy: 2 },
            { dx: -1, dy: 2 },
            { dx: 2, dy: 1 },
            { dx: 2, dy: -1 },
            { dx: 1, dy: -2 },
            { dx: -1, dy: -2 },
            { dx: -2, dy: 1 },
            { dx: -2, dy: -1 },
        ];

        for (const move of possibleMoves) {
            const newX = x + move.dx;
            const newY = y + move.dy;

            if (inBoundary(newX, newY)) {
                const destPiece = board[newY][newX].piece;
                const friend = destPiece && destPiece.color === this.color;
                
                if (!friend) {
                    indexes.push({ x: newX, y: newY });
                }
            }
        }

        return indexes;
    }

}
