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
                    board[y][1].piece = new Knight("black", { x: 1, y});
                    board[y][2].piece = new Bishop("black", { x: 2, y});
                    board[y][3].piece = new Queen("black", { x: 3, y});
                    board[y][4].piece = new King("black", { x: 4, y}, true);
                    board[y][5].piece = new Bishop("black", { x: 5, y });
                    board[y][6].piece = new Knight("black", { x: 6, y});
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
                    board[y][1].piece = new Knight("white", { x: 1, y});
                    board[y][2].piece = new Bishop("white", { x: 2, y});
                    board[y][3].piece = new Queen("white", { x: 3, y});
                    board[y][4].piece = new King("white", { x: 4, y}, true);
                    board[y][5].piece = new Bishop("white", { x: 5, y });
                    board[y][6].piece = new Knight("white", { x: 6, y});
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

export const makeMove = (
    src: Index,
    dest: Index,
    board: Square[][]
): Square[][] => {
    const copy = copyBoard(board);
    const piece = copy[src.y][src.x].piece;
    if (piece) {
        const newPiece = piece.clone();
        newPiece.index = { x: dest.x, y: dest.y };
        copy[dest.y][dest.x].piece = newPiece;
        copy[src.y][src.x].piece = null;
    }
    return copy;
};

export const isSameIndex = (src: Index, dest: Index): boolean => {
    return src.x === dest.x && src.y === dest.y;
};

export const createScript = (src: Index, dest: Index): string => {
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

export const checkMate = (index: Index, board: Square[][]): boolean => {
    const { x, y } = index;

    const possibleMoves = [
        { dx: 1, dy: 0 }, 
        { dx: -1, dy: 0 }, 
        { dx: 0, dy: 1 }, 
        { dx: 0, dy: -1 }, 
        { dx: -1, dy: -1 }, 
        { dx: 1, dy: -1 }, 
        { dx: 1, dy: 1 }, 
        { dx: -1, dy: 1 }, 
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
    const indexY = color === "white" ? 7 : 0;

    // King moving 2 steps right or 3 steps left
    if (
        !(
            Math.abs(src.x - dest.x) === 2 &&
            src.y === indexY &&
            dest.y === indexY
        )
    ) {
        //console.log("Not custling");
        return false;
    }

    // King first move
    if (
        !board[indexY][src.x].piece ||
        !(board[indexY][src.x].piece instanceof King) ||
        !(board[indexY][src.x].piece as King).isFirstMove()
    ) {
        //console.log("King not first move");
        return false;
    }

    // Rook first move
    const rookXindex = dest.x === 6 ? 7 : 0;
    if (
        !board[indexY][rookXindex].piece ||
        !(board[indexY][rookXindex].piece instanceof Rook) ||
        !(board[indexY][rookXindex].piece as Rook).isFirstMove()
    ) {
        //console.log("Rook not first move");
        return false;
    }

    // None piece blocking
    const blockingIndices = rookXindex === 7 ? [6, 5] : [1, 2, 3];
    const hasBlockedPiece = blockingIndices.some((x) => board[indexY][x].piece);
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
    const rookXIndex = dest.x === 6 ? 7 : 0;
    const kingXIndex = 4;
    const y = color === "white" ? 7 : 0;

    const copy = copyBoard(board);
    const rook = copy[y][rookXIndex].piece;
    const king = copy[y][kingXIndex].piece;
    if (rook && king) {        
        const destKingXIndex = rookXIndex === 7 ? 6 :2;
        const destRookXIndex = rookXIndex === 7 ? 5 :3;
        const rookClone = rook.clone();
        const kingClone = king.clone();
        copy[y][kingXIndex].piece = null // Delete the king
        copy[y][rookXIndex].piece = null // Delete the rook
        copy[y][destKingXIndex].piece = kingClone // Put the king clone
        copy[y][destRookXIndex].piece = rookClone // Put the rook clone
    }

    return copy;
};

// Not checked for x and y swich

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
    

