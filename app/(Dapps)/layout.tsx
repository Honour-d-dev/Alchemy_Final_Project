import Link from "next/link";
import { AiOutlineBars } from "react-icons/ai";
import { FaWpexplorer } from "react-icons/fa";
import { BsCurrencyExchange } from "react-icons/bs";
import { GiArchiveResearch } from "react-icons/gi";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" max-w-screen flex min-h-screen flex-row items-center justify-center ">
      <Sheet>
        <SheetTrigger className=" fixed left-4 top-4 z-30 flex h-9 w-9 items-center justify-center p-1 shadow-md">
          <AiOutlineBars className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent className="flex w-3/5 flex-col gap-2 sm:max-w-xs" side={"left"}>
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
        </SheetContent>
      </Sheet>
      {children}
    </div>
  );
}
