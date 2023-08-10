import { Color, Index, Square } from "../types";
import { rookMovement } from "../movements/rookMovement";
import { Piece } from "../piece";
import { copyBoard, isSameIndex } from "@/helpers/game";

export class Rook extends Piece {
    private defualtIndex: Index;
    private firstMove: boolean;

    constructor(color: Color, index: Index, firstMove: boolean) {
        const image =
            color === "black"
                ? "./pieces/BLACK_ROOK.png"
                : "./pieces/WHITE_ROOK.png";
        super(rookMovement, color, image, index);
        this.firstMove = firstMove;
        this.defualtIndex = index;
    }

    public isLegalMove(src: Index, dest: Index, board: Square[][]): boolean {
        if (!isSameIndex(this.index, this.defualtIndex)) {
            this.firstMove = false;
        }

        return super.isLegalMove(src, dest, board);
    }

    clone(): Rook {
        return new Rook(this.color, this.index, this.firstMove);
    }

    isFirstMove(): boolean {
        return this.firstMove;
    }

    getReachableSquares(board: Square[][]): Square[][] {

        
        return board;
    }
}
