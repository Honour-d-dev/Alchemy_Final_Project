"use client";
import { alchemy, formatAddress, formatTime, range } from "@/utils/utils";
import type { Block } from "alchemy-sdk";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { PiCubeLight } from "react-icons/pi";
import { formatEther, formatGwei } from "viem";

export default function Blocks() {
  const [latestBlock, setLatestBlock] = useState(0);
  const [blocks, setBlocks] = useState<Block[][]>([]);
  const [blockPage, setBlockPage] = useState(0);
  const requesting = useRef(false);
  const pageSize = 25;

  useEffect(() => {
    async function getBlockNumber() {
      const blockNumber = await alchemy.core.getBlockNumber();

      const blockData = await Promise.all(range(0, pageSize).map((i) => alchemy.core.getBlock(blockNumber - i)));

      setBlocks([blockData]);
      setLatestBlock(blockNumber);
    }

    getBlockNumber();
  }, []);

  const nextPage = async () => {
    if (requesting.current) return;
    requesting.current = true;
    const startingBlock = latestBlock - pageSize * (blockPage + 1);
    const blockData = await Promise.all(range(0, pageSize).map((i) => alchemy.core.getBlock(startingBlock - i)));
    setBlocks([...blocks, blockData]);
    setBlockPage((p) => p + 1);
    requesting.current = false;
  };

  const prevPage = async () => {
    setBlockPage((p) => p - 1);
  };

  return (
    <div className="flex max-w-full">
      <div className=" flex flex-col overflow-x-auto">
        <table className="border-collapse">
          <tbody>
            <tr className=" border-b border-zinc-300 py-3">
              <td className="px-4">Block</td>
              <td className="px-4">Miner</td>
              <td className="px-4">Gas Used</td>
              <td className="px-4">Gas Fee</td>
              <td className="px-4">Burnt ETH</td>
            </tr>
            {blocks[blockPage] &&
              blocks[blockPage].length > 0 &&
              blocks[blockPage].map((block) => (
                <tr className="border-b border-zinc-300 py-3" key={block.number}>
                  <td className="flex flex-row px-4 py-2">
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
                  <td className="px-4 py-2">
                    <Link
                      className="m-1 whitespace-nowrap hover:font-semibold hover:text-gray-700"
                      href={`/explorer/wallet/${block.miner}`}
                    >
                      Miner: {formatAddress(block.miner)}
                    </Link>
                    <p className="text-center text-xs text-gray-500">{block.transactions.length} txs in ~12 secs</p>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col whitespace-nowrap">
                      {`${BigInt(block.gasUsed._hex).toLocaleString()} (${(
                        (parseInt(block.gasUsed._hex) / parseInt(block.gasLimit._hex)) *
                        100
                      ).toFixed(2)}%)`}
                      <meter
                        className="h-2 w-full"
                        low={0.65}
                        high={0.8}
                        optimum={0.5}
                        value={parseInt(block.gasUsed._hex) / parseInt(block.gasLimit._hex)}
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">{`${formatGwei(BigInt(block.baseFeePerGas!._hex)).slice(
                    0,
                    5,
                  )} Gwei`}</td>
                  <td className="whitespace-nowrap px-4 py-2">
                    {`${parseFloat(formatEther(BigInt(block.baseFeePerGas!._hex) * BigInt(block.gasUsed._hex))).toFixed(
                      3,
                    )} ETH`}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="sticky left-0 flex w-screen flex-row items-center justify-center gap-2">
          <button
            className="bg-white p-2 text-center"
            onClick={(e) => {
              e.preventDefault();
              prevPage();
            }}
            disabled={blockPage === 0}
          >
            <IoIosArrowBack />
          </button>
          {blockPage + 1}
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
