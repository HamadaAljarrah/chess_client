import {
    createMovementString,
    getNumOfSafeMove,
    initBoard,
    isMoveSafe,
    stimulateMove,
    pawnPromotion,
    promotePawn,
    copyBoard,
    playSound,
} from "@/helpers/game";
import { AppActions, AppState } from "./board-context";
import { clearPossibleMoves, showPossibleMoves } from "@/helpers/ui";
import { Winner } from "@/model/types";
import { socket } from "@/model/socket";

export const reducer = (state: AppState, actions: AppActions): AppState => {
    switch (actions.type) {
        case "CHOSE_COLOR":
            return { ...state, self: actions.payload.color };

        case "SET_BOARD":
            return { ...state, board: actions.payload.board };

        case "MOVE_PIECE":
            const payloadBlock = actions.payload.block;
            const currentBlock = state.currentBlock;

            //Check player turn
            if (
                !currentBlock &&
                payloadBlock.piece &&
                (state.currentPlayer !== payloadBlock.piece.color ||
                    state.currentPlayer !== state.self)
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

                // Play sound
                playSound("move.mp3");

                // Clear possible moves
                board = clearPossibleMoves(board);

                // Update history
                const movementHistory = createMovementString(
                    currentBlock.index,
                    payloadBlock.index
                )
                const history = [
                    ...state.history,
                    movementHistory
                ];

                socket.emit("history", movementHistory)

                // Check Pawn promotion
                const promotion = pawnPromotion(state.currentPlayer, board);

                // Switch player
                const previousPlayer = state.currentPlayer;
                const currentPlayer =
                    state.currentPlayer === "white" ? "black" : "white";

                // Controll of checkmate
                let winner: Winner = null;
                if (getNumOfSafeMove(currentPlayer, board) === 0) {
                    winner = currentPlayer === "white" ? "Black" : "White";
                }

                //Broadcast move
                socket.emit("sendMove", {
                    from: currentBlock.index,
                    to: payloadBlock.index,
                    player: previousPlayer,
                    isCheckmate: winner !== null,
                });

                return {
                    ...state,
                    history,
                    board,
                    currentPlayer,
                    promotion,
                    currentBlock: null,
                    winner,
                };
            }

        case "NEW_GAME":
            return {
                board: initBoard(),
                currentBlock: null,
                currentPlayer: "white",
                history: [],
                winner: null,
                self: null,
                promotion: {
                    index: null,
                    showDialog: false,
                },
            };

        case "GAME_UPDATE":
            const { from, to, player, isCheckmate } = actions.payload.move;
            const board = stimulateMove(from, to, state.board);
            let winner: Winner = null;
            if (isCheckmate) {
                winner = state.self === "white" ? "Black" : "White";
                playSound("checkmate.mp3");
            } else {
                playSound("move.mp3");
            }
            const currentPlayer = player === "white" ? "black" : "white";
            return {
                ...state,
                board,
                currentPlayer,
                currentBlock: null,
                winner,
            };

        case "HANDLE_REMOTE_CASTLE":
            return {
                ...state,
                board: stimulateMove(
                    actions.payload.move.from,
                    actions.payload.move.to,
                    state.board
                ),
            };
        case "HANDLE_REMOTE_HISTORY":
            
            return {
                ...state,
                history: [...state.history, actions.payload.data]
            };
        case "HANDLE_REMOTE_PROMOTION":
            const copy = promotePawn(
                actions.payload.data.piece,
                actions.payload.data.index,
                actions.payload.data.color,
                state.board
            );
            return {
                ...state,
                board: copy,
            };

        case "PROMOTE_PAWN":
            if (state.promotion.index) {
                const board = promotePawn(
                    actions.payload.piece,
                    state.promotion.index,
                    state.currentPlayer === "black" ? "white" : "black",
                    state.board
                );
                socket.emit("promotion", {
                    index: state.promotion.index,
                    color: state.currentPlayer === "black" ? "white" : "black",
                    piece: actions.payload.piece,
                });
                return {
                    ...state,
                    board,
                    promotion: {
                        index: null,
                        showDialog: false,
                    },
                };
            }
            return { ...state };

        default:
            return { ...state };
    }
};
