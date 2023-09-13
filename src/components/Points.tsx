import { useAppContext } from '@/context/board-context'
import React from 'react'

const Points = () => {
    const { state } = useAppContext();
    return (
        <div className='flex gap-5'>
            <p><strong>Black:</strong> {state.blackPoints}</p>
            <p><strong>White:</strong> {state.whitePoints}</p>
        </div>

    )
}

export default Points