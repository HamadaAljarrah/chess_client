"use client"
import { useAppContext } from '@/context/board-context'
import React, { useEffect } from 'react'
import { useRef } from 'react';



const Movement = ({className}: {className?:string}) => {

    const { state } = useAppContext();


    const scrollableRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (scrollableRef.current) {
          scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
        }
      }, [state.history]);

    return (
        <div className={`px-2 flex flex-col gap-2 min-w-fit ${className}`}>            
            <div  ref={scrollableRef} className=' h-64 overflow-auto'>
                {state.history.map((movement, index) => (
                    <p key={index} className={`
                        px-4 py-2 ${index%2 === 0 ? "bg-slate-100" :"bg-white"}
                    `}>{movement}</p>
                ))}
            </div>


        </div>
    )
}

export default Movement