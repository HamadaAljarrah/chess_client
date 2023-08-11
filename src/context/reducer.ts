import { castle, createMovementString, isCastlingMove } from "@/helpers/game";
import { AppActions, AppState } from "./board-context";
import { clearPossibleMoves, showPossibleMoves } from "@/helpers/ui";

export const reducer = (state: AppState, actions: AppActions): AppState => {
    switch (actions.type) {
        case "MOVE_PIECE":

            const payloadBlock = actions.payload.block;
            const currentBlock = state.currentBlock;

            //Check player turn
            if(!currentBlock && payloadBlock.piece && state.currentPlayer !== payloadBlock.piece.color){
                console.log("not player turn");
                
                return {...state, currentBlock:null}
            }
            
           
            // Ignore empty fields
            if (!payloadBlock.piece && !currentBlock) {
                return {...state};
            }


            // First click
            if (!currentBlock && payloadBlock.piece) {
                const board = showPossibleMoves(payloadBlock.piece, state.board)
                return {
                    ...state,
                    board,
                    currentBlock: actions.payload.block,
                };
            }

            // Second click
            if (currentBlock && currentBlock.piece) {

                // ------------- Castling ------------------//

               


                // ------------- Not valid move------------------//

                const validMoves = currentBlock.piece.getValidMoves(state.board);
                const isValid = validMoves.some((index) => index.x === payloadBlock.index.x && index.y === payloadBlock.index.y)

                if(!isValid){
                    // Clear possible moves 
                    console.log("not valid");
                    
                    const board = clearPossibleMoves(state.board)   
                    return {
                        ...state,
                        board, 
                        currentBlock:null
                    };
                }

                // -------------Valid move-------------//

                // Update board with move
                let board = currentBlock.piece.makeMove(payloadBlock.index, state.board);


                // Clear possible moves 
                board = clearPossibleMoves(board)  


                // Update history
                const history = [...state.history, createMovementString(currentBlock.index, payloadBlock.index)]


                //switch player
                //const currentPlayer = state.currentPlayer === 'white' ? 'black' : 'white';

                
                return {
                    ...state,
                    history,
                    board,
                    //currentPlayer,
                    currentBlock: null,
                };
            }
            

        case "STATE_BACKWARD":
            
            return { ...state };

        default:
            return { ...state };
    }
};
