import Image from "next/image";
import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center ">
      <div className="animate-fade-in text-3xl font-bold">
        Welcome to DappLib.
      </div>

      <div className="fixed bottom-4 flex flex-col space-y-5 sm:flex-row sm:space-x-5 sm:space-y-0">
        <Link
          href="/explorer"
          className=" group box-content space-x-2 rounded-md p-2 text-center shadow-sm transition duration-500 ease-in-out hover:scale-110 hover:bg-zinc-200 sm:h-[10vh] sm:w-[20vw]"
        >
          <h2 className="inline-block font-bold">Explorer</h2>
          <AiOutlineArrowRight className="inline-block transition duration-300 ease-out group-hover:translate-x-1" />
          <div className="opacity-50">A Blockchain Explorer</div>
        </Link>

        <Link
          href="/indexer"
          className="group box-content space-x-2 rounded-md p-2 text-center shadow-sm transition duration-500 ease-in-out hover:scale-110 hover:bg-zinc-200 sm:h-[10vh] sm:w-[20vw]"
        >
          <h2 className=" inline-block font-bold">Indexer</h2>
          <AiOutlineArrowRight className="inline-block transition duration-300 ease-out group-hover:translate-x-1" />
          <div className="opacity-50">A Token Indexer for NFTs/ERC20s</div>
        </Link>

        <Link
          href="/escrow"
          className="group box-content space-x-2 rounded-md p-2 text-center shadow-sm transition duration-500 ease-in-out hover:scale-110 hover:bg-zinc-200 sm:h-[10vh] sm:w-[20vw]"
        >
          <h2 className=" inline-block font-bold">Escrow</h2>
          <AiOutlineArrowRight className="inline-block transition duration-300 ease-out group-hover:translate-x-1" />
          <div className="opacity-50">An Escrow site</div>
        </Link>
      </div>
    </main>
  );
}
