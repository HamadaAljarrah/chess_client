import { useAppContext } from '@/context/board-context'
import { Index, Square } from '@/model/types'
import React from 'react'
import Block from './Block'

const Board = () => {
    const { state, movePiece } = useAppContext()


    const handleClick = (block: Square) => {
 
        
        movePiece(block)
    }


    return (
        <div className="grid grid-cols-8 grid-rows-8 w-[800px] h-[800px] border-slate-800 border-[1px]">
            {state.board.map((row, rowIdx) =>
                row.map((col, colIdx) =>
                    <Block onClick={handleClick} key={rowIdx + "-" + colIdx} block={col} src={col.piece?.img} />
                )
            )}
        </div>
    )
}

export default Board