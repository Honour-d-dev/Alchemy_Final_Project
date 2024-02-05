"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { alchemy, timeFormat } from "@/utils/utils";
import { Utils, TransactionReceipt, TransactionResponse } from "alchemy-sdk";
import { useParams } from "next/navigation";

function Transaction() {
  const { transactionHash } = useParams();
  const [transactionInfo, setTransactionInfo] = useState<{ time: number } & TransactionResponse>();
  const [transactionReceipt, setTransactionReceipt] = useState<TransactionReceipt>();

  useEffect(() => {
    async function getTransactionInfo() {
      const transactionInfo = await alchemy.transact.getTransaction(transactionHash as string);
      const transactionReceipt = await alchemy.core.getTransactionReceipt(transactionHash as string);
      if (!transactionInfo || !transactionReceipt) throw new Error("Transaction not found"); //todo route to error page
      const time = (await alchemy.core.getBlock(transactionInfo.blockNumber!)).timestamp;

      setTransactionInfo({ time, ...transactionInfo });
      setTransactionReceipt(transactionReceipt);
    }

    getTransactionInfo();
  }, [transactionHash]);

  return (
    <div className=" p-4">
      <h1 className=" p-4">Transaction Details</h1>
      {transactionInfo && transactionReceipt && (
        <table className=" rounded p-6 shadow-md">
          <tbody>
            <tr>
              <td className=" p-4">Transaction Hash:</td>
              <td className=" p-4">{transactionInfo.hash} </td>
            </tr>
            <tr>
              <td className=" p-4">Block Number:</td>
              <td className=" p-4">
                <Link href={`/explorer/block/${transactionInfo.blockNumber}`}>{transactionInfo.blockNumber} </Link>
              </td>
            </tr>
            <tr>
              <td className=" p-4">Status</td>
              <td className=" p-4">
                {transactionReceipt.status == 0
                  ? "failed"
                  : ` success  ${transactionReceipt.confirmations} confirmations`}
              </td>
            </tr>
            <tr>
              <td className=" p-4">From:</td>
              <td className=" p-4">
                <Link href={`/explorer/wallet/${transactionInfo.from}`}>{transactionInfo.from} </Link>
              </td>
            </tr>
            <tr>
              <td className=" p-4">To:</td>
              <td className=" p-4">
                <Link href={`/explorer/wallet/${transactionInfo.to}`}>{transactionInfo.to} </Link>
              </td>
            </tr>
            <tr>
              <td className=" p-4">Amount:</td>
              <td className=" p-4">{`${Utils.formatEther(transactionInfo.value._hex)} ETH`} </td>
            </tr>
            <tr>
              <td className=" p-4">Gas Price:</td>
              <td className=" p-4"> {`${Utils.formatUnits(transactionInfo.gasPrice ?? 0, "gwei")} Gwei`}</td>
            </tr>
            <tr>
              <td className=" p-4">Gas used:</td>
              <td className=" p-4">{`${parseInt(transactionReceipt.gasUsed._hex, 16)} Gas`}</td>
            </tr>
            <tr>
              <td className=" p-4">Fee:</td>
              <td className=" p-4">{`${Utils.formatEther(
                parseInt(transactionInfo.gasPrice!._hex) * parseInt(transactionReceipt.gasUsed._hex, 16), //cross check
              )} ETH`}</td>
            </tr>
            <tr>
              <td className=" p-4">Timestamp:</td>
              <td className=" p-4"> {timeFormat(transactionInfo.time)} </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Transaction;
