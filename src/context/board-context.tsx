import { initBoard } from "@/helpers/game";
import { Color, Move, PawnPromotion, PieceName, Square, Winner } from "@/model/types";
import { ReactNode, createContext, useContext, useReducer } from "react";
import { reducer } from "./reducer";

export type AppActions =
    | { type: 'CHOSE_COLOR', payload: { color: Color } }
    | { type: 'MOVE_PIECE', payload: { block: Square } }
    | { type: 'PROMOTE_PAWN', payload: { piece: PieceName } }
    | { type: 'GAME_UPDATE', payload: { move: Move } }
    | { type: 'NEW_GAME' }



export type AppState = {
    board: Square[][],
    currentBlock: Square | null,
    history: string[],
    currentPlayer: Color,
    self: Color | null,
    winner: Winner,
    promotion: PawnPromotion

}
export const initialState: AppState = {
    board: initBoard(),
    currentPlayer: 'white',
    self: null,
    history: [],
    currentBlock: null,
    winner: null,
    promotion: {
        showDialog: false,
        index: null
    },
}

export interface AppContext {
    state: AppState,
    movePiece: (block: Square) => void,
    newGame: () => void,
    promotoPawn: (piece: PieceName) => void,
    choseColor: (color: Color) => void,
    updateGame: (move: Move) => void
}
const appContext = createContext<AppContext | undefined>(undefined);




const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const movePiece = (block: Square) => dispatch({ type: "MOVE_PIECE", payload: { block } })
    const newGame = () => dispatch({ type: "NEW_GAME" })
    const promotoPawn = (piece: PieceName) => dispatch({ type: "PROMOTE_PAWN", payload: { piece } })
    const updateGame = (move: Move) => dispatch({ type: "GAME_UPDATE", payload: { move } })
    const choseColor = (color: Color) => dispatch({ type: "CHOSE_COLOR", payload: { color } })


    // useEffect(() => {
    //     socket.on('gameUpdate', (move: Move) => {
    //         updateGame(move)
    //     })
    // }, [socket])


    return (
        <appContext.Provider value={{ state, movePiece, newGame, promotoPawn, choseColor, updateGame }}>
            {children}
        </appContext.Provider>
    )
}


const useAppContext = () => {
    const context = useContext(appContext)
    if (context === undefined) {
        throw new Error("useFormContext must be used within a FormContextProvider");
    }
    return context;
};



export { AppContextProvider, useAppContext };