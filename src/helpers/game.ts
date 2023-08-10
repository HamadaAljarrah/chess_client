import { Square, Index, Color } from "@/model/types";
import { Bishop } from "@/model/pieces/bishop";
import { King } from "@/model/pieces/king";
import { Knight } from "@/model/pieces/knight";
import { Pawn } from "@/model/pieces/pawn";
import { Queen } from "@/model/pieces/queen";
import { Rook } from "@/model/pieces/rook";
import { kingMovement } from "@/model/movements/kingMovement";

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
                    board[i][0].piece = new Rook("black", { x: i, y: 0 }, true);
                    board[i][1].piece = new Knight("black", { x: i, y: 1 });
                    board[i][2].piece = new Bishop("black", { x: i, y: 2 });
                    board[i][3].piece = new Queen("black", { x: i, y: 3 });
                    board[i][4].piece = new King("black", { x: i, y: 4 }, true);
                    board[i][5].piece = new Bishop("black", { x: i, y: 5 });
                    board[i][6].piece = new Knight("black", { x: i, y: 6 });
                    board[i][7].piece = new Rook("black", { x: i, y: 7 }, true);
                    break;
                case 1:
                    board[i][j].piece = new Pawn("black", { x: i, y: j });
                    break;

                case 6:
                    board[i][j].piece = new Pawn("white", { x: i, y: j });
                    break;

                case 7:
                    board[i][0].piece = new Rook("white", { x: i, y: 0 }, true);
                    board[i][1].piece = new Knight("white", { x: i, y: 1 });
                    board[i][2].piece = new Bishop("white", { x: i, y: 2 });
                    board[i][3].piece = new Queen("white", { x: i, y: 3 });
                    board[i][4].piece = new King("white", { x: i, y: 4 }, true);
                    board[i][5].piece = new Bishop("white", { x: i, y: 5 });
                    board[i][6].piece = new Knight("white", { x: i, y: 6 });
                    board[i][7].piece = new Rook("white", { x: i, y: 7 }, true);
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

export const makeMove = (
    src: Index,
    dest: Index,
    board: Square[][]
): Square[][] => {
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

export const isSameIndex = (src: Index, dest: Index): boolean => {
    return src.x === dest.x && src.y === dest.y;
};

export const createScript = (src: Index, dest: Index): string => {
    const MOVEMENT_SCRIPTS_ROW = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const MOVEMENT_SCRIPTS_COL = ["8", "7", "6", "5", "4", "3", "2", "1"];
    const script =
        MOVEMENT_SCRIPTS_COL[src.x] +
        MOVEMENT_SCRIPTS_ROW[dest.y] +
        "->" +
        MOVEMENT_SCRIPTS_COL[dest.x] +
        MOVEMENT_SCRIPTS_ROW[dest.y];

    return script;
};

export const checkMate = (index: Index, board: Square[][]): boolean => {
    const { x, y } = index;

    const possibleMoves = [
        { dx: 1, dy: 0 }, // Right
        { dx: -1, dy: 0 }, // Left
        { dx: 0, dy: 1 }, // Down
        { dx: 0, dy: -1 }, // Up
        { dx: -1, dy: -1 }, // Up-left
        { dx: 1, dy: -1 }, // Up-right
        { dx: 1, dy: 1 }, // Down-right
        { dx: -1, dy: 1 }, // Down-left
    ];

    for (const move of possibleMoves) {
        const newX = x + move.dx;
        const newY = y + move.dy;

        if (kingMovement.canMove({ x, y }, { x: newX, y: newY }, board)) {
            return false;
        }
    }

    return true;
};

export const isCastlingMove = (
    src: Index,
    dest: Index,
    color: Color,
    board: Square[][]
): boolean => {
    const indexX = color === "white" ? 7 : 0;

    // King moving 2 steps right or 3 steps left
    if (
        !(
            Math.abs(src.y - dest.y) === 2 &&
            src.x === indexX &&
            dest.x === indexX
        )
    ) {
        //console.log("Not custling");
        return false;
    }

    // King first move
    if (
        !board[indexX][src.y].piece ||
        !(board[indexX][src.y].piece instanceof King) ||
        !(board[indexX][src.y].piece as King).isFirstMove()
    ) {
        //console.log("King not first move");
        return false;
    }

    // Rook first move
    const rookYindex = dest.y === 6 ? 7 : 0;
    if (
        !board[indexX][rookYindex].piece ||
        !(board[indexX][rookYindex].piece instanceof Rook) ||
        !(board[indexX][rookYindex].piece as Rook).isFirstMove()
    ) {
        //console.log("Rook not first move");
        return false;
    }

    // None piece blocking
    const blockingIndices = rookYindex === 7 ? [6, 5] : [1, 2, 3];
    const hasBlockedPiece = blockingIndices.some((y) => board[indexX][y].piece);
    if (hasBlockedPiece) {
        //console.log("Piece blocking");
        return false;
    }

    //TODO: King not checked before and after custling


    // All conditions met
    return true;
};

export const castle = (
    dest: Index,
    color: Color,
    board: Square[][]
): Square[][] => {
    const rookYIndex = dest.y === 6 ? 7 : 0;
    const kingYIndex = 4;
    const x = color === "white" ? 7 : 0;

    const copy = copyBoard(board);
    const rook = copy[x][rookYIndex].piece;
    const king = copy[x][kingYIndex].piece;
    if (rook && king) {        
        const destKingYIndex = rookYIndex === 7 ? 6 :2;
        const destRookYIndex = rookYIndex === 7 ? 5 :3;
        const rookClone = rook.clone();
        const kingClone = king.clone();
        copy[x][kingYIndex].piece = null // Delete the king
        copy[x][rookYIndex].piece = null // Delete the rook
        copy[x][destKingYIndex].piece = kingClone // Put the king clone
        copy[x][destRookYIndex].piece = rookClone // Put the rook clone
    }

    return copy;
};



export const getPiecesIndex = (color:Color, board:Square[][]): Index[]=>{
    const indexes: Index[] = []

    for (const row of board) {
        for (const col of row) {
            if (col.piece && col.piece.color === color) {
                indexes.push({...col.index});
            }
        }
    }
    return indexes;
}


export const safeBlock = (src: Index, opponents:Index[], board: Square[][]):boolean =>{
    
    // Get possible moves
    const possibleMoves = [
        { dx: 1, dy: 0 }, // Down
        { dx: -1, dy: 0 }, // Up
        { dx: 0, dy: 1 }, // Right
        { dx: 0, dy: -1 }, // Left
        { dx: -1, dy: -1 }, // Up-left
        { dx: -1, dy: 1 }, // Up-right
        { dx: 1, dy: -1 }, // Down-left
        { dx: 1, dy: 1 }, // Down-right
    ];

    // Check every opponent pieces in board and see if they can move to kings possible moves
    const { x, y } = src;
    for (const move of possibleMoves){
        const dest = { x: x + move.dx, y: y + move.dy };
        opponents.forEach(index => {
            const piece = board[index.x][index.y].piece
            if(piece && piece.isLegalMove({x:index.x,y:index.y},dest,board)){
                return false;
            }  
        })
    }

    // handle pawn edge case

    // handle pinning pieces, pieces that cannot move due to covering king

    return true;
              

}
    

