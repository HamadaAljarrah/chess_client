import { copyBoard, getLegalBlocks, removeLegalBlock } from "@/helpers/game";
import {  AppState } from "./board-context";
import { AppActions } from "./actions";

export const reducer = (state: AppState, actions: AppActions) => {
    switch (actions.type) {
        case 'MOUSE_CLICK':
            if(!state.movement.src && actions.payload.block.piece === null){
                return {...state}
            }
            if (!state.movement.src) {
                // const board = copyBoard(state.board);
                // const index = actions.payload.block.index;
                // board[index.x][index.y].focus = true;
                return { ...state, movement: { ...state.movement, src: actions.payload.block } }
            }

            if (state.movement.src && !state.movement.dest) {
                return { ...state, movement: { ...state.movement, dest: actions.payload.block } }
            }

            return { ...state }

        case "MOVE_PIECE":
            if (state.movement.src && state.movement.dest) {
                const src = state.movement.src;
                const dest = state.movement.dest;
                const boardCopy = copyBoard(state.board);
                const piece = boardCopy[src.index.x][src.index.y].piece;                

                if (piece && !piece.isLegalMove(src.index, dest.index,state.board)) {
                    return { ...state, movement: { src: null, dest: null } }
                }

                if (piece) {
                    piece.index = { x: dest.index.x, y: dest.index.y }
                    boardCopy[dest.index.x][dest.index.y].piece = piece;
                    boardCopy[src.index.x][src.index.y].piece = null
                    return { ...state, board: boardCopy, movement: { src: null, dest: null } }
                }

            }
            return { ...state }

        case 'SHOW_LEGAL_MOVES':

            if (state.movement.src && !state.movement.dest) {
                const { block } = actions.payload;

                if (block.piece) {
                    const board = getLegalBlocks(block.piece, state.board);
                    return { ...state, board }
                }

            }
            return { ...state }


        case 'REMOVE_LEGAL_MOVES':
            const defualt = !state.movement.src && !state.movement.dest
            const test = state.movement.src && state.movement.dest
            if (defualt || test) {
                return { ...state, board: removeLegalBlock(state.board) }
            }
            return { ...state }


        default:
            return state;
    }
}