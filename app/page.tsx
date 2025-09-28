import "./globals.css"
import Link from "next/link";


export default function Home() {
  return (
    <div className="h-screen p-4 max-w-[600px] flex flex-col items-start justify-center mx-auto gap-6">
        <div className="">
          <h1 className="text-white text-2xl font-bold my-4">
            TODO <span className="text-gray-400">APP</span>
          </h1>
          <p className="text-lg">
            A comprehensive Todo application built using React to showcases API
            integration, modern patterns, routing, and accessible UI.
          </p>
        </div>

        <div className="flex flex-row gap-4">
          <button className="px-6 py-2 border-gray-300 border-2 rounded-2xl bg-white text-gray-600 hover:text-gray-900 hover:scale-[1.05]">
          <Link href="/todo">View Todos</Link>
          </button>
          <button className="px-6 py-2 border-red-500 border-2 rounded-2xl hover:scale-[1.05] text-gray-300 hover:text-white">
            <Link href="/notfound">Test Not Found Page</Link>
          </button>
        </div>
      </div>
  );
}
