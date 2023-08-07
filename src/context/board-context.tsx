import {  initBoard } from "@/helpers/game";
import { Square } from "@/model/types";
import {  ReactNode, createContext, useContext, useReducer } from "react";
import { reducer } from "./reducer";


export type AppState = {
    board: Square[][],
    movement: {
        src: Square | null,
        dest: Square | null
    }
}


export interface AppContext {
    state: AppState,
    movePiece: (block: Square) => void

}
const appContext = createContext<AppContext | undefined>(undefined);


export const initialState: AppState = {
    board: initBoard(),
    movement: {
        src: null,
        dest: null
    }
}

const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    const movePiece = (block: Square) => {
        dispatch({ type: "MOUSE_CLICK", payload: { block } })
        dispatch({ type: 'SHOW_LEGAL_MOVES', payload: { block } })
        dispatch({ type: "MOVE_PIECE" })
        dispatch({ type: 'REMOVE_LEGAL_MOVES' })

    }

    return (
        <appContext.Provider value={{ state, movePiece }}>
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