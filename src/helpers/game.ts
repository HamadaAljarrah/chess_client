import { Square, Index, Color, PieceName, PawnPromotion } from "@/model/types";
import { Bishop } from "@/model/pieces/bishop";
import { King } from "@/model/pieces/king";
import { Knight } from "@/model/pieces/knight";
import { Pawn } from "@/model/pieces/pawn";
import { Queen } from "@/model/pieces/queen";
import { Rook } from "@/model/pieces/rook";
import { Piece } from "@/model/pieces/piece";
import { socket } from "@/model/socket";

export const initBoard = (): Square[][] => {
    const board: Square[][] = [];

    for (let y = 0; y < 8; y++) {
        const row: Square[] = [];

        for (let x = 0; x < 8; x++) {
            const color = (y + x) % 2 === 0 ? "white" : "black";
            row.push({
                color,
                piece: null,
                index: { x, y },
                availibale: false,
                focus: false,
                danger: false,
            });
        }
        board.push(row);
    }

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            switch (y) {
                case 0:
                    board[y][0].piece = new Rook("black", { x: 0, y }, true);
                    board[y][1].piece = new Knight("black", { x: 1, y });
                    board[y][2].piece = new Bishop("black", { x: 2, y });
                    board[y][3].piece = new Queen("black", { x: 3, y });
                    board[y][4].piece = new King("black", { x: 4, y }, true);
                    board[y][5].piece = new Bishop("black", { x: 5, y });
                    board[y][6].piece = new Knight("black", { x: 6, y });
                    board[y][7].piece = new Rook("black", { x: 7, y }, true);
                    break;
                case 1:
                    board[y][x].piece = new Pawn("black", { x, y });
                    break;

                case 6:
                    board[y][x].piece = new Pawn("white", { x, y });
                    break;

                case 7:
                    board[y][0].piece = new Rook("white", { x: 0, y }, true);
                    board[y][1].piece = new Knight("white", { x: 1, y });
                    board[y][2].piece = new Bishop("white", { x: 2, y });
                    board[y][3].piece = new Queen("white", { x: 3, y });
                    board[y][4].piece = new King("white", { x: 4, y }, true);
                    board[y][5].piece = new Bishop("white", { x: 5, y });
                    board[y][6].piece = new Knight("white", { x: 6, y });
                    board[y][7].piece = new Rook("white", { x: 7, y }, true);
                    break;
            }
        }
    }

    return board;
};

export function copyBoard(array: Square[][]): Square[][] {
    return array.map((row) => row.map((square) => ({ ...square })));
}

export function copyBoardBackup(boardBackup: Square[][][]): Square[][][] {
    return boardBackup.map((board) => copyBoard(board));
}

export const isSameIndex = (src: Index, dest: Index): boolean => {
    return src.x === dest.x && src.y === dest.y;
};

export const createMovementString = (src: Index, dest: Index): string => {
    const MOVEMENT_SCRIPTS_COL = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const MOVEMENT_SCRIPTS_ROW = ["8", "7", "6", "5", "4", "3", "2", "1"];
    const script =
        MOVEMENT_SCRIPTS_COL[src.x] +
        MOVEMENT_SCRIPTS_ROW[src.y] +
        "->" +
        MOVEMENT_SCRIPTS_COL[dest.x] +
        MOVEMENT_SCRIPTS_ROW[dest.y];

    return script;
};

export const inBoundary = (x: number, y: number) => {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
};

export const castle = (
    dest: Index,
    color: Color,
    board: Square[][]
): Square[][] => {
    const rookXIndex = dest.x === 6 ? 7 : 0;
    const kingXIndex = 4;
    const y = color === "white" ? 7 : 0;

    const copy = copyBoard(board);
    const rook = copy[y][rookXIndex].piece;
    const king = copy[y][kingXIndex].piece;
    const destKingXIndex = rookXIndex === 7 ? 6 : 2;
    const destRookXIndex = rookXIndex === 7 ? 5 : 3;
    if (rook && king) {
        const rookClone = rook.clone();
        const kingClone = king.clone();
        rookClone.index = { x: destRookXIndex, y };
        kingClone.index = { x: destKingXIndex, y };
        copy[y][kingXIndex].piece = null; // Delete the king
        copy[y][rookXIndex].piece = null; // Delete the rook
        copy[y][destKingXIndex].piece = kingClone; // Put the king clone
        copy[y][destRookXIndex].piece = rookClone; // Put the rook clone
    }
    // This is only for rook, king movement broadcast is handled in reducer
    socket.emit("castle", {
        from: { x: rookXIndex, y: y },
        to: { x: destRookXIndex, y: y, player: color },
    });
    return copy;
};

