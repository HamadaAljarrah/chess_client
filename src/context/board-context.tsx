import { initBoard } from "@/helpers/game";
import { Color, Square, Winner } from "@/model/types";
import { ReactNode, createContext, useContext, useReducer } from "react";
import { reducer } from "./reducer";

export type AppActions =
    | { type: 'MOVE_PIECE', payload: { block: Square } }
    | { type: 'STATE_BACKWARD' }
    | { type: 'NEW_GAME' }





export type AppState = {
    board: Square[][],
    currentBlock: Square | null,
    history: string[],
    currentPlayer: Color,
    winner: Winner

}


export interface AppContext {
    state: AppState,
    movePiece: (block: Square) => void,
    backward: () => void,
    newGame: ()=> void,
}
const appContext = createContext<AppContext | undefined>(undefined);


export const initialState: AppState = {
    board: initBoard(),
    currentBlock: null,
    history: [],
    currentPlayer: 'white',
    winner: null
}

const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const movePiece = (block: Square) => dispatch({ type: "MOVE_PIECE", payload: { block } })

    const backward = () => dispatch({ type: "STATE_BACKWARD" })

    const newGame = ()=> dispatch({ type: "NEW_GAME" })

    return (
        <appContext.Provider value={{ state, movePiece, backward, newGame }}>
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