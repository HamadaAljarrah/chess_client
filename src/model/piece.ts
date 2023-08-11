import { copyBoard } from "@/helpers/game";
import { Color, Index, Square } from "./types";

export interface IMoveStrategy {
    canMove: (src: Index, dest: Index, board: Square[][]) => boolean;
}

export abstract class Piece {
    color: Color;
    img: string;
    index: Index;

    constructor(color: Color, img: string, index: Index) {
        this.color = color;
        this.img = img;
        this.index = index;
    }

    public makeMove(dest: Index, board: Square[][]): Square[][] {
        
        const copy = copyBoard(board);
        const newPiece = this.clone();
        newPiece.index = { x: dest.x, y: dest.y };
        copy[dest.y][dest.x].piece = newPiece;
        copy[this.index.y][this.index.x].piece = null;

        return copy;
    }

    abstract getValidMoves(board: Square[][]): Index[];
    abstract clone(): Piece;
}
