import { Color, Index } from "../types";
import { pawnMovement } from "../movements/pawnMovement";
import { Piece } from "../piece";

export class Pawn extends Piece {
    constructor(color: Color, index:Index) {
        const image =
            color === "black"
                ? "./pieces/BLACK_PAWN.png"
                : "./pieces/WHITE_PAWN.png";
        super(pawnMovement, color, image,index);
    }

    clone(): Pawn {
        return new Pawn(this.color, this.index)
        
    }
}
