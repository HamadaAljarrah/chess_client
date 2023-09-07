"use client"
import Select from "@/components/Select";
import { useAppContext } from "@/context/board-context";
import { Color } from "@/model/types";
import { useRouter } from "next/navigation";
import { useState } from "react";


const OPTIONS = [
    {label:'White', value:'white'},
    {label:'Balck', value:'black'},

]

export default function Home() {
    const [player, setPlayer] = useState<Color>('white')
    const router = useRouter()
    const { choseColor } = useAppContext();

    const handleNext = () => {
        choseColor(player);
        router.push('/game');
    }
    return (
        <div className="flex flex-col gap-4 items-center pt-20">
            <h1 className="text-slate-700 text-2xl font-semibold uppercase">Choose Color</h1>
            <Select options={OPTIONS} onSelect={(e) => setPlayer(e.value as Color)}/>
            <button className="py-2 px-3 rounded-md bg-slate-700 text-white w-full" onClick={handleNext} >Continue</button>
        </div>
    )

}
