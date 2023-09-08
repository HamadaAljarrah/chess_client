import { copyBoard, initBoard, stimulateMove } from "@/helpers/game";
import { Color, Index, Move, PawnPromotion, PieceName, Square, Winner } from "@/model/types";
import { ReactNode, createContext, useContext, useEffect, useReducer } from "react";
import { reducer } from "./reducer";
import { socket } from "@/model/socket";

export type AppActions =
    | { type: 'CHOSE_COLOR', payload: { color: Color } }
    | { type: 'MOVE_PIECE', payload: { block: Square } }
    | { type: 'PROMOTE_PAWN', payload: { piece: PieceName } }
    | { type: 'GAME_UPDATE', payload: { move: Move } }
    | { type: 'SET_BOARD', payload: { board: Square[][] } }
    | { type: 'HANDLE_REMOTE_CASTLE', payload: { move: Move } }
    | { type: 'HANDLE_REMOTE_PROMOTION', payload: { color: Color, index: Index, piece: PieceName } }
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
    handleRemoteCastle: (move: Move) => void
    handleRemotePromotion: ({color,index,piece}:{color: Color, index: Index, piece: PieceName}) => void
    setBoard: (board: Square[][]) => void

}
const appContext = createContext<AppContext | undefined>(undefined);




const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const movePiece = (block: Square) => dispatch({ type: "MOVE_PIECE", payload: { block } })
    const newGame = () => dispatch({ type: "NEW_GAME" })
    const promotoPawn = (piece: PieceName) => dispatch({ type: "PROMOTE_PAWN", payload: { piece } })
    const updateGame = (move: Move) => dispatch({ type: "GAME_UPDATE", payload: { move } })
    const handleRemoteCastle = (move: Move) => dispatch({ type: "HANDLE_REMOTE_CASTLE", payload: { move } })
    const choseColor = (color: Color) => dispatch({ type: "CHOSE_COLOR", payload: { color } })
    const setBoard = (board: Square[][]) => dispatch({ type: "SET_BOARD", payload: { board } })
    const handleRemotePromotion = ({color,index,piece}:{color: Color, index: Index, piece: PieceName}) => dispatch({ type: "HANDLE_REMOTE_PROMOTION", payload: { color, index, piece } })


    useEffect(() => {
        socket.on('gameUpdate', (data: Move) => {
            updateGame(data)
        })
        socket.on('castle', (data: Move) => {
            handleRemoteCastle(data);
        })
        socket.on('promotion', ({color,index,piece}:{color: Color, index: Index, piece: PieceName}) => {            
            handleRemotePromotion({color, index, piece});
        })

    }, [socket])


    return (
        <appContext.Provider value={{ state, movePiece, newGame, promotoPawn, choseColor, updateGame, handleRemoteCastle, handleRemotePromotion, setBoard }}>
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