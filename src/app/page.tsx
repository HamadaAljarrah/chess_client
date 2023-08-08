"use client"
import Board from "@/components/Board";
import Movement from "@/components/Movement";
import { AppContextProvider } from "@/context/board-context";




export default function Home() {

    return (
        <AppContextProvider >
            <div className="flex gap-2">
                <Board />
                <Movement />
            </div>

        </AppContextProvider>


    )

}