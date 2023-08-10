import { Color, Index, Square } from "../types";
import { kingMovement } from "../movements/kingMovement";
import { Piece } from "../piece";
import { isSameIndex } from "@/helpers/game";

export class King extends Piece {
    private defualtIndex: Index;
    private firstMove: boolean;

    constructor(color: Color, index: Index, isFirstMove: boolean) {
        const image =
            color === "black"
                ? "./pieces/BLACK_KING.png"
                : "./pieces/WHITE_KING.png";
        super(kingMovement, color, image, index);
        this.firstMove = isFirstMove;
        this.defualtIndex = index
    }

    public isLegalMove(src: Index, dest: Index, board: Square[][]): boolean {

        if (!isSameIndex(this.index, this.defualtIndex)) {
            this.firstMove = false;
        }
        
        return super.isLegalMove(src, dest, board);
    }

    isFirstMove(): boolean {
        return this.firstMove;
    }

    clone(): King {
        return new King(this.color, this.index, this.firstMove);
    }
}
