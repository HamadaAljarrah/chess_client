import { Color, Index } from "../types";
import { bishopMovement } from "../movements/bishopMovement";
import { Piece } from "../piece";

export class Bishop extends Piece {
    constructor(color: Color, index:Index) {
        const image =
            color === "black"
                ? "./pieces/BLACK_BISHOP.png"
                : "./pieces/WHITE_BISHOP.png";
        super(bishopMovement, color, image, index);
    }

    clone(): Bishop {
        return new Bishop(this.color, this.index)
    }  
}
