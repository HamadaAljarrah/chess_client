import { Color, Index, Square } from "../types";
import { Piece } from "./piece";
import {  inBoundary, isSameIndex } from "@/helpers/game";

export class Rook extends Piece {
    private defualtIndex: Index;
    public firstMove: boolean;

    constructor(color: Color, index: Index, firstMove: boolean) {
        const image =
            color === "black"
                ? "./pieces/BLACK_ROOK.png"
                : "./pieces/WHITE_ROOK.png";
        super(color, image, index,5);
        this.firstMove = firstMove;
        this.defualtIndex = index;
    }

    public clone(): Rook {
        return new Rook(this.color, this.index, this.firstMove);
    }

    private handleFirstMove ():void{
        if(!isSameIndex(this.index, this.defualtIndex))
            this.firstMove = false;
    }

    public getValidMoves(board: Square[][]): Index[] {
        this.handleFirstMove();
        const { x, y } = this.index;
        const indexes: Index[] = [];

        const possibleMoves = [
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
