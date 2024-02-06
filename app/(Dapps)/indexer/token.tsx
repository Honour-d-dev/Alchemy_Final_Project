import tokenImage from "../../../public/money395.svg";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import { BsChevronUp } from "react-icons/bs";
import type { GetTokensForOwnerResponse } from "alchemy-sdk";
//import { FormatBalance } from "@/utils/utils";

function Tokens({ tokenData }: { tokenData: GetTokensForOwnerResponse }) {
  return window.innerWidth < 500 ? <SmallView tokenData={tokenData} /> : <LargeView tokenData={tokenData} />;
}

const LargeView = ({ tokenData }: { tokenData: GetTokensForOwnerResponse }) => {
  return (
    <table className=" w-[95%] md:m-auto md:w-[90%]">
      <tbody>
        {tokenData.tokens.map((token, i) => {
          if (!token.symbol) token.symbol = "N/A";
          if (!token.name) token.name = "N/A";
          return (
            <tr className="border-b border-zinc-300" key={token.contractAddress}>
              <td className="p-2 md:p-4">
                <div className=" flex flex-row gap-1">
                  <Image
                    src={token.logo || tokenImage}
                    width={"30"}
                    height={"30"}
                    alt="token image"
                    className="aspect-square h-7 w-7"
                  />
                  <div className="flex flex-row">
                    {` ${token.name} ($${token.symbol.length > 10 ? "" : token.symbol})`}
                  </div>
                </div>
              </td>
              <td className=" p-4 text-right">
                <FormatBalance balance={token.balance ? token.balance : token.rawBalance!} />
                {` ${token.symbol.length > token.name?.length ? token.name : token.symbol}`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const SmallView = ({ tokenData }: { tokenData: GetTokensForOwnerResponse }) => {
  return (
    <table className=" w-[95%] md:m-auto md:w-[90%]">
      <tbody>
        {tokenData.tokens.map((token, i) => {
          if (!token.symbol) token.symbol = "N/A";
          if (!token.name) token.name = "N/A";
          return (
            <tr className="border-b border-zinc-300" key={token.contractAddress}>
              <td className="p-2">
                <Disclosure>
                  <Disclosure.Button className=" flex w-full flex-row gap-1">
                    <Image
                      src={token.logo || tokenImage}
                      width={"30"}
                      height={"30"}
                      alt="token image"
                      className="aspect-square h-7 w-7"
                    />
                    <div className="flex flex-row text-left">
                      {` ${token.name} ($${token.symbol?.length > 10 ? "" : token.symbol})`}
                    </div>
                    <span className="flex grow" />
                    <BsChevronUp className="self-center ui-open:rotate-180 ui-open:transform" />
                  </Disclosure.Button>
                  <Disclosure.Panel className="text-right text-sm opacity-75">
                    <FormatBalance balance={token.balance ? token.balance : token.rawBalance!} />
                    {` ${token.symbol.length > token.name?.length ? token.name : token.symbol}`}
                  </Disclosure.Panel>
                </Disclosure>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// TODO cross check
const FormatBalance = ({ balance }: { balance: string }) => {
  if (balance.length < 19) {
    return <>{balance}</>;
  }
  const digits = balance.split(".");
  if (digits[0].length >= 9) {
    let whole = `${digits[0].slice(0, 1)}.${digits[0].slice(1, 3)}`;
    let i = digits[0].length - 1;
    return (
      <>
        {`${whole}ⅹ10`}
        <span className="relative bottom-1 text-xs">{i}</span>
      </>
    );
  }
  return <>{`${digits[0]}.${digits[1].slice(0, 18)}`}</>;
};

export default Tokens;
