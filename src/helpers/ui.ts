import { Square } from "@/model/types";
import { copyBoard, isCastlingMove } from "./game";
import { Piece } from "@/model/piece";


export const showValidBlocks = (
    piece: Piece,
    board: Square[][]
): Square[][] => {
    const copy = copyBoard(board);
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (piece.isLegalMove(piece.index, { x, y }, board)) {
                if (
                    board[y][x].piece &&
                    board[y][x].piece?.color !== piece.color
                ) {
                    copy[y][x].danger = true;
                } else {
                    copy[y][x].availibale = true;
                }
            }

            if (x === piece.index.x && y === piece.index.y) {
                copy[y][x].focus = true;
            }
            if(isCastlingMove(piece.index, {x,y}, piece.color, board)){
                copy[y][x].availibale = true;
            }

        }
    }

    return copy;
};

export const clearUiHelp = (board: Square[][]): Square[][] => {
    const copy = copyBoard(board);

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            copy[y][x].availibale = false;
            copy[y][x].focus = false;
            copy[y][x].danger = false;
        }
    }
    return copy;
};

export const nextChar = (c: string) => {
    return String.fromCharCode(c.charCodeAt(0) + 1);
};
