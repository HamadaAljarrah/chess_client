import { useAppContext } from '@/context/board-context'
import { Square } from '@/model/types'
import React from 'react'
import Block from './Block'
import { nextChar } from '@/helpers/ui'


const Board = () => {
    const { state, movePiece } = useAppContext()

    const handleClick = (block: Square) => {        
        movePiece(block)
    }


    return (
        <div className="grid grid-cols-8 gap-0 px- border-slate-800 border-[2px] box-content w-[75%]">
            {state.board.map((row, rowIdx) => {
                let char = "@"
                return row.map((col, colIdx) => {
                    char = nextChar(char)
                    let x = 9;
                    return (
                        <div
                            key={rowIdx + "-" + colIdx}
                            className='relative '>

                            {rowIdx === 7 &&
                                <p className={`
                                    absolute 
                                    -bottom-7
                                    left-1/2
                                    tronfrom -translate-x-1/2
                                    font-semibold
                                `}>{char}</p>
                            }

                            {colIdx === 0 &&
                                <p className={`
                                    absolute -left-5
                                    top-1/2
                                    tronfrom -translate-y-1/2
                                    font-semibold
                                `}>{--x - rowIdx}</p>
                            }
                            <Block
                                routate={rowIdx === 0 || rowIdx === 1}
                                onClick={handleClick}
                                block={col}
                                src={col.piece?.img}
                            />
                        </div>
                    )
                })
            }
            )}
        </div>

    )
}

export default Board