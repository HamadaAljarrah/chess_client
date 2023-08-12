"use client"
import Board from "@/components/Board";
import Movement from "@/components/Movement";
import { AppContextProvider } from "@/context/board-context";




export default function Home() {

    return (
        <AppContextProvider >
            <div className="flex pt-4 gap-8 justify-center items-start">
                <Board className="w-[80%]"/>
                <Movement className="w-[20%]"/>
            </div>

        </AppContextProvider>


    )

}