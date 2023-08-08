import { useAppContext } from '@/context/board-context'
import React from 'react'

const Movement = () => {

    const { state, forward, backward } = useAppContext();

    return (
        <div className='mt-10'>
            <div className='flex gap-4'>
                {/* <button className='px-4 py-2 bg-slate-600 text-white' onClick={forward}>Forward</button> */}
                <button className='px-4 py-2 bg-slate-600 text-white' onClick={backward}>Backward</button>

            </div>
            <div>
                {state.movementScripts.map((script, index) => <p key={index}>{script}</p>)}
            </div>
        </div>
    )
}

export default Movement