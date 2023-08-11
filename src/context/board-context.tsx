import { initBoard } from "@/helpers/game";
import { Color, Index, Square } from "@/model/types";
import { ReactNode, createContext, useContext, useReducer } from "react";
import { reducer } from "./reducer";

export type AppActions =
    | { type: 'MOVE_PIECE', payload: { block: Square } }
    | { type: 'STATE_BACKWARD' }



export type AppState = {
    board: Square[][],
    currentBlock: Square | null,
    history: string[],
    currentPlayer: Color
    kingPosition: Record<Color, Index>,
    boardBackup: Square[][][],
    backupIndex: number
}


export interface AppContext {
    state: AppState,
    movePiece: (block: Square) => void
    backward: () => void



}
const appContext = createContext<AppContext | undefined>(undefined);


export const initialState: AppState = {
    board: initBoard(),
    currentBlock: null,
    history: [],
    kingPosition: {white: {y:7,x:0}, black: {x:4,y:0}},
    boardBackup: [initBoard()],
    backupIndex: 0,
    currentPlayer: 'white',
}

const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const movePiece = (block: Square) => dispatch({ type: "MOVE_PIECE", payload: { block } })
    const backward = () => dispatch({ type: "STATE_BACKWARD" })


    return (
        <appContext.Provider value={{ state, movePiece, backward }}>
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