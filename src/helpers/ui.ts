import { Color, Index, Square } from "@/model/types";
import { copyBoard, getKingIndex, isMoveSafe, isSameIndex, playSound } from "./game";
import { Piece } from "@/model/pieces/piece";
import { King } from "@/model/pieces/king";

const removePossibleMove = (
    board: Square[][],
    indexes: Index[]
): Square[][] => {
    for (const index of indexes) {
        
        board[index.y][index.x].availibale = false;

        board[index.y][index.x].danger = false;
    }
    return board;
};

export const showFootPrint = (
    board: Square[][],
    indexes: { from: Index; to: Index }
): Square[][] => {
    for (let row of board) {
        for (let block of row) {
            if (block.footPrint) {
                block.footPrint = false;
            }
        }
    }
    board[indexes.from.y][indexes.from.x].footPrint = true;
    board[indexes.to.y][indexes.to.x].footPrint = true;

    return board;
};

export const showPossibleMoves = (
    piece: Piece,
    board: Square[][]
): Square[][] => {
    let copy = copyBoard(board);
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

    let notValid: Index[] = [];
    const moves = piece.getValidMoves(copy);
    for (const move of moves) {
        if (!isMoveSafe(piece, move, copy)) {
            notValid.push(move);
        }
    }
    copy = removePossibleMove(copy, notValid);

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
            
            if (copy[y][x].danger ) {
                copy[y][x].danger = false;
            }
        }
    }
    return copy;
};

export const showCheck = (color: Color, board: Square[][]) => {
    const kingPosition = getKingIndex(color, board);

    // Check opponent's pieces for valid moves targeting the king's position
    const opponentColor = color === "white" ? "black" : "white";
    for (const row of board) {
        for (const col of row) {
            const opponentPiece = col.piece;
            if (opponentPiece && opponentPiece.color === opponentColor) {
                const validMoves = opponentPiece.getValidMoves(board);
                if (
                    validMoves.some((validMove) =>
                        isSameIndex(validMove, kingPosition)
                    )
                ) {
                    board[kingPosition.y][kingPosition.x].danger = true;
                    return kingPosition;
                }
            }
        }
    }
    return undefined;
};
