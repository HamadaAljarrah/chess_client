import { useAppContext } from '@/context/board-context'
import { Square } from '@/model/types'
import React from 'react'
import Block from './Block'
import { nextChar } from '@/helpers/ui'
import Dialog from './Dialog'


const Board = ({className}: {className?:string}) => {
    const { state, movePiece, newGame } = useAppContext()

    const handleClick = (block: Square) => {
        movePiece(block)
    }


    return (
        <>
            <div className={`grid grid-cols-8 gap-0 px- border-slate-800 border-[2px] box-content ${className}`}>
                {state.board.map((row, rowIdx) => {
                    let char = "@"
                    return row.map((col, colIdx) => {
                        char = nextChar(char)
                        let x = 9;
                        return (
                            <div
                                key={rowIdx + "-" + colIdx}
                                className='relative'>

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
            <Dialog isOpen={state.winner !== null} onClose={newGame}>
                <div className='flex flex-col gap-4 justify-center items-center'>
                    <h1 className='font-bold text-xl'>{state.winner} Win!</h1>
                    <button onClick={newGame} className='px-4 py-2 mb-2 bg-slate-600 text-white w-full'>New Game</button>
                </div>
            </Dialog>
        </>
    )
}

export default Board