"use client";
import { useState } from "react";
import { EscrowType } from "./utils/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { EscrowForm } from "./ecsrowForms";
import { useEscrow } from "./utils/useEscrow";
import { FaWallet } from "react-icons/fa";
import Escrow from "./escrow";
import { IoMdArrowDropdown } from "react-icons/io";
import { formatAddress } from "@/utils/utils";

function App() {
  const [escrowType, setEscrowType] = useState<EscrowType>();
  const [openEscrowList, setOpenEscrowList] = useState(false);
  const { account, connectWallet } = useEscrow();

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center">
      <div className="absolute left-0 top-0 flex w-full justify-center bg-primary">
        <h1 className="m-5 text-center text-3xl font-medium text-white">Escrow Dapp</h1>
        <button
          id="connect"
          className="fixed right-2 top-4 z-20 m-1 rounded-md bg-zinc-300 p-2"
          onClick={async (e) => {
            e.preventDefault();
            await connectWallet();
          }}
        >
          <FaWallet size={"1.5rem"} className="inline" />
          <span className="ml-1 hidden md:inline">Connect</span>
        </button>
      </div>
      <div className="flex w-[400px] flex-col gap-2 rounded-lg border">
        <Popover open={openEscrowList} onOpenChange={setOpenEscrowList}>
          <PopoverTrigger asChild>
            <div className="flex items-center justify-center gap-2 rounded-md border py-2 text-center font-semibold">
              {escrowType
                ? escrowType === "exchange"
                  ? "Exchange Escrow"
                  : escrowType === "timelock"
                  ? "TimeLock Escrow"
                  : "O.T.C Escrow"
                : "Select Escrow Type"}
              <IoMdArrowDropdown className="pt-1" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-2">
            <ToggleGroup
              className="flex flex-col p-2"
              orientation="vertical"
              type="single"
              onValueChange={(escrow: EscrowType) => {
                setEscrowType(escrow);
                setOpenEscrowList(false);
              }}
            >
              <ToggleGroupItem className="p-2" value="exchange">
                Exchange Escrow
              </ToggleGroupItem>
              <ToggleGroupItem className="p-2" value="timelock">
                Timelock EScrow
              </ToggleGroupItem>
              <ToggleGroupItem className="p-2" value="otc">
                O.T.C Escrow
              </ToggleGroupItem>
            </ToggleGroup>
          </PopoverContent>
        </Popover>
        <EscrowForm escrowType={escrowType} />
      </div>
      <Escrow />
    </div>
  );
}

export default App;
