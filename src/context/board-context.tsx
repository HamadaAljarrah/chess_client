import { initBoard } from "@/helpers/game";
import { Color, Square } from "@/model/types";
import { ReactNode, createContext, useContext, useReducer } from "react";
import { reducer } from "./reducer";

export type AppActions =
    | { type: 'MOVE_PIECE', payload: { block: Square } }
    | { type: 'STATE_BACKWARD' }
    | { type: 'STATE_FORWARD' }



export type AppState = {
    board: Square[][],
    currentBlock: Square | null,
    movementScripts: string[],

    boardBackup: Square[][][],
    backupIndex: number
    currentPlayer: Color
}


export interface AppContext {
    state: AppState,
    movePiece: (block: Square) => void
    forward: () => void
    backward: () => void



}
const appContext = createContext<AppContext | undefined>(undefined);


export const initialState: AppState = {
    board: initBoard(),
    currentBlock: null,
    movementScripts: [],

    boardBackup: [initBoard()],
    backupIndex: 0,
    currentPlayer: 'white'
}

const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const movePiece = (block: Square) => dispatch({ type: "MOVE_PIECE", payload: { block } })
    const forward = () => dispatch({ type: "STATE_FORWARD" })
    const backward = () => dispatch({ type: "STATE_BACKWARD" })


    return (
        <appContext.Provider value={{ state, movePiece, forward, backward }}>
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