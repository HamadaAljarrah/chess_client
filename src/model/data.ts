import { Color, PieceName } from "./types";
interface PawnPromotion {
    value: PieceName;
    img: string;
}

export const PromotionPieces: Record<Color,PawnPromotion[]> = {
    black: [
        {value: 'QUEEN', img: "./pieces/BLACK_QUEEN.png"},
        {value: 'BISHOP', img: "./pieces/BLACK_BISHOP.png"},
        {value: 'KNIGHT', img: "./pieces/BLACK_KNIGHT.png"},
        {value: 'ROOK', img: "./pieces/BLACK_ROOK.png"},

    ],
    white: [
        {value: 'QUEEN', img: "./pieces/WHITE_QUEEN.png"},
        {value: 'BISHOP', img: "./pieces/WHITE_BISHOP.png"},
        {value: 'KNIGHT', img: "./pieces/WHITE_KNIGHT.png"},
        {value: 'ROOK', img: "./pieces/WHITE_ROOK.png"},
    ]
}
