"use client";
import { alchemy, formatAddress, formatTime } from "@/utils/utils";
import type { Block, BlockWithTransactions, TransactionResponse } from "alchemy-sdk";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { PiCodeBlock } from "react-icons/pi";
import { formatEther } from "viem";

export default function Transactions() {
  const blockNumber = useSearchParams().get("block");
  const [block, setBlock] = useState<BlockWithTransactions>();
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 25;
  const pageStart = page * pageSize;
  const pageEnd = (page + 1) * pageSize < transactions.length ? (page + 1) * pageSize : transactions.length;

  useEffect(() => {
    async function getTransactions() {
      const latestBlock =
        blockNumber && !isNaN(parseInt(blockNumber)) ? parseInt(blockNumber) : await alchemy.core.getBlockNumber();
      const block = await alchemy.core.getBlockWithTransactions(latestBlock);
      setBlock(block);
      setTransactions(block.transactions);
      console.log(block.transactions[0]);
    }
    getTransactions();
  }, []);

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const nextPage = async () => {
    if (Math.floor(transactions.length / pageSize) > page + 1) {
      setPage(page + 1);
    } else {
      const nextBlock = await alchemy.core.getBlockWithTransactions(block!.number - 1);
      setBlock(nextBlock);
      setTransactions([...transactions, ...nextBlock.transactions]);
      setPage(page + 1);
    }
  };
  return (
    <div className="flex w-full items-center justify-center  p-4">
      <div className="flex w-full flex-col items-center justify-center overflow-x-auto rounded-md border border-gray-300 p-4">
        <table className="w-full border-collapse">
          <tbody>
            <tr className=" border-b border-zinc-300 px-2 py-3">
              <td className="px-4 py-2 font-semibold">Tx Hash</td>
              <td className="px-4 py-2 font-semibold">Block</td>
              <td className="px-4 py-2 font-semibold">From</td>
              <td className="px-4 py-2 font-semibold">To</td>
              <td className="px-4 py-2 font-semibold">Value</td>
            </tr>
            {transactions.length > 0 &&
              block &&
              transactions.slice(pageStart, pageEnd).map((transaction, index) => (
                <tr className=" border-b border-zinc-300 px-2 py-3" key={index}>
                  <td className="flex flex-row whitespace-nowrap px-4 py-2">
                    <PiCodeBlock size={"22px"} className="m-1 opacity-80" />
                    <div className="flex flex-col">
                      <Link
                        className="m-1 hover:font-semibold hover:text-gray-700"
                        href={`/explorer/transaction/${transaction.hash}`}
                      >
                        {formatAddress(transaction.hash)}
                      </Link>
                      <p className="text-center text-xs opacity-70">
                        {formatTime(transaction.blockNumber! > block.number ? block.timestamp + 12 : block.timestamp)}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">{transaction.blockNumber}</td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <Link
                      className="mx-1 whitespace-nowrap hover:font-semibold hover:text-gray-700"
                      href={`/explorer/wallet/${transaction.from}`}
                    >
                      {formatAddress(transaction.from)}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    {transaction.to ? (
                      <Link
                        className="mx-1 whitespace-nowrap hover:font-semibold hover:text-gray-700"
                        href={`/explorer/wallet/${transaction.to}`}
                      >
                        {formatAddress(transaction.to)}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">{`${formatEther(BigInt(transaction.value._hex)).slice(
                    0,
                    5,
                  )} ETH`}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="sticky left-0 flex w-full flex-row items-center justify-center gap-2 p-4">
          <button
            className="bg-white p-2 text-center"
            onClick={(e) => {
              e.preventDefault();
              prevPage();
            }}
            disabled={page === 0}
          >
            <IoIosArrowBack />
          </button>
          {page + 1}
          <button
            className="bg-white p-2 text-center"
            onClick={(e) => {
              e.preventDefault();
              nextPage();
            }}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
}
