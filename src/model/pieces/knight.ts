import { Color, Index } from "../types";
import { knightMovement } from "../movements/knightMovement";
import { Piece } from "../piece";

export class Knight extends Piece {
    constructor(color: Color, index:Index) {
        const image =
            color === "black"
                ? "./pieces/BLACK_KNIGHT.png"
                : "./pieces/WHITE_KNIGHT.png";
        super(knightMovement, color, image, index);
    }

    clone(): Knight {
        return new Knight(this.color, this.index)
        
    }
}
