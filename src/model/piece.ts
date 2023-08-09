import { notChangingPosition } from "@/helpers/game";
import { Color, Index, Square } from "./types";

export interface IMoveStrategy {
    canMove: (src: Index, dest: Index, board: Square[][]) => boolean;
}

export abstract class Piece {
    private moveStrategy: IMoveStrategy;
    color: Color;
    img: string;
    index: Index;

    constructor(
        moveStrategy: IMoveStrategy,
        color: Color,
        img: string,
        index: Index
    ) {
        this.moveStrategy = moveStrategy;
        this.color = color;
        this.img = img;
        this.index = index;
    }

    public setMoveStrategy(moveStrategy: IMoveStrategy): void {
        this.moveStrategy = moveStrategy;
    }

    public isLegalMove(src: Index, dest: Index, board: Square[][]): boolean {
        if (notChangingPosition(src, dest)) {
            return false; // Not changing position
        }
        return this.moveStrategy.canMove(src, dest, board);
    }

    abstract clone(): Piece;
}
