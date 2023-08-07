import { Color, Index } from "../types";
import { rookMovement } from "../movements/rookMovement";
import { Piece } from "../piece";

export class Rook extends Piece {
    constructor(color: Color, index:Index) {
        const image =
            color === "black"
                ? "./pieces/BLACK_ROOK.png"
                : "./pieces/WHITE_ROOK.png";
        super(rookMovement, color, image,index);
    }
}
