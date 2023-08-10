"use client"
import { useAppContext } from '@/context/board-context'
import React, { useEffect } from 'react'
import { useRef } from 'react';

const Movement = () => {

    const { state, forward, backward } = useAppContext();


    const scrollableRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (scrollableRef.current) {
          scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
        }
      }, [state.movementScripts]);

    return (
        <div className='px-2 flex flex-col gap-2 w-[25%]'>
            {/* <button className='px-4 py-2 mb-2 bg-slate-600 text-white w-full' onClick={backward}>Regret Move</button> */}
            
            <div  ref={scrollableRef} className=' h-64 overflow-auto'>
                {state.movementScripts.map((script, index) => (
                    <p key={index} className={`
                        px-4 py-2 ${index%2 === 0 ? "bg-slate-100" :"bg-white"}
                    `}>{script}</p>
                ))}
            </div>


        </div>
    )
}

export default Movement