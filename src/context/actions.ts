import { Square } from "@/model/types";

export type AppActions =
    | { type: 'MOVE_PIECE' }
    | { type: 'MOUSE_CLICK', payload: { block: Square } }
    | { type: 'SHOW_LEGAL_MOVES', payload: { block: Square } }
    | { type: 'REMOVE_LEGAL_MOVES' }