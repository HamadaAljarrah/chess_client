import { Color, Index, Square } from "../types";
import { Piece } from "../piece";
import { castle, inBoundary } from "@/helpers/game";
import { Rook } from "./rook";

export class King extends Piece {
    public firstMove: boolean;

    constructor(color: Color, index: Index, isFirstMove: boolean) {
        const image =
            color === "black"
                ? "./pieces/BLACK_KING.png"
                : "./pieces/WHITE_KING.png";
        super(color, image, index);
        this.firstMove = isFirstMove;
    }

    public clone(): King {
        return new King(this.color, this.index, this.firstMove);
    }

    public getValidMoves(board: Square[][]): Index[] {
        const indexes: Index[] = [];
        const { x, y } = this.index;

        const possibleMoves = [
            { dx: 1, dy: 0 }, // Right
            { dx: -1, dy: 0 }, // Left
            { dx: 0, dy: 1 }, // Down
            { dx: 0, dy: -1 }, // Up
            { dx: 1, dy: 1 }, // Down-right
            { dx: 1, dy: -1 }, // Up-right
            { dx: -1, dy: 1 }, // Down-left
            { dx: -1, dy: -1 }, // Up-left
        ];

        for (const move of possibleMoves) {
            const newX = x + move.dx;
            const newY = y + move.dy;
            const dest = { x: newX, y: newY };
            if (inBoundary(newX, newY)) {
                const piece = board[newY][newX].piece;
                if (!piece || piece.color !== this.color) {
                    indexes.push(dest);
                }
            }
        }

        const castleMoves = [
            { dx: 2, dy: 0 }, // Castling
            { dx: -2, dy: 0 }, // Castling
        ];
        const indexY = this.color === "white" ? 7 : 0;

        for (const move of castleMoves) {
            const newX = x + move.dx;
            const newY = y + move.dy;
            const rookXindex = move.dx === 2 ? 7 : 0;

            if (inBoundary(newX, newY)) {
                const rook = board[indexY][rookXindex].piece; // Rook exist
                const blockingIndices = rookXindex === 7 ? [6, 5] : [1, 2, 3]; // Determine which rook
                const hasBlockedPiece = blockingIndices.some(
                    (x) => board[indexY][x].piece
                ); // No blocking pieces betweem king and rook

                if (
                    this.firstMove &&
                    rook &&
                    (rook as Rook).firstMove &&
                    !hasBlockedPiece
                ) {
                    indexes.push({ x: newX, y: newY });
                }
            }
        }

        return indexes;
    }

    public makeMove(dest: Index, board: Square[][]): Square[][] {
        this.firstMove = false;
        const castling = Math.abs(dest.x - this.index.x) === 2;
        if (castling) {
            return castle(dest, this.color, board);
        } else {
            return super.makeMove(dest, board);
        }
    }
}
