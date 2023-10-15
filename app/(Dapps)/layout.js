"use client";
import Link from "next/link";
import { useState } from "react";
//import classNames from "classnames";
import { AiOutlineClose, AiOutlineBars } from "react-icons/ai";
import { FaWpexplorer } from "react-icons/fa";
import { BsCurrencyExchange } from "react-icons/bs";
import { GiArchiveResearch } from "react-icons/gi";

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    // !window.ethereum ?

    //<div>Please Install a Browser Wallet</div> :

    <div className=" max-w-screen flex min-h-screen flex-row items-center justify-center ">
      {!showSidebar && (
        <AiOutlineBars
          className=" fixed left-4 top-4 z-30 h-9 w-9 p-1 shadow-md"
          onClick={() => setShowSidebar(!showSidebar)}
        />
      )}
      <div
        className={` fixed left-0 top-0 z-30 h-screen w-[50vw] animate-[move-in_0.7s_ease_forwards] flex-col space-y-2 border-x-gray-700 bg-zinc-200 p-6 shadow-md sm:w-[35vw] md:w-[22vw] lg:w-[16vw] ${
          showSidebar ? "flex" : "hidden"
        }`}
      >
        <AiOutlineClose
          className=" absolute right-2 top-2 h-7 w-7 p-1 shadow-md"
          onClick={() => setShowSidebar(!showSidebar)}
        />
        <Link href="/" className="pb-4 text-3xl font-bold">
          DappLib
        </Link>
        <h2 className="border-b border-zinc-600 font-semibold"> Dapps </h2>
        <Link href="/explorer" className="ml-[8px] flex flex-row gap-1 rounded-sm p-[6px] font-sans opacity-90">
          <FaWpexplorer size={"20px"} /> Block Explorer
        </Link>
        <Link href="/indexer" className="ml-[8px] flex flex-row gap-1 rounded-sm p-[6px] font-sans opacity-90">
          <GiArchiveResearch size={"20px"} /> Token Indexer
        </Link>
        <Link href="/escrow" className="ml-[8px] flex flex-row gap-1 rounded-sm p-[6px] font-sans opacity-90">
          <BsCurrencyExchange size={"20px"} />
          Escrow Dapp
        </Link>
      </div>
      {children}
    </div>
  );
}
