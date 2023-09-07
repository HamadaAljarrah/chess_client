"use client"
import Board from "@/components/Board";
import Movement from "@/components/Movement";
import { useAppContext } from "@/context/board-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; // Import useEffect

export default function Home() {
    const { state } = useAppContext();
    const router = useRouter();

    useEffect(() => {
        if (!state.self) {
            router.push('/');
        }
    }, [state.self, router]);

    if (!state.self) {
        return null;
    }

    return (
        <div className="flex flex-col lg:flex-row pt-4 gap-8  justify-center items-center lg:items-start">
            <Board className="w-[80%]" />
            <Movement className="w-[20%]" />
        </div>
    );
}
