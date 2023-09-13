"use client"
import Board from "@/components/Board";
import Movement from "@/components/Movement";
import Points from "@/components/Points";
import { useAppContext } from "@/context/board-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; // Import useEffect

export default function Home() {
    const { state } = useAppContext();
    const router = useRouter();

    useEffect(() => {
        if (!state.self || !state.channel) {
            router.push('/');
        }
    }, [state.self, router]);

    

    if (!state.self) {
        return null;
    }

    return (
        <div className="flex flex-col lg:flex-row gap-2  justify-center items-center lg:items-start">
            <Board />
            <Points/>
            <Movement />
        </div>
    );
}
