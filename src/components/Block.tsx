import { Square, Color, Index } from "@/model/types"
import { useState } from "react"

interface Props {
    block: Square,
    onClick: (block:Square) => void,
    src?: string
}

const Block = ({ onClick, block, src, ...props }: Props) => {

    const handleClick = () => {
        onClick(block)
    }




    return (
        <div onClick={handleClick} {...props} className={` 
                ${block.color === 'black' ? "bg-slate-600" : "bg-slate-50"}
                flex
                justify-center
                items-center
                relative
                w-[100px]
                h-[100px]
            `}>
            {
                block.availibale &&
                <div className={`
                    absolute
                    z-0
                    inset-0
                    bg-green-500
                    opacity-50
                `} />
            }
            {
                block.focus &&
                <div className={`
                    absolute
                    z-0
                    inset-0
                    bg-purple-500
                    opacity-50
                `} />
            }

            {src &&
                <img draggable src={src} alt={src} className={`
                    w-full
                    object-contain
                    relative
                    z-1
                `} />
            }
        </div>
    )
}

export default Block