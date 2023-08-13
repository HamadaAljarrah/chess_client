import { useAppContext } from '@/context/board-context'
import { PieceName, Square } from '@/model/types'
import React, { useEffect, useState } from 'react'
import Block from './Block'
import { nextChar } from '@/helpers/ui'
import Dialog from './Dialog'
import { socket } from '@/model/socket'
import { PromotionPieces } from '@/model/data'


const Board = ({ className }: { className?: string }) => {
    const [selectedPiece, setSelectedPiece] = useState<PieceName>('QUEEN')
    const { state, movePiece, newGame, updateGame, promotoPawn } = useAppContext()

    const handleClick = (block: Square) => movePiece(block)

    // useEffect(()=>{
    //     socket.on('gameUpdate', ({from,to})=> {
    //         updateGame({from,to})
    //     })
    // },[socket])


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

            
            <Dialog isOpen={state.promotion.showDialog} onClose={() => {}}>
                <div className='flex flex-col gap-4 justify-center items-center'>
                    <div className='flex gap-2'>
                        {PromotionPieces[state.currentPlayer === "black" ? "white": "black"].map(piece => (
                            <div onClick={() => setSelectedPiece(piece.value)} key={piece.value} className={`w-[100px] h-[100px] object-contain cursor-pointer ${selectedPiece === piece.value ? "bg-slate-200" : ""}`}>
                                <img src={piece.img} alt={piece.value} />
                            </div>
                        ))}
                    </div>
                    <button onClick={() => promotoPawn(selectedPiece)} className='px-4 py-2 mb-2 bg-slate-600 text-white w-full'>Confirm</button>
                </div>
            </Dialog>
        </>
    )
}

export default Board