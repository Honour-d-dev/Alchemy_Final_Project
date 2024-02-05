"use client";

import Link from "next/link";
import { alchemy, timeFormat } from "@/utils/utils";
import { useEffect, useState } from "react";
import { Utils, Block } from "alchemy-sdk";
import { useParams } from "next/navigation";
import { blockStatus } from "@/utils/utils";

function Block() {
  const { block } = useParams();
  type BlockInfo = {
    status: "finalized" | "safe" | "latest";
  } & Block;
  const [blockInfo, setBlockInfo] = useState<BlockInfo>();

  useEffect(() => {
    async function getBlockInfo() {
      const blockData = Utils.isHexString(block)
        ? await alchemy.core.getBlock(block as string)
        : await alchemy.core.getBlock(parseInt(block as string));

      const finalized = await alchemy.core.getBlock("finalized");
      const status = blockStatus(finalized.number, blockData.number);
      setBlockInfo({ status, ...blockData });
    }

    getBlockInfo();
  }, [block]);

  return (
    <div className="p-4">
      <h2 className="p-4">{`Block: ${block}`}</h2>
      {blockInfo && (
        <table className="rounded p-4 shadow-md">
          <tbody>
            <tr>
              <td className=" p-4">Hash:</td>
              <td className=" p-4">{blockInfo.hash}</td>
            </tr>
            <tr>
              <td className=" p-4">PrevHash:</td>
              <td className=" p-4">
                <Link href={`/explorer/block/${blockInfo.parentHash}`}>{blockInfo.parentHash} </Link>
              </td>
            </tr>
            <tr>
              <td className="p-4">Block Status</td>
              <td className="p-4">{blockInfo.status}</td>
            </tr>
            <tr>
              <td className=" p-4">Gas limit:</td>
              <td className=" p-4">{`${parseInt(blockInfo.gasLimit._hex, 16)} Gas`} </td>
            </tr>
            <tr>
              <td className=" p-4">Gas Used: </td>
              <td className=" p-4">
                {`${parseInt(blockInfo.gasUsed._hex, 16)} Gas`}{" "}
                <meter
                  className="relative left-1 top-[2px] h-5 rounded-sm"
                  low={0.65}
                  high={0.8}
                  optimum={0.5}
                  value={parseInt(blockInfo.gasUsed._hex, 16) / parseInt(blockInfo.gasLimit._hex, 16)}
                />
              </td>
            </tr>
            <tr>
              <td className=" p-4">Transactions:</td>
              <td className=" p-4">{`${blockInfo.transactions.length} transactions`} </td>
            </tr>
            <tr>
              <td className=" p-4">Miner:</td>
              <td className=" p-4">
                <Link href={`/explorer/wallet/${blockInfo.miner}`}>{blockInfo.miner} </Link>
              </td>
            </tr>
            <tr>
              <td className=" p-4">Timestamp:</td>
              <td className=" p-4">{timeFormat(blockInfo.timestamp)} </td>
            </tr>
            <tr>
              <td className=" p-4">Gas Fee:</td>
              <td className=" p-4">{`${Utils.formatUnits(blockInfo.baseFeePerGas!._hex, "gwei").slice(0, 5)} Gwei`}</td>
            </tr>
            <tr>
              <td className=" p-4">Burnt ETH</td>
              <td className=" p-4">{`${Utils.formatEther(
                parseInt(blockInfo.baseFeePerGas!._hex) * parseInt(blockInfo.gasUsed._hex, 16), //cross check
              )} ETH`}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Block;
