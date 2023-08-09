import {
    copyBoard,
    copyBoardBackup,
    createScript,
    makeMove,
} from "@/helpers/game";
import { AppActions, AppState } from "./board-context";
import { clearUiHelp, showValidBlocks } from "@/helpers/ui";

export const reducer = (state: AppState, actions: AppActions): AppState => {
    switch (actions.type) {
        case "MOVE_PIECE":

            // Check player turn
            if(!state.currentBlock && actions.payload.block.piece?.color !== state.currentPlayer){
                return {...state} 
            }

            const payloadBlock = actions.payload.block;
            const currentBlock = state.currentBlock;
           
            // Ignore empty fields
            if (!payloadBlock.piece && !currentBlock) {
                return {...state};
            }


            // First click
            if (!currentBlock && payloadBlock.piece) {
                const piece = payloadBlock.piece;
                let updatedBoard = showValidBlocks(piece, state.board);
                return {
                    ...state,
                    currentBlock: actions.payload.block,
                    board: updatedBoard,
                };
            }

            // Second click
            if (currentBlock) {
                // Invalid move
                if (!currentBlock.piece?.isLegalMove(currentBlock.index,payloadBlock.index,state.board)) {
                    let updatedBoard = clearUiHelp(state.board);
                    return {
                        ...state,
                        board: updatedBoard,
                        currentBlock: null,
                    };
                }


                // Valid move
                const script = createScript(currentBlock.index,payloadBlock.index); // Create script

                const movementScripts = [...state.movementScripts, script]; // Update the movement script

                let board = clearUiHelp(state.board); // Clear green and purple squares and deep copy board

                board = makeMove(currentBlock.index,payloadBlock.index,board); // Update board

                const boardBackup = [...copyBoardBackup(state.boardBackup), board]; // Update board backup

                const currentPlayer = state.currentPlayer === 'white' ? 'black': 'white'; // Switch player

                

                return {
                    ...state,
                    board,
                    boardBackup,
                    currentBlock: null,
                    backupIndex: state.backupIndex + 1,
                    movementScripts,
                    currentPlayer
                };
            }

        case "STATE_BACKWARD":
            if (state.backupIndex > 0) {
                let movementScripts = [...state.movementScripts].slice(0, -1); // Remove last script
                const backupIndex = state.backupIndex - 1; // Update histroy index
                const boardBackup = copyBoardBackup(state.boardBackup).slice(0, -1); // Remove last board from backup
                const board = copyBoard(state.boardBackup[backupIndex]); // Get the right board
                const currentPlayer = state.currentPlayer === 'white' ? 'black': 'white'; // Switch player
                return {
                    ...state,
                    movementScripts,
                    board,
                    boardBackup,
                    backupIndex,
                    currentBlock: null,
                    currentPlayer
                };
            }
            return { ...state };

        default:
            return { ...state };
    }
};
