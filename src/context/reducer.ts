import {
    createMovementString,
    getNumOfSafeMove,
    initBoard,
    isMoveSafe,
} from "@/helpers/game";
import { AppActions, AppState } from "./board-context";
import { clearPossibleMoves, showPossibleMoves } from "@/helpers/ui";
import { Winner } from "@/model/types";

export const reducer = (state: AppState, actions: AppActions): AppState => {
    switch (actions.type) {
        case "MOVE_PIECE":
            const payloadBlock = actions.payload.block;
            const currentBlock = state.currentBlock;

            //Check player turn
            if (
                !currentBlock &&
                payloadBlock.piece &&
                state.currentPlayer !== payloadBlock.piece.color
            ) {
                return { ...state, currentBlock: null };
            }

            // Ignore empty fields
            if (!payloadBlock.piece && !currentBlock) {
                return { ...state };
            }

            // First click
            if (!currentBlock && payloadBlock.piece) {
                let board = showPossibleMoves(payloadBlock.piece, state.board);
                return {
                    ...state,
                    board,
                    currentBlock: actions.payload.block,
                };
            }

            // Second click
            if (currentBlock && currentBlock.piece) {
                // ------------- Not valid move------------------//

                const validMoves = currentBlock.piece.getValidMoves(
                    state.board
                );
                const isValid = validMoves.some(
                    (index) =>
                        index.x === payloadBlock.index.x &&
                        index.y === payloadBlock.index.y
                );

                if (!isValid) {
                    const board = clearPossibleMoves(state.board);
                    return {
                        ...state,
                        board,
                        currentBlock: null,
                    };
                }

                if (
                    !isMoveSafe(
                        currentBlock.piece,
                        payloadBlock.index,
                        state.board
                    )
                ) {
                    const board = clearPossibleMoves(state.board);
                    return {
                        ...state,
                        board,
                        currentBlock: null,
                    };
                }

                // -------------Valid move-------------//

                // Update board with move
                let board = currentBlock.piece.makeMove(
                    payloadBlock.index,
                    state.board
                );

                // Clear possible moves
                board = clearPossibleMoves(board);

                // Update history
                const history = [
                    ...state.history,
                    createMovementString(
                        currentBlock.index,
                        payloadBlock.index
                    ),
                ];

                // Switch player
                const currentPlayer =
                    state.currentPlayer === "white" ? "black" : "white";

                // Controll of checkmate
                let winner: Winner = null;
                if (getNumOfSafeMove(currentPlayer, board) === 0) {
                    winner = currentPlayer === "white" ? "Black" : "White";
                }

                return {
                    ...state,
                    history,
                    board,
                    currentPlayer,
                    currentBlock: null,
                    winner,
                };
            }

        case "NEW_GAME":
            
            return { 
                board: initBoard(),
                currentBlock: null,
                currentPlayer: 'white',
                history: [],
                winner: null,
             };

        case "STATE_BACKWARD":
            return { ...state };

        default:
            return { ...state };
    }
};
