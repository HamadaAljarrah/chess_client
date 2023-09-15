import { Piece } from "./pieces/piece";

export type Color = "white" | "black";

export type Winner = "White" | "Black" | null;

export type PieceName = "QUEEN" | "ROOK" | "BISHOP" | "KNIGHT";

export type Index = {
    x: number;
    y: number;
};

export interface PieceImage {
    value: PieceName;
    img: string;
}

export interface Square {
    color: Color;
    piece: Piece | null;
    index: Index;
    availibale: boolean;
    focus: boolean;
    danger: boolean;
    footPrint: boolean,
}

export interface PawnPromotion {
    showDialog: boolean;
    index: Index | null;
}

export interface RemoteMove {
    from: Index;
    to: Index;
    player: Color;
    isCheckmate: boolean;
    checkPos?: Index
    channel:string;
    
}

export interface RemoteCastle {
    color: Color; 
    index: Index;
    piece: PieceName;
    channel:string,

}