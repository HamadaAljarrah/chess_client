import { Piece } from "./piece";

export type Color = "white" | "black";

export type Index = {
    x: number;
    y: number;
};

export interface Square {
    color: Color;
    piece: Piece | null;
    index: Index;
    availibale: boolean;
    focus: boolean;
    danger: boolean
}
