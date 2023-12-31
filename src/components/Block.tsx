import { Square } from "@/model/types"

interface Props {
    block: Square,
    routate?: boolean;
    onClick: (block: Square) => void,
    src?: string,
    className?: string
}

const Block = ({ onClick, block, src, routate, className, ...props }: Props) => {

    const handleClick = () => {
        onClick(block)
    }




    return (
        <div onClick={handleClick} {...props} className={` 
                ${block.color === 'black' ? "bg-slate-600" : "bg-slate-50"}
                cursor-pointer
                flex
                justify-center
                items-center
                relative
                w-[calc(1/8%)]
                h-[calc(1/8%)]
                aspect-square
                ${className}
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
            {
                block.footPrint &&
                <div className={`
                    absolute
                    z-0
                    inset-0
                    bg-yellow-500
                    opacity-90
                `} />
            }
            {
                block.danger &&
                <div className={`
                    absolute
                    z-0
                    inset-0
                    bg-red-500
                    opacity-90
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