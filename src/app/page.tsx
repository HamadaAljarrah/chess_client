"use client"
import Select from "@/components/Select";
import { useAppContext } from "@/context/board-context";
import { Color } from "@/model/types";
import { useRouter } from "next/navigation";
import { useState } from "react";


const OPTIONS = [
    { label: 'White', value: 'white' },
    { label: 'Black', value: 'black' },

]

export default function Home() {
    const [player, setPlayer] = useState<Color>('white')
    const [channel, setChannel] = useState<string>("")
    const router = useRouter()
    const { startGame } = useAppContext();


    const handleNext = () => {
        if (player && channel) {
            startGame(player, channel)
            router.push('/game');
        }
    }
    return (
        <div className="flex flex-col gap-4 px-2 items-center pt-20">
            <img src="./logo.svg" alt="logo" />
            <h1 className="text-slate-700 text-2xl font-semibold uppercase">Hamada Chess</h1>
            <p className="text-slate-700 text-xl   self-start">Choose Color</p>

            <Select options={OPTIONS} onSelect={(e) => setPlayer(e.value as Color)} />
            <input
                className="px-3 w-full h-10 rounded-md flex justify-between items-center cursor-pointer border-[1px] border-black/15"
                placeholder="Channel"
                onChange={(e) => setChannel(e.target.value)}
            ></input>
            <button className="py-2 px-3 rounded-md bg-slate-700 text-white w-full" onClick={handleNext} >Continue</button>
        </div>
    )

}
