"use client";
import type { Block, TransactionReceipt } from "alchemy-sdk";
import { alchemy, formatAddress, formatTime } from "@/utils/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PiCubeLight, PiCodeBlock } from "react-icons/pi";
import { formatEther } from "viem";
import { IoIosArrowRoundForward } from "react-icons/io";

export default function Explorer() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<(TransactionReceipt | null)[]>([]);

  useEffect(() => {
    async function getBlockNumber() {
      const blockNumber = await alchemy.core.getBlockNumber();

      const items = [1, 2, 3, 4, 5, 6, 7];

      const blockData = await Promise.all(items.map((i) => alchemy.core.getBlock(blockNumber - i)));

      const length = blockData[0].transactions.length;

      const transactionData = await Promise.all(
        items.map((i) => alchemy.core.getTransactionReceipt(blockData[0].transactions[length - i])),
      );

      setBlocks(blockData);
      setTransactions(transactionData);
    }

    getBlockNumber();
  }, []);

  return (
    <div className="m-4 flex w-full flex-col  justify-center lg:flex-row">
      <div className="m-4 flex flex-grow flex-col overflow-x-auto rounded border border-gray-200 bg-white p-4 shadow">
        <h2 className="border-b border-zinc-400 text-xl">Latest Blocks</h2>
        <table>
          <tbody>
            {blocks &&
              blocks.map((block) => (
                <tr className=" flex flex-row justify-between gap-4 border-b border-zinc-300 py-3" key={block.number}>
                  <td className="flex flex-row">
                    <PiCubeLight size={"25px"} className="m-1 size-6 text-gray-600" />
                    <div>
                      <Link
                        className="m-1 hover:font-semibold hover:text-gray-700"
                        href={`/explorer/block/${block.number}`}
                      >
                        {block.number}
                      </Link>
                      <p className="whitespace-nowrap text-center text-xs text-gray-500">
                        {formatTime(block.timestamp)}
                      </p>
                    </div>
                  </td>
                  <td>
                    <Link
                      className="m-1 whitespace-nowrap hover:font-semibold hover:text-gray-700"
                      href={`/explorer/wallet/${block.miner}`}
                    >
                      Miner: {formatAddress(block.miner)}
                    </Link>
                    <p className="text-center text-xs text-gray-500">{block.transactions.length} txs in ~12 secs</p>
                  </td>
                  <td className="m-1 whitespace-nowrap">
                    {`${parseFloat(formatEther(BigInt(block.baseFeePerGas!._hex) * BigInt(block.gasUsed._hex))).toFixed(
                      3,
                    )} ETH`}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Link
          className="flex w-full flex-row items-center justify-center gap-1 py-2 text-center"
          href="/explorer/blocks"
        >
          View All Blocks <IoIosArrowRoundForward className="h-6 w-6" />
        </Link>
      </div>
      <div className="m-4 flex flex-grow flex-col overflow-x-auto rounded border border-gray-200 bg-white p-4 shadow">
        <h2 className="border-b border-zinc-400 text-xl">Latest Transactions</h2>
        <table>
          <tbody>
            {transactions &&
              transactions.map((transaction) => {
                if (transaction === null) return null;
                return (
                  <tr
                    className="flex flex-row justify-between gap-4 border-b border-zinc-300 py-3"
                    key={transaction.transactionHash}
                  >
                    <td className="flex flex-row">
                      <PiCodeBlock size={"22px"} className="m-1 opacity-80" />
                      <div>
                        <Link
                          className="m-1 hover:font-semibold hover:text-gray-700"
                          href={`/explorer/transaction/${transaction.transactionHash}`}
                        >
                          {formatAddress(transaction.transactionHash)}
                        </Link>
                        <p className="text-center text-xs opacity-70">{formatTime(blocks[0].timestamp)}</p>
                      </div>
                    </td>
                    <td className="flex flex-col">
                      <Link
                        className="mx-1 whitespace-nowrap hover:font-semibold hover:text-gray-700"
                        href={`/explorer/wallet/${transaction.from}`}
                      >
                        From: {formatAddress(transaction.from)}
                      </Link>
                      <Link
                        className="mx-1 whitespace-nowrap hover:font-semibold hover:text-gray-700"
                        href={`/explorer/wallet/${transaction.to}`}
                      >
                        To: {formatAddress(transaction.to)}
                      </Link>
                    </td>
                    <td className="m-1 whitespace-nowrap">{`${parseFloat(
                      formatEther(BigInt(transaction.gasUsed._hex) * BigInt(transaction.effectiveGasPrice._hex)),
                    ).toFixed(5)} ETH`}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <Link
          className="flex w-full flex-row items-center justify-center gap-1 py-2 text-center"
          href="/explorer/transactions"
        >
          View All Transactions <IoIosArrowRoundForward className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}
