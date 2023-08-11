import { Square } from "@/model/types";
import { copyBoard } from "./game";
import { Piece } from "@/model/piece";

export const showPossibleMoves = (piece: Piece,board: Square[][]): Square[][] => {
    const copy = copyBoard(board);
    const possibleMoves = piece.getValidMoves(copy);
    possibleMoves.forEach((index) => {
        const destPiece = copy[index.y][index.x].piece;
        if (destPiece && destPiece.color !== piece.color) {
            copy[index.y][index.x].danger = true;
        } else {
            copy[index.y][index.x].availibale = true;
        }
    });

    copy[piece.index.y][piece.index.x].focus = true;
    return copy;
};

export const clearPossibleMoves = (board: Square[][]): Square[][] => {
    const copy = copyBoard(board);

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (copy[y][x].availibale) {
                copy[y][x].availibale = false;
            }

            if (copy[y][x].focus) {
                copy[y][x].focus = false;
            }

            if (copy[y][x].danger) {
                copy[y][x].danger = false;
            }
        }
    }
    return copy;
};

export const nextChar = (c: string) => {
    return String.fromCharCode(c.charCodeAt(0) + 1);
};