export const getKingIndex = (color: Color, board: Square[][]): Index => {
    let index = { x: 0, y: 0 };
    if (color === "white") {
        // Start from bottom
        outerLoop: for (let y = 7; y >= 0; y--) {
            for (const col of board[y]) {
                if (
                    col.piece &&
                    col.piece.color === color &&
                    col.piece instanceof King
                ) {
                    index = { ...col.piece.index };
                    break outerLoop;
                }
            }
        }
    } else {
        // Start from top
        outerLoop: for (const row of board) {
            for (const col of row) {
                if (
                    col.piece &&
                    col.piece.color === color &&
                    col.piece instanceof King
                ) {
                    index = { ...col.piece.index };
                    break outerLoop;
                }
            }
        }
    }

    return index;
};

export const isMoveSafe = (
    piece: Piece,
    dest: Index,
    board: Square[][]
): boolean => {
    // Simulate the move on a temporary board
    const copy = stimulateMove(piece.index, dest, board);

    // Find the king's position
    const kingPosition = getKingIndex(piece.color, copy);

    // Check opponent's pieces for valid moves targeting the king's position
    const opponentColor = piece.color === "white" ? "black" : "white";
    for (const row of copy) {
        for (const col of row) {
            const opponentPiece = col.piece;
            if (opponentPiece && opponentPiece.color === opponentColor) {
                const validMoves = opponentPiece.getValidMoves(copy);
                if (
                    validMoves.some((validMove) =>
                        isSameIndex(validMove, kingPosition)
                    )
                ) {
                    return false; // Move exposes king to check
                }
            }
        }
    }

    return true; // Move is safe
};

export const stimulateMove = (src: Index, dest: Index, board: Square[][]) => {
    const copy = copyBoard(board);

    const piece = board[src.y][src.x].piece;
    if (piece) {
        const newPiece = piece.clone();
        newPiece.index = { x: dest.x, y: dest.y };
        copy[dest.y][dest.x].piece = newPiece;
        copy[src.y][src.x].piece = null;
    }

    return copy;
};

export const getNumOfSafeMove = (color: Color, board: Square[][]): number => {
    let possible = 0;
    for (const row of board) {
        for (const col of row) {
            const piece = col.piece;
            if (
                piece &&
                piece.color === color &&
                piece
                    .getValidMoves(board)
                    .some((index) => isMoveSafe(piece, index, board))
            ) {
                piece.getValidMoves(board).forEach((index) => {
                    if (isMoveSafe(piece, index, board)) {
                        possible++;
                    }
                });
            }
        }
    }
    return possible;
};

export const pawnPromotion = (
    color: Color,
    board: Square[][]
): PawnPromotion => {
    const indexY = color === "white" ? 0 : 7;

    for (const col of board[indexY]) {
        if (col.piece instanceof Pawn) {
            return { index: { ...col.index }, showDialog: true };
        }
    }

    return { index: null, showDialog: false };
};

export const promotePawn = (
    piece: PieceName,
    index: Index,
    color: Color,
    board: Square[][]
): Square[][] => {
    const copy = copyBoard(board);
    const { x, y } = index;
    switch (piece) {
        case "BISHOP":
            copy[y][x].piece = new Bishop(color, index);
            break;

        case "KNIGHT":
            copy[y][x].piece = new Knight(color, index);
            break;

        case "QUEEN":
            copy[y][x].piece = new Queen(color, index);
            break;

        case "ROOK":
            copy[y][x].piece = new Rook(color, index, false);
            break;

        default:
            break;
    }
    return copy;
};

export const countPoints = (board:Square[][], color:Color):number =>{
    let points = 0;
    for(const row of board){
        for(const square of row){
            if(square.piece && square.piece.color === color){
                points+= square.piece.points;
            }
        }
    }
    return points;
}

export const playSound = (path: string) => {
    const audio = new Audio(path);
    if (audio) {
        audio.play();
    }
};
