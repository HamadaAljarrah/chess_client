import { copyBoard, initBoard, stimulateMove } from "@/helpers/game";
import { Color, Index, RemoteMove, PawnPromotion, PieceName, RemoteCastle, Square, Winner } from "@/model/types";
import { ReactNode, createContext, useContext, useEffect, useReducer } from "react";
import { reducer } from "./reducer";
import { socket } from "@/model/socket";

export type AppActions =
    | { type: 'CHOSE_COLOR', payload: { color: Color } }
    | { type: 'CHOSE_CHANNEL', payload: { channel: string } }
    | { type: 'MOVE_PIECE', payload: { block: Square } }
    | { type: 'PROMOTE_PAWN', payload: { piece: PieceName } }
    | { type: 'SET_BOARD', payload: { board: Square[][] } }
    | { type: 'NEW_GAME' }
    // Server actions
    | { type: 'GAME_UPDATE', payload: { move: RemoteMove } }
    | { type: 'HANDLE_REMOTE_HISTORY', payload: { data: string } }
    | { type: 'HANDLE_REMOTE_CASTLE', payload: { move: RemoteMove } }
    | { type: 'HANDLE_REMOTE_PROMOTION', payload: { data: RemoteCastle } }



export type AppState = {
    board: Square[][],
    currentBlock: Square | null,
    history: string[],
    currentPlayer: Color,
    self: Color | null,
    channel: string | null,
    winner: Winner,
    promotion: PawnPromotion,
    whitePoints: number,
    blackPoints: number,

}
export const initialState: AppState = {
    board: initBoard(),
    currentPlayer: 'white',
    self: null,
    channel: null,
    history: [],
    currentBlock: null,
    winner: null,
    promotion: {
        showDialog: false,
        index: null
    },
    blackPoints: 0,
    whitePoints: 0
}

export interface AppContext {
    state: AppState,
    movePiece: (block: Square) => void,
    newGame: () => void,
    promotoPawn: (piece: PieceName) => void,
    choseColor: (color: Color) => void,
    choseChannel: (channel: string) => void,
    setBoard: (board: Square[][]) => void
    updateGame: (move: RemoteMove) => void
    handleRemoteCastle: (move: RemoteMove) => void
    handleRemotePromotion: (data: RemoteCastle) => void
    handleRemoteHistory: (data: string) => void

}
const appContext = createContext<AppContext | undefined>(undefined);




const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const movePiece = (block: Square) => dispatch({ type: "MOVE_PIECE", payload: { block } })
    const newGame = () => dispatch({ type: "NEW_GAME" })
    const promotoPawn = (piece: PieceName) => dispatch({ type: "PROMOTE_PAWN", payload: { piece } })
    const updateGame = (move: RemoteMove) => dispatch({ type: "GAME_UPDATE", payload: { move } })
    const handleRemoteCastle = (move: RemoteMove) => dispatch({ type: "HANDLE_REMOTE_CASTLE", payload: { move } })
    const choseColor = (color: Color) => dispatch({ type: "CHOSE_COLOR", payload: { color } })
    const choseChannel = (channel: string) => dispatch({ type: "CHOSE_CHANNEL", payload: { channel } })
    const setBoard = (board: Square[][]) => dispatch({ type: "SET_BOARD", payload: { board } })
    const handleRemotePromotion = (data: RemoteCastle) => dispatch({ type: "HANDLE_REMOTE_PROMOTION", payload: { data } })
    const handleRemoteHistory = (data: string) => dispatch({ type: "HANDLE_REMOTE_HISTORY", payload: { data } })



    useEffect(() => {
        socket.on('gameUpdate', (data: RemoteMove) => {
            updateGame(data)
        })
        socket.on('castle', (data: RemoteMove) => {
            handleRemoteCastle(data);
        })
        socket.on('promotion', (data: RemoteCastle) => {
            handleRemotePromotion(data);
        })
        socket.on('history', (data: string) => {
            handleRemoteHistory(data);
        })

    }, [socket])


    return (
        <appContext.Provider value={{
            state,
            movePiece,
            newGame,
            promotoPawn,
            choseColor,
            choseChannel,
            updateGame,
            handleRemoteCastle,
            handleRemotePromotion,
            handleRemoteHistory,
            setBoard
        }}>
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