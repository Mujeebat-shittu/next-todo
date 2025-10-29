import { KeyRound } from "lucide-react";
import { FaGithub, FaGoogle } from 'react-icons/fa';

export default function Page () {
    return(
        <>
        <div className="flex h-screen items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
            <div className="w-96 h-96 rounded-md border p-5">
                <div className="flex items-center gap-2 space-y-2">
                    <KeyRound/>
                <h1 className="text-2xl font-bold">Todo</h1>
                </div>

                <p className="">Register/Signin Today</p>

                <div className="flex flex-col gap-5 my-5">
                    <button className="w-full items-center justify-center gap-2 flex border-2 border-white/50 rounded-md">
                        <FaGithub/> GitHub
                    </button>
                    <button className=" w-full items-center justify-center gap-2 flex border-2 border-white/50 rounded-md">
                      <FaGoogle/>  Google
                    </button>
                </div>

            </div>
        </div>
        </>
    )
}