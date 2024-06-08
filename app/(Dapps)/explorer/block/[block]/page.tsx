"use client";
import Link from "next/link";
import { alchemy, formatTime } from "@/utils/utils";
import { useEffect, useState } from "react";
import type { Block } from "alchemy-sdk";
import { useParams } from "next/navigation";
import { blockStatus } from "@/utils/utils";
import { formatEther, formatGwei, isHex } from "viem";
import { RxOpenInNewWindow } from "react-icons/rx";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Progress } from "@/components/ui/progress";

function Block() {
  const { block } = useParams();
  type BlockInfo = {
    status: "finalized" | "safe" | "latest";
  } & Block;
  const [blockInfo, setBlockInfo] = useState<BlockInfo>();

  useEffect(() => {
    async function getBlockInfo() {
      const blockData = isHex(block)
        ? await alchemy.core.getBlock(block)
        : await alchemy.core.getBlock(parseInt(block as string));
      //todo if block doesnt exist route to error page
      const finalized = await alchemy.core.getBlock("finalized");
      const status = blockStatus(finalized.number, blockData.number);
      setBlockInfo({ status, ...blockData });
    }

    getBlockInfo();
  }, [block]);

  return (
    <div className="p-4">
      <div className="flex w-full flex-row items-center justify-center gap-2">
        <Link href={`/explorer/block/${parseInt(block as string) - 1}`}>
          <IoIosArrowBack />
        </Link>
        <h2 className="p-4 font-semibold">{`Block: ${block}`}</h2>
        <Link href={`/explorer/block/${parseInt(block as string) + 1}`}>
          <IoIosArrowForward />
        </Link>
      </div>
      {blockInfo && (
        <table className="rounded p-4 shadow-md">
          <tbody>
            <tr className="border-b border-gray-300 p-2">
              <td className=" p-4 font-semibold">Hash:</td>
              <td className=" p-4">{blockInfo.hash}</td>
            </tr>
            <tr className="border-b border-gray-300 p-2">
              <td className="p-4 font-semibold">Block Status</td>
              <td className="p-4">{blockInfo.status}</td>
            </tr>
            <tr className="border-b border-gray-300 p-2">
              <td className=" p-4 font-semibold">Gas limit:</td>
              <td className=" p-4">{`${BigInt(blockInfo.gasLimit._hex).toLocaleString()} Gas`} </td>
            </tr>
            <tr className="border-b border-gray-300 p-2">
              <td className=" p-4 font-semibold">Gas Used: </td>
              <td className="p-4">
                <div className="flex flex-row items-center">
                  {`${BigInt(blockInfo.gasUsed._hex).toLocaleString()}`}{" "}
                  <span className="flex flex-col items-center justify-center font-medium">
                    {`${((parseInt(blockInfo.gasUsed._hex) / parseInt(blockInfo.gasLimit._hex)) * 100).toFixed(2)}%`}
                    <meter
                      className="relative left-1 top-[1px] h-2 px-2"
                      low={0.65}
                      high={0.8}
                      optimum={0.5}
                      value={parseInt(blockInfo.gasUsed._hex) / parseInt(blockInfo.gasLimit._hex)}
                    />
                  </span>
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-300 p-2">
              <td className=" p-4 font-semibold">Transactions:</td>
              <td className=" p-4">
                <Link
                  className="flex flex-row items-center gap-2"
                  href={`/explorer/transactions?block=${blockInfo.number}`}
                >
                  {`${blockInfo.transactions.length} transactions`} <RxOpenInNewWindow className="hover:scale-110" />
                </Link>{" "}
              </td>
            </tr>
            <tr className="border-b border-gray-300 p-2">
              <td className=" p-4 font-semibold">Miner:</td>
              <td className=" p-4">
                <Link href={`/explorer/wallet/${blockInfo.miner}`}>{blockInfo.miner} </Link>
              </td>
            </tr>
            <tr className="border-b border-gray-300 p-2">
              <td className=" p-4 font-semibold">Timestamp:</td>
              <td className=" p-4">{formatTime(blockInfo.timestamp)} </td>
            </tr>
            <tr className="border-b border-gray-300 p-2">
              <td className=" p-4 font-semibold">Gas Fee:</td>
              <td className=" p-4">{`${formatGwei(BigInt(blockInfo.baseFeePerGas!._hex)).slice(0, 5)} Gwei`}</td>
            </tr>
            <tr className="border-b border-gray-300 p-2">
              <td className=" p-4 font-semibold">Burnt ETH</td>
              <td className=" p-4">{`${formatEther(
                BigInt(blockInfo.baseFeePerGas!._hex) * BigInt(blockInfo.gasUsed._hex),
              )} ETH`}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Block;
