import { Color, Index } from "../types";
import { queenMovement } from "../movements/queenMovement";
import { Piece } from "../piece";

export class Queen extends Piece {
    constructor(color: Color, index:Index) {
        const image =
            color === "black"
                ? "./pieces/BLACK_QUEEN.png"
                : "./pieces/WHITE_QUEEN.png";
        super(queenMovement, color, image,index);
    }

    clone(): Queen {
        return new Queen(this.color, this.index)
        
    }
}
