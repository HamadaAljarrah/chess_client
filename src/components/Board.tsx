import { useAppContext } from '@/context/board-context'
import { PieceName, Square } from '@/model/types'
import React, { useState } from 'react'
import Block from './Block'
import Dialog from './Dialog'
import { PromotionPieces } from '@/model/data'

const chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const nums = [8, 7, 6, 5, 4, 3, 2, 1]


const Board = ({ className }: { className?: string }) => {
    const [selectedPiece, setSelectedPiece] = useState<PieceName>('QUEEN')
    const { state, movePiece, newGame, promotoPawn } = useAppContext()


    return (
        <>
            <div className='bg-slate-300 px-6 relative'>
                <div className={`grid grid-cols-8 gap-0 w-full max-w-[800px] box-content ${state.self === 'black' ? "rotate-180" : ""} ${className}`}>
                    {chars.map((char, i) => <div key={i + char} className={`text-center ${state.self === 'black' ? "rotate-180" : ""}`}>{char}</div>)}
                    {state.board.map((row, rowIdx) => {
                        return row.map((col, colIdx) => {
                            return (
                                <div key={colIdx + "-" + rowIdx} className='relative'>
                                    {colIdx === 0 && <div className={`absolute bottom-1/2 translate-y-1/2 -left-4 ${state.self === 'black' ? "rotate-180" : ""}`}>{nums[rowIdx]}</div>}
                                    {colIdx === 7 && <div className={`absolute bottom-1/2  translate-y-1/2  -right-4 ${state.self === 'black' ? "rotate-180" : ""}`}>{nums[rowIdx]}</div>}
                                    <Block
                                        
                                        routate={rowIdx === 0 || rowIdx === 1}
                                        onClick={(block: Square) => movePiece(block)}
                                        block={col}
                                        src={col.piece?.img}
                                        className={`${state.self === 'black' ? "rotate-180" : ""}`}
                                    />
                                </div>

                            )
                        })
                    }
                    )}
                    {chars.map((char, i) => <div key={char + i} className={`text-center ${state.self === 'black' ? "rotate-180" : ""}`}>{char}</div>)}
                </div>
            </div>

            <Dialog isOpen={state.winner !== null} onClose={newGame}>
                <div className='flex flex-col p-4 gap-8 justify-center items-center'>
                    <h1 className='font-bold text-6xl'>{state.winner} Won!</h1>
                    <button onClick={newGame} className='px-4 py-2 mb-2 bg-slate-600 text-white w-full'>New Game</button>
                </div>
            </Dialog>


            <Dialog isOpen={state.promotion.showDialog} onClose={() => { }}>
                <div className='flex flex-col gap-4 justify-center items-center'>
                    <div className='flex gap-2'>
                        {PromotionPieces[state.currentPlayer === 'white' ? 'black' : 'white'].map(piece => (
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