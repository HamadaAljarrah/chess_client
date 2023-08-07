"use client"
import Board from "@/components/Board";
import { AppContextProvider } from "@/context/board-context";





export default function Home() {

    return (
        <AppContextProvider>
            <Board />
        </AppContextProvider>

    )

}