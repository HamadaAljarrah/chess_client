import { Color, Index, Square } from "../types";
import { Piece } from "../piece";
import {
    castle,
    inBoundary,
    isCastlingMove,
    isSameIndex,
} from "@/helpers/game";
import { Rook } from "./rook";

export class King extends Piece {
    private defualtIndex: Index;
    public firstMove: boolean;
    private castling: boolean;

    constructor(color: Color, index: Index, isFirstMove: boolean) {
        const image =
            color === "black"
                ? "./pieces/BLACK_KING.png"
                : "./pieces/WHITE_KING.png";
        super(color, image, index);
        this.firstMove = isFirstMove;
        this.defualtIndex = index;
        this.castling = false;
    }

    public clone(): King {
        return new King(this.color, this.index, this.firstMove);
    }

    private handleFirstMove(): void {
        if (!isSameIndex(this.index, this.defualtIndex)) this.firstMove = false;
    }

    public getValidMoves(board: Square[][]): Index[] {
        this.handleFirstMove();
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

            if (inBoundary(newX, newY)) {
                const destPiece = board[newY][newX].piece;
                const friend = destPiece && destPiece.color === this.color;

                if (!friend) {
                    indexes.push({ x: newX, y: newY });
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
                const rook = board[indexY][rookXindex].piece;
                const blockingIndices = rookXindex === 7 ? [6, 5] : [1, 2, 3];
                const hasBlockedPiece = blockingIndices.some(
                    (x) => board[indexY][x].piece
                );

                if (
                    this.firstMove &&
                    rook &&
                    (rook as Rook).firstMove &&
                    !hasBlockedPiece
                ) {
                    indexes.push({ x: newX, y: newY });
                    this.castling = true;
                }
            }
        }

        return indexes;
    }

    public makeMove(dest: Index, board: Square[][]): Square[][] {
        if (this.castling) {
            return castle(dest, this.color, board);
        } else {
            return super.makeMove(dest, board);
        }
    }
}
