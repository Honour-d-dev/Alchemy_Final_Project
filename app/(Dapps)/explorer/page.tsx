"use client";
import { Block, TransactionReceipt, Utils } from "alchemy-sdk";
import { alchemy, format, timeFormat } from "@/utils/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PiCubeLight, PiCodeBlock } from "react-icons/pi";

export default function Explorer() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<(TransactionReceipt | null)[]>([]);

  useEffect(() => {
    async function getBlockNumber() {
      const blockNumber = await alchemy.core.getBlockNumber();

      const items = [1, 2, 3, 4, 5, 6];

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
      <div className="m-4 flex flex-grow flex-col overflow-x-auto rounded p-4 shadow">
        <h2 className="border-b border-zinc-400 text-xl">Latest Blocks</h2>
        {blocks &&
          blocks.map((block) => (
            <div className="m-2 flex flex-row justify-between gap-4 border-b border-zinc-300" key={block.number}>
              <div className="flex flex-row">
                <PiCubeLight size={"25px"} className="m-1 opacity-80" />
                <div>
                  <Link className="m-1" href={`/explorer/block/${block.number}`}>
                    {block.number}
                  </Link>
                  <p className="whitespace-nowrap text-center text-xs opacity-70">{timeFormat(block.timestamp)}</p>
                </div>
              </div>
              <div>
                <Link className="m-1 whitespace-nowrap" href={`/explorer/wallet/${block.miner}`}>
                  Miner: {format(block.miner)}
                </Link>
                <p className="text-center text-xs opacity-70">{block.transactions.length} txs in ~12 secs</p>
              </div>
              <div className="m-1 whitespace-nowrap">
                {`${parseFloat(
                  Utils.formatEther(parseInt(block.baseFeePerGas!._hex) * parseInt(block.gasUsed._hex)),
                ).toFixed(3)} ETH`}
              </div>
            </div>
          ))}
      </div>
      <div className="m-4 flex flex-grow flex-col overflow-x-auto rounded p-4 shadow">
        <h2 className="border-b border-zinc-400 text-xl">Latest Transactions</h2>
        {transactions &&
          transactions.map((transaction) => {
            if (transaction === null) return null;
            return (
              <div
                className="m-2 flex flex-row justify-between gap-4 border-b border-zinc-300"
                key={transaction.transactionHash}
              >
                <div className="flex flex-row">
                  <PiCodeBlock size={"22px"} className="m-1 opacity-80" />
                  <div>
                    <Link className="m-1" href={`/explorer/transaction/${transaction.transactionHash}`}>
                      {format(transaction.transactionHash)}
                    </Link>
                    <p className="text-center text-xs opacity-70">{timeFormat(blocks[0].timestamp)}</p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <Link className="mx-1 whitespace-nowrap" href={`/explorer/wallet/${transaction.from}`}>
                    From: {format(transaction.from)}
                  </Link>
                  <Link className="mx-1 whitespace-nowrap" href={`/explorer/wallet/${transaction.to}`}>
                    To: {format(transaction.to)}
                  </Link>
                </div>
                <div className="m-1 whitespace-nowrap">{`${parseFloat(
                  Utils.formatEther(parseInt(transaction.gasUsed._hex) * parseInt(transaction.effectiveGasPrice._hex)),
                ).toFixed(5)} ETH`}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
