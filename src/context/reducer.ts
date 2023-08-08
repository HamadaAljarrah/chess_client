import { MOVEMENT_SCRIPTS_COL, MOVEMENT_SCRIPTS_ROW, copyBoard } from "@/helpers/game";
import {  AppActions, AppState } from "./board-context";
import { clearUiHelp, showValidBlocks } from "@/helpers/ui";

export const reducer = (state: AppState, actions: AppActions): AppState => {
    switch (actions.type) {
        case 'MOVE_PIECE':
            
            const payloadBlock = actions.payload.block
            const currentBlock = state.currentBlock

            // Ignore empty fields
            if(!payloadBlock.piece && !currentBlock){
                console.log("No piece");
                return state;
            }
            
            
            
            // First click
            if(!currentBlock && payloadBlock.piece){
                console.log("First click");
                const piece = payloadBlock.piece
                let updatedBoard = showValidBlocks(piece, state.board)
                return {...state, currentBlock: actions.payload.block, board: updatedBoard};
            }


            // Second click
            if(currentBlock){

                // Invalid move
                if(!currentBlock.piece?.isLegalMove(currentBlock.index, payloadBlock.index, state.board)){
                    console.log("Invalid move");
                    let updatedBoard = clearUiHelp(state.board)
                    return {...state, board: updatedBoard, currentBlock: null}
                }
       
                // Valid move
                console.log("move piece and reset");
                const srcX = currentBlock.index.x
                const srcY = currentBlock.index.y
                const destX = payloadBlock.index.x
                const destY = payloadBlock.index.y
                
                
                const script =
                    MOVEMENT_SCRIPTS_COL[srcX] +
                    MOVEMENT_SCRIPTS_ROW[srcY] +
                    "->" +
                    MOVEMENT_SCRIPTS_COL[destX] +
                    MOVEMENT_SCRIPTS_ROW[destY];
                const updatedScript = [...state.movementScripts, script]



                let updatedBoard = copyBoard(state.board);
                const piece = currentBlock.piece;
                piece.index = {x:destX, y:destY};
                updatedBoard[srcX][srcY].piece = null;
                updatedBoard[destX][destY].piece = piece;
                updatedBoard = clearUiHelp(updatedBoard)

                return {
                    ...state, 
                    board: updatedBoard, 
                    currentBlock: null, 
                    movementScripts: 
                    updatedScript, 
                };
            }

        
        case 'STATE_BACKWARD': 
            if(state.backupIndex>0){
                let backupIndex = state.backupIndex-1
                let board = [...state.boardBackup[backupIndex]]
                let boardBackup = [...state.boardBackup].slice(0,-1)
                let movementScripts = [...state.movementScripts].slice(0,-1)
                return {...state, backupIndex,board,movementScripts,boardBackup}
            }
            return {...state};

        // case 'STATE_FORWARD': 
        //     if(state.backupIndex < state.boardBackup.length -2){
        //         return {...state, backupIndex:state.backupIndex+1, board:state.boardBackup[state.backupIndex +1]}
        //     }
        //     return {...state};

        default:
            return {...state};
    }
}