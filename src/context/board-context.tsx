import { initBoard } from "@/helpers/game";
import { Color, Index, PawnPromotion, PieceName, Square, Winner } from "@/model/types";
import { ReactNode, createContext, useContext, useReducer } from "react";
import { reducer } from "./reducer";

export type AppActions =
    | { type: 'MOVE_PIECE', payload: { block: Square } }
    | { type: 'NEW_GAME' }
    | { type: 'PROMOTE_PAWN', payload:{piece: PieceName} }
    | { type: 'GAME_UPDATE', payload: {from:Index, to:Index} }






export type AppState = {
    board: Square[][],
    currentBlock: Square | null,
    history: string[],
    currentPlayer: Color,
    winner: Winner,
    promotion: PawnPromotion

}
export const initialState: AppState = {
    board: initBoard(),
    currentBlock: null,
    history: [],
    currentPlayer: 'white',
    winner: null,
    promotion: {
        showDialog: false,
        index: null
    },
}

export interface AppContext {
    state: AppState,
    movePiece: (block: Square) => void,
    newGame: ()=> void,
    promotoPawn: (piece:PieceName)=> void,
    updateGame : ({from, to}:{from:Index,to:Index}) => void
}
const appContext = createContext<AppContext | undefined>(undefined);




const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const movePiece = (block: Square) => dispatch({ type: "MOVE_PIECE", payload: { block } })
    const newGame = ()=> dispatch({ type: "NEW_GAME" })
    const promotoPawn = (piece:PieceName)=> dispatch({ type: "PROMOTE_PAWN", payload:{piece} })
    const updateGame = ({from, to}:{from:Index,to:Index})=> dispatch({ type: "GAME_UPDATE" , payload:{from,to}})

    return (
        <appContext.Provider value={{ state, movePiece, newGame,updateGame, promotoPawn }}>
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