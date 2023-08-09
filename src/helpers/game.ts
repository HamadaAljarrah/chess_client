import { Square, Color, Index } from "@/model/types";
import { Bishop } from "@/model/pieces/bishop";
import { King } from "@/model/pieces/king";
import { Knight } from "@/model/pieces/knight";
import { Pawn } from "@/model/pieces/pawn";
import { Queen } from "@/model/pieces/queen";
import { Rook } from "@/model/pieces/rook";

export const initBoard = (): Square[][] => {
    const board: Square[][] = [];

    for (let i = 0; i < 8; i++) {
        const row: Square[] = [];

        for (let j = 0; j < 8; j++) {
            const color = (i + j) % 2 === 0 ? "white" : "black";
            row.push({
                color,
                piece: null,
                index: { x: i, y: j },
                availibale: false,
                focus: false,
                danger: false,
            });
        }
        board.push(row);
    }

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            switch (i) {
                case 0:
                    board[i][0].piece = new Rook("black", { x: i, y: 0 });
                    board[i][1].piece = new Knight("black", { x: i, y: 1 });
                    board[i][2].piece = new Bishop("black", { x: i, y: 2 });
                    board[i][3].piece = new Queen("black", { x: i, y: 3 });
                    board[i][4].piece = new King("black", { x: i, y: 4 });
                    board[i][5].piece = new Bishop("black", { x: i, y: 5 });
                    board[i][6].piece = new Knight("black", { x: i, y: 6 });
                    board[i][7].piece = new Rook("black", { x: i, y: 7 });
                    break;
                case 1:
                    board[i][j].piece = new Pawn("black", { x: i, y: j });
                    break;

                case 6:
                    board[i][j].piece = new Pawn("white", { x: i, y: j });
                    break;

                case 7:
                    board[i][0].piece = new Rook("white", { x: i, y: 0 });
                    board[i][1].piece = new Knight("white", { x: i, y: 1 });
                    board[i][2].piece = new Bishop("white", { x: i, y: 2 });
                    board[i][3].piece = new Queen("white", { x: i, y: 3 });
                    board[i][4].piece = new King("white", { x: i, y: 4 });
                    board[i][5].piece = new Bishop("white", { x: i, y: 5 });
                    board[i][6].piece = new Knight("white", { x: i, y: 6 });
                    board[i][7].piece = new Rook("white", { x: i, y: 7 });
                    break;
            }
        }
    }

    return board;
};



export function copyBoard(array: Square[][]): Square[][] {
    return array.map(row => row.map(square => ({...square})));
}
export function copyBoardBackup(boardBackup: Square[][][]): Square[][][] {
    return boardBackup.map(board => copyBoard(board));
}



export const makeMove = ( src: Index, dest: Index, board: Square[][]): Square[][] => {
    const copy = copyBoard(board);
    const piece = copy[src.x][src.y].piece;
    if (piece) {
        const newPiece = piece.clone();
        newPiece.index = { x: dest.x, y: dest.y };
        copy[dest.x][dest.y].piece = newPiece;
        copy[src.x][src.y].piece = null;
    }
    return copy;
};

export const notChangingPosition = (src: Index, dest: Index): boolean => {
    return src.x === dest.x && src.y === dest.y;
};



const MOVEMENT_SCRIPTS_ROW = ["A", "B", "C", "D", "E", "F", "G", "H"];
const MOVEMENT_SCRIPTS_COL = ["8", "7", "6", "5", "4", "3", "2", "1"];

export const createScript = (src:Index, dest:Index) => {
    const script =
    MOVEMENT_SCRIPTS_COL[src.x] +
    MOVEMENT_SCRIPTS_ROW[dest.y] +
    "->" +
    MOVEMENT_SCRIPTS_COL[dest.x] +
    MOVEMENT_SCRIPTS_ROW[dest.y];

    return script
}


