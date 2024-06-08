"use client";
import { useEffect, useState } from "react";
import { formatAddress } from "@/utils/utils";
import { alchemy } from "@/utils/server";
import Link from "next/link";
import { AssetTransfersCategory, AssetTransfersWithMetadataResult, SortingOrder } from "alchemy-sdk";
import { useParams } from "next/navigation";
import { RxOpenInNewWindow } from "react-icons/rx";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEther, isAddress, isHex } from "viem";

function Wallet() {
  const { wallet } = useParams();
  const [balance, setBalance] = useState<string>();
  const [transfersFrom, setTransfersFrom] = useState<AssetTransfersWithMetadataResult[]>([]);
  const [transfersTo, setTransfersTo] = useState<AssetTransfersWithMetadataResult[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function getBalance() {
      if (!isHex(wallet) || !isAddress(wallet)) throw new Error("Wallet not found"); //show error page
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
      <div className="flex w-[80%] flex-col self-center  rounded p-2 shadow-md">
        <div className=" p-2">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xl  font-medium">{wallet} </p>
        </div>
        <div className="m-2 flex flex-col">
          <p className="font-medium">Eth Balance</p>
          <p>{balance ? `${formatEther(BigInt(balance))} ETH` : "loading..."}</p>
        </div>
        <div className="m-2 flex flex-col">
          <p className="font-medium">Total Transactions</p>
          <p>{`${count} txns`}</p>
        </div>
        <Link href={`/indexer?search=${wallet}`} className="m-2 flex flex-row">
          view tokens
          <RxOpenInNewWindow className="h-4 w-4 opacity-60" />
        </Link>
      </div>
      <div className="flex flex-col items-center gap-8">
        <h2 className="-mb-8 p-4 text-lg font-medium ">Recent Transactions</h2>
        <div className="w-[95%] overflow-x-auto rounded border border-gray-200 p-2 shadow">
          <h3 className="ml-8 text-lg font-medium ">Out</h3>
          <table className=" w-full p-2">
            <thead>
              <tr className="border-b border-zinc-400">
                <th className="whitespace-nowrap p-3 font-medium">Transaction hash</th>
                <th className="whitespace-nowrap p-3 font-medium">Block Num</th>
                <th className="whitespace-nowrap p-3 font-medium">From</th>
                <th className="whitespace-nowrap p-3 font-medium">To</th>
                <th className="whitespace-nowrap p-3 font-medium">Date</th>
                <th className="whitespace-nowrap p-3 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {transfersFrom.length ? (
                transfersFrom.map((transferFrom) => (
                  <tr className=" border-b border-zinc-300 last:border-none" key={transferFrom.hash}>
                    <td className=" whitespace-nowrap p-3 hover:font-semibold">
                      <Link href={`/explorer/transaction/${transferFrom.hash}`}>
                        {formatAddress(transferFrom.hash)}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap p-3 hover:font-semibold">
                      <Link href={`/explorer/block/${Number(transferFrom.blockNum)}`}>
                        {Number(transferFrom.blockNum)}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap p-3 hover:font-semibold">
                      <Link href={`/explorer/wallet/${transferFrom.from}`}>{formatAddress(transferFrom.from)}</Link>
                    </td>
                    <td className="whitespace-nowrap p-3 hover:font-semibold">
                      <Link href={`/explorer/wallet/${transferFrom.to}`}>
                        {transferFrom.to ? formatAddress(transferFrom.to) : "-"}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap p-3">{transferFrom.metadata.blockTimestamp.slice(0, 10)}</td>
                    <td className=" whitespace-nowrap p-3">
                      {transferFrom.value ? `${transferFrom.value.toFixed(3)} ETH` : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <TableSkeleton />
              )}
            </tbody>
          </table>
        </div>
        <div className="w-[95%] overflow-x-auto rounded border border-gray-200 p-2 shadow">
          <h3 className="ml-8 text-lg font-medium ">In</h3>
          <table className="w-full p-2">
            <thead>
              <tr className="border-b border-zinc-400">
                <th className="whitespace-nowrap p-3 font-medium">Transaction hash</th>
                <th className="whitespace-nowrap p-3 font-medium">Block Num</th>
                <th className="whitespace-nowrap p-3 font-medium">From</th>
                <th className="whitespace-nowrap p-3 font-medium">To</th>
                <th className="whitespace-nowrap p-3 font-medium">Date</th>
                <th className="whitespace-nowrap p-3 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {transfersTo.length ? (
                transfersTo.map((transferTo) => (
                  <tr className=" border-b border-zinc-300 last:border-none" key={transferTo.hash}>
                    <td className=" whitespace-nowrap p-3 hover:font-medium">
                      <Link href={`/explorer/transaction/${transferTo.hash}`}>{formatAddress(transferTo.hash)}</Link>
                    </td>
                    <td className="whitespace-nowrap p-3 hover:font-medium">
                      <Link href={`/explorer/block/${Number(transferTo.blockNum)}`}>{Number(transferTo.blockNum)}</Link>
                    </td>
                    <td className="whitespace-nowrap p-3 hover:font-medium">
                      <Link href={`/explorer/wallet/${transferTo.from}`}>{formatAddress(transferTo.from)}</Link>
                    </td>
                    <td className="whitespace-nowrap p-3 hover:font-medium">
                      <Link href={`/explorer/wallet/${transferTo.to}`}>
                        {transferTo.to ? formatAddress(transferTo.to) : "-"}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap p-3">{transferTo.metadata.blockTimestamp.slice(0, 10)}</td>
                    <td className=" whitespace-nowrap p-3">
                      {transferTo.value ? `${transferTo.value.toFixed(3)} ETH` : "-"}{" "}
                    </td>
                  </tr>
                ))
              ) : (
                <TableSkeleton />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const TableSkeleton = () => {
  return [0, 1, 2, 3, 4, 5].map((i) => {
    return (
      <tr className=" border-b border-zinc-300" key={i}>
        <td className="p-3">
          <Skeleton className="h-4 bg-slate-300" />
        </td>
        <td className="p-3">
          <Skeleton className="h-4 bg-slate-300" />
        </td>
        <td className="p-3">
          <Skeleton className="h-4 bg-slate-300" />
        </td>
        <td className="p-3">
          <Skeleton className="h-4 bg-slate-300" />
        </td>
        <td className="p-3">
          <Skeleton className="h-4 bg-slate-300" />
        </td>
        <td className="p-3">
          <Skeleton className="h-4 bg-slate-300" />
        </td>
      </tr>
    );
  });
};

export default Wallet;
