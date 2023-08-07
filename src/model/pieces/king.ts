import { Color, Index } from "../types";
import { kingMovement } from "../movements/kingMovement";
import { Piece } from "../piece";

export class King extends Piece {
    constructor(color: Color, index:Index) {
        const image =
            color === "black"
                ? "./pieces/BLACK_KING.png"
                : "./pieces/WHITE_KING.png";
        super(kingMovement, color, image,index);
    }
}
