import { alchemy, formatAddress, formatTime } from "@/utils/utils";
import type { TransactionResponse } from "alchemy-sdk";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { PiCodeBlock } from "react-icons/pi";
import { formatEther } from "viem";

export default function Transactions() {
  const blockNumber = useSearchParams().get("block");
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
      setTransactions(block.transactions);
    }
    getTransactions();
  }, []);

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const nextPage = () => {
    if ((page + 1) * pageSize < transactions.length) setPage(page + 1);
  };
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td className="px-4 py-2">Tx Hash</td>
            <td className="px-4 py-2">From</td>
            <td className="px-4 py-2">To</td>
            <td className="px-4 py-2">Value</td>
          </tr>
          {transactions.length > 0 &&
            transactions.slice(pageStart, pageEnd).map((transaction, index) => (
              <tr key={index}>
                <td className="whitespace-nowrap px-4 py-2">
                  <PiCodeBlock size={"22px"} className="m-1 opacity-80" />
                  <div>
                    <Link
                      className="m-1 hover:font-semibold hover:text-gray-700"
                      href={`/explorer/transaction/${transaction.hash}`}
                    >
                      {formatAddress(transaction.hash)}
                    </Link>
                    {transaction.timestamp ? (
                      <p className="text-center text-xs opacity-70">{formatTime(transaction.timestamp)}</p>
                    ) : (
                      "-"
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  <Link
                    className="mx-1 whitespace-nowrap hover:font-semibold hover:text-gray-700"
                    href={`/explorer/wallet/${transaction.from}`}
                  >
                    {formatAddress(transaction.from)}
                  </Link>
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
                </td>
                <td className="whitespace-nowrap px-4 py-2">{`${formatEther(BigInt(transaction.value._hex))} ETH`}</td>
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
  );
}
