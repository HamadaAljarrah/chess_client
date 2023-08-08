import { Square } from "@/model/types";
import { copyBoard } from "./game";
import { Piece } from "@/model/piece";


export const showValidBlocks = (
    piece: Piece,
    board: Square[][]
): Square[][] => {
    const copy = copyBoard(board);
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (piece.isLegalMove(piece.index, { x, y }, board)) {
                if (
                    board[x][y].piece &&
                    board[x][y].piece?.color !== piece.color
                ) {
                    copy[x][y].danger = true;
                } else {
                    copy[x][y].availibale = true;
                }
            }
            if (x === piece.index.x && y === piece.index.y) {
                copy[x][y].focus = true;
            }
        }
    }

    return copy;
};

export const clearUiHelp = (board: Square[][]): Square[][] => {
    const copy = copyBoard(board);

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            copy[x][y].availibale = false;
            copy[x][y].focus = false;
            copy[x][y].danger = false;
        }
    }
    return copy;
};

export const nextChar = (c: string) => {
    return String.fromCharCode(c.charCodeAt(0) + 1);
};
