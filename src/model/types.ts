import { Piece } from "./piece";

export type Color = "white" | "black";

export type Winner = "White" | "Black" | null;

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
    danger: boolean;
}

export type PieceName = "QUEEN" | "ROOK" | "BISHOP" | "KNIGHT";
export interface PawnPromotion{
    showDialog: boolean,
    index: Index | null
}