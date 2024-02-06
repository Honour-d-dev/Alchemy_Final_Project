"use client";
import { useRouter } from "next/navigation";
import { Utils } from "alchemy-sdk";
import { alchemy } from "@/utils/utils";
import { FiSearch } from "react-icons/fi";
import { useRef } from "react";

export default function explorerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const navigateRoute = async () => {
    if (inputRef.current) {
      const searchItem = inputRef.current.value;
      inputRef.current.value = "";

      if (Utils.hexDataLength(searchItem) === 20) {
        router.push(`/explorer/wallet/${searchItem}`);
      } else if (Utils.hexDataLength(searchItem) < 20) {
        router.push(`/explorer/block/${searchItem}`);
      } else {
        if ((await alchemy.core.getTransactionReceipt(searchItem)) === null) {
          router.push(`/explorer/block/${searchItem}`);
        }

        router.push(`/explorer/transaction/${searchItem}`);
      }
    }
  };

  return (
    <div className="relative top-24 flex w-screen flex-col items-center justify-center lg:top-0">
      <div className=" fixed top-0 z-10 h-20 w-screen bg-primary"></div>
      <div className="fixed top-0 z-20 flex flex-col items-center justify-center gap-2 md:flex-row">
        <h1 className="relative top-4 z-20 text-4xl font-semibold text-white">Block Explorer</h1>
        <div className="relative top-4 flex min-w-[300px] max-w-[500px] rounded-md bg-white p-1 focus-within:outline focus-within:outline-zinc-400">
          <input
            id="input"
            ref={inputRef}
            type="text"
            className="m-1 flex flex-grow px-1 placeholder:text-center placeholder:font-[cursive] focus-visible:outline-none"
            placeholder="Enter an address to search"
          />
          <button
            className=" m-auto rounded-md bg-zinc-200 p-2"
            onClick={(e) => {
              e.preventDefault();
              navigateRoute();
            }}
          >
            <FiSearch />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
