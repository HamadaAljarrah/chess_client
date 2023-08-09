import {
    MOVEMENT_SCRIPTS_COL,
    MOVEMENT_SCRIPTS_ROW,
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
            const payloadBlock = actions.payload.block;
            const currentBlock = state.currentBlock;

            // Ignore empty fields
            if (!payloadBlock.piece && !currentBlock) {
                return state;
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
                if (
                    !currentBlock.piece?.isLegalMove(
                        currentBlock.index,
                        payloadBlock.index,
                        state.board
                    )
                ) {
                    let updatedBoard = clearUiHelp(state.board);
                    return {
                        ...state,
                        board: updatedBoard,
                        currentBlock: null,
                    };
                }

                // Valid move
                const script = createScript(currentBlock.index,payloadBlock.index) // Create script
                const updatedScript = [...state.movementScripts, script]; // Update the movement script
                let updatedBoard = clearUiHelp(state.board); // Clear green and puple squares
                updatedBoard = makeMove(currentBlock.index, payloadBlock.index, updatedBoard) // Update board
                const boardBackup = [...copyBoardBackup(state.boardBackup), updatedBoard]; // Update board backup


                return {
                    ...state,
                    board: updatedBoard,
                    boardBackup,
                    currentBlock: null,
                    backupIndex: state.backupIndex + 1,
                    movementScripts: updatedScript,
                };
            }

        case "STATE_BACKWARD":
            if(state.backupIndex > 0){
                let movementScripts = [...state.movementScripts].slice(0, -1);
                const backupIndex = state.backupIndex - 1;
    
                console.log(state.boardBackup);
    
                const board = copyBoard(state.boardBackup[backupIndex]);
                const boardBackup = [...state.boardBackup].slice(0, -1);
    
                return {
                    ...state,
                    movementScripts,
                    board,
                    boardBackup,
                    backupIndex,
                };
            }
            return {...state}
           

        default:
            return { ...state };
    }
};
