"use client";
import { useState } from "react";
import { EscrowType } from "./utils/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { EscrowForm } from "./ecsrowForms";
import { useEscrow } from "./utils/useEscrow";
import Escrow from "./escrow";
import { format } from "@/utils/utils";

function App() {
  const [escrowType, setEscrowType] = useState<EscrowType>();
  const [openEscrowList, setOpenEscrowList] = useState(false);
  const { account, connectWallet } = useEscrow();

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center">
      <div className="flex justify-center">
        <h1 className="m-5 text-center text-3xl font-medium">Escrow Dapp</h1>
        <div
          id="connect"
          className="absolute right-3 top-1 m-2 flex cursor-pointer flex-col rounded-lg p-2 shadow-md"
          onClick={async (e) => {
            e.preventDefault();
            await connectWallet();
          }}
        >
          {account ? format(account) : "connect"}
        </div>
      </div>
      <div className="flex w-[400px] flex-col gap-2 rounded-lg border">
        <Popover open={openEscrowList} onOpenChange={setOpenEscrowList}>
          <PopoverTrigger asChild>
            <div className="flex justify-center rounded-md border py-2 text-center font-semibold">
              {escrowType
                ? escrowType === "exchange"
                  ? "Exchange Escrow"
                  : escrowType === "timelock"
                  ? "TimeLock Escrow"
                  : "O.T.C Escrow"
                : "Select Escrow Type"}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <ToggleGroup
              className="flex flex-col"
              orientation="vertical"
              type="single"
              onValueChange={(escrow: EscrowType) => {
                setEscrowType(escrow);
                setOpenEscrowList(false);
              }}
            >
              <ToggleGroupItem value="exchange">Exchange Escrow</ToggleGroupItem>
              <ToggleGroupItem value="timelock">Timelock EScrow</ToggleGroupItem>
              <ToggleGroupItem value="otc">O.T.C Escrow</ToggleGroupItem>
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
