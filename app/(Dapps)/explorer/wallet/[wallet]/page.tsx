"use client";
import { useEffect, useState } from "react";
import { alchemy, format } from "@/utils/utils";
import Link from "next/link";
import { AssetTransfersCategory, AssetTransfersWithMetadataResult, SortingOrder, Utils } from "alchemy-sdk";
import { useParams } from "next/navigation";
import { RxOpenInNewWindow } from "react-icons/rx";

function Wallet() {
  const { wallet } = useParams();
  const [balance, setBalance] = useState<string>();
  const [transfersFrom, setTransfersFrom] = useState<AssetTransfersWithMetadataResult[]>([]);
  const [transfersTo, setTransfersTo] = useState<AssetTransfersWithMetadataResult[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function getBalance() {
      if (typeof wallet !== "string") throw new Error("Wallet not found");
      const balance = await alchemy.core.getBalance(wallet);
      const count = await alchemy.core.getTransactionCount(wallet);
      const fromTransfers = await alchemy.core.getAssetTransfers({
        fromAddress: wallet,
        order: SortingOrder.DESCENDING,
        maxCount: 6,
        category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.INTERNAL, AssetTransfersCategory.ERC20],
        withMetadata: true,
      });
      const toTransfers = await alchemy.core.getAssetTransfers({
        toAddress: wallet,
        order: SortingOrder.DESCENDING,
        maxCount: 6,
        category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.INTERNAL, AssetTransfersCategory.ERC20],
        withMetadata: true,
      });

      setBalance(balance._hex);
      setCount(count);
      setTransfersFrom(fromTransfers.transfers);
      setTransfersTo(toTransfers.transfers);
    }

    getBalance();
  }, [wallet]);

  return (
    <div className="flex w-full flex-col">
      <div className="m-8 flex flex-col rounded p-2 shadow-md lg:w-1/2">
        <div className="m-2">
          <p>Address </p>
          <p>{wallet}</p>
        </div>
        <div className="m-2 flex flex-col">
          <p>Eth Balance</p>
          <p>{balance ? `${Utils.formatEther(balance)} ETH` : "loading..."}</p>
        </div>
        <div className="m-2 flex flex-col">
          <p>Total Transactions</p>
          <p>{`${count} txns`}</p>
        </div>
        <Link href={`/indexer?search=${wallet}`} className="m-2 flex flex-row">
          Token Holdings
          <RxOpenInNewWindow size={"25px"} className="opacity-60" />
        </Link>
      </div>
      <div className="flex flex-col">
        <h2 className="p-4 text-lg font-medium ">Recent Transactions</h2>
        <div className="m-2 w-screen overflow-x-auto rounded shadow">
          <h3 className="ml-8 text-3xl font-medium ">Out</h3>
          <table className="m-4 w-full p-2">
            <thead>
              <tr className="border-b border-zinc-400">
                <th className="whitespace-nowrap p-3 font-medium">Transaction hash</th>
                <th className="whitespace-nowrap p-3 font-medium">Block Num</th>
                <th className="whitespace-nowrap p-3 font-medium">From</th>
                <th className="whitespace-nowrap p-3 font-medium">To</th>
                <th className="whitespace-nowrap p-3 font-medium">Date</th>
                <th className="whitespace-nowrap p-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transfersFrom &&
                transfersFrom.map((transferFrom) => (
                  <tr className=" border-b border-zinc-300" key={transferFrom.hash}>
                    <td className=" whitespace-nowrap p-3">
                      <Link href={`/explorer/transaction/${transferFrom.hash}`}>{format(transferFrom.hash)}</Link>
                    </td>
                    <td className="whitespace-nowrap p-3">
                      <Link href={`/explorer/block/${Number(transferFrom.blockNum)}`}>
                        {Number(transferFrom.blockNum)}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap p-3">
                      <Link href={`/explorer/wallet/${transferFrom.from}`}>{format(transferFrom.from)}</Link>
                    </td>
                    <td className="whitespace-nowrap p-3">
                      <Link href={`/explorer/wallet/${transferFrom.to}`}>
                        {transferFrom.to ? format(transferFrom.to) : "-"}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap p-3">{transferFrom.metadata.blockTimestamp.slice(0, 10)}</td>
                    <td className=" whitespace-nowrap p-3">
                      {transferFrom.value ? `${transferFrom.value.toFixed(3)} ETH` : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="m-2 w-screen overflow-x-auto rounded shadow">
          <h3 className="ml-8 text-3xl font-medium ">In</h3>
          <table className="m-4 w-full p-2">
            <thead>
              <tr className="border-b border-zinc-400">
                <th className="whitespace-nowrap p-3 font-medium">Transaction hash</th>
                <th className="whitespace-nowrap p-3 font-medium">Block Num</th>
                <th className="whitespace-nowrap p-3 font-medium">From</th>
                <th className="whitespace-nowrap p-3 font-medium">To</th>
                <th className="whitespace-nowrap p-3 font-medium">Date</th>
                <th className="whitespace-nowrap p-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transfersTo &&
                transfersTo.map((transferTo) => (
                  <tr className=" border-b border-zinc-300" key={transferTo.hash}>
                    <td className=" whitespace-nowrap p-3">
                      <Link href={`/explorer/transaction/${transferTo.hash}`}>{format(transferTo.hash)}</Link>
                    </td>
                    <td className="whitespace-nowrap p-3">
                      <Link href={`/explorer/block/${Number(transferTo.blockNum)}`}>{Number(transferTo.blockNum)}</Link>
                    </td>
                    <td className="whitespace-nowrap p-3">
                      <Link href={`/explorer/wallet/${transferTo.from}`}>{format(transferTo.from)}</Link>
                    </td>
                    <td className="whitespace-nowrap p-3">
                      <Link href={`/explorer/wallet/${transferTo.to}`}>
                        {transferTo.to ? format(transferTo.to) : "-"}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap p-3">{transferTo.metadata.blockTimestamp.slice(0, 10)}</td>
                    <td className=" whitespace-nowrap p-3">
                      {transferTo.value ? `${transferTo.value.toFixed(3)} ETH` : "-"}{" "}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
