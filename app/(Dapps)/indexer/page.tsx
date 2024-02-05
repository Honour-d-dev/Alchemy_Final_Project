"use client";
import { GetTokensForOwnerResponse, NftFilters, OwnedNftsResponse, TokenBalanceType, Utils } from "alchemy-sdk";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { BiErrorAlt } from "react-icons/bi";
import { Tab } from "@headlessui/react";
import { alchemy, format } from "@/utils/utils";
import { useSearchParams, useRouter } from "next/navigation";
import spinner from "../../../public/Spinner.svg";
import etherLogo from "../../../public/ethereum-original.svg";
import Image from "next/image";
import Tokens from "./token";
import Nfts from "./nft";
import Navigate from "./navigate";

export default function indexer() {
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [nftData, setNftData] = useState<OwnedNftsResponse>();
  const [tokenData, setTokenData] = useState<GetTokensForOwnerResponse>();
  const [queryState, setQueryState] = useState(false);
  const [showError, setShowError] = useState(false);

  const searchParam = useSearchParams().get("search");
  const router = useRouter();
  //page hanlers
  const tokenPageNum = useRef(0);
  const tokenPages = useRef<GetTokensForOwnerResponse[]>([]);
  const nftPageNum = useRef(0);
  const nftPages = useRef<OwnedNftsResponse[]>([]);
  const inRequest = useRef(false);

  const search = useCallback(async (address: string) => {
    setQueryState(true);
    try {
      setUserAddress(address);
      const balance = await alchemy.core.getBalance(address);
      const tokenData = await alchemy.core.getTokensForOwner(address);
      const nftData = await alchemy.nft.getNftsForOwner(address, {
        excludeFilters: [NftFilters.SPAM],
        pageSize: 60,
      });

      setBalance(balance._hex);
      setNftData(nftData);
      setTokenData(tokenData);
      setShowError(false);
      nftPages.current.push(nftData);
      tokenPages.current.push(tokenData);
      setQueryState(false);
    } catch (error) {
      setQueryState(false);
      setUserAddress("");
      setShowError(true);
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (searchParam) {
      search(searchParam);
    }
  }, [searchParam]);

  const getNextTokenPage = async () => {
    if (!inRequest.current) {
      if (tokenData?.pageKey && tokenPageNum.current === tokenPages.current.length - 1) {
        inRequest.current = true;
        const data = await alchemy.core.getTokensForOwner(userAddress, {
          contractAddresses: TokenBalanceType.ERC20,
          pageKey: tokenData.pageKey,
        });
        tokenPages.current.push(data);
        inRequest.current = false;
      }
      tokenPageNum.current += 1;
      setTokenData(tokenPages.current[tokenPageNum.current]);
    }
  };

  const getPrevTokenPage = () => {
    tokenPageNum.current -= 1;
    setTokenData(tokenPages.current[tokenPageNum.current]);
  };

  const getNextNftpage = async () => {
    if (!inRequest.current && nftData) {
      if (nftData.pageKey && nftPageNum.current === nftPages.current.length - 1) {
        inRequest.current = true;
        const data = await alchemy.nft.getNftsForOwner(userAddress, {
          pageKey: nftData.pageKey,
          pageSize: 60,
          excludeFilters: [NftFilters.SPAM],
        });
        nftPages.current.push(data);
        inRequest.current = false;
      }
      nftPageNum.current += 1;
      setNftData(nftPages.current[nftPageNum.current]);
    }
  };

  const getPrevNftpage = () => {
    nftPageNum.current -= 1;
    setNftData(nftPages.current[nftPageNum.current]);
  };

  const getAccount = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    document.getElementById("connect_button")!.innerText = format(account);
    search(account);
  };

  const getSearchAddress = () => {
    const address = (document.getElementById("input") as HTMLInputElement).value;
    router.push(`/indexer?search=${address}`);
  };

  return (
    <div className="flex flex-col justify-start self-start">
      <div className="fixed left-0 right-0 top-0 z-10 h-20 w-screen bg-primary blur-[1px]"></div>
      <h1 className="sticky top-5 z-20 mb-10 text-center text-3xl font-medium md:text-4xl md:font-semibold">
        Token Indexer Dapp{" "}
      </h1>
      <button
        id="connect_button"
        className="fixed right-2 top-4 z-20 m-1 rounded-md bg-zinc-300 p-2"
        onClick={(e) => {
          e.preventDefault();
          getAccount();
        }}
      >
        <FaWallet size={"1.5rem"} className="inline" />
        <span className="ml-1 hidden md:inline">Connect</span>
      </button>
      <div className="relative m-auto mt-6 flex min-w-[300px] max-w-[500px] rounded-md bg-white p-1 focus-within:outline focus-within:outline-zinc-200">
        <input
          id="input"
          type="text"
          className="m-1 flex flex-grow px-1 placeholder:text-center placeholder:font-[cursive] focus-visible:outline-none"
          placeholder="Enter an address to search"
        />
        <button
          className=" m-auto rounded-md bg-zinc-200 p-2"
          onClick={(e) => {
            e.preventDefault();
            getSearchAddress();
          }}
        >
          <FiSearch />
        </button>
      </div>
      {showError && !queryState && (
        <div className="m-4 flex flex-row items-center justify-center gap-1 bg-red-300 p-4">
          <BiErrorAlt size={"1.5rem"} />
          Oops!!! Something went wrong
        </div>
      )}
      {queryState && <Image className="m-auto h-20 w-20" src={spinner} alt="loading image" priority={true} />}
      {nftData && tokenData && !queryState && (
        <div className="flex flex-col items-center pt-3">
          <div className="m-6 flex w-5/6 flex-col rounded-md bg-primary shadow">
            <div className="flex flex-col p-4">
              <p>ADDRESS:</p>
              <div>{userAddress}</div>
            </div>
            <div className="flex flex-col p-4">
              <div>ETH BALANCE</div>
              <div className="flex flex-row items-center">
                <Image src={etherLogo} alt="ether-logo" className="m-1 h-6 w-4" />
                <p>{Utils.formatEther(balance)} ETH</p>
              </div>
            </div>
          </div>

          <Tab.Group>
            <Tab.List className={"m-auto flex w-3/4 min-w-[100px] rounded-md border border-zinc-400"}>
              <Tab className=" flex flex-grow justify-center rounded-md p-2 focus-visible:outline-none ui-selected:bg-primary">
                Tokens
              </Tab>
              <Tab className=" flex flex-grow justify-center rounded-md p-2 focus-visible:outline-none ui-selected:bg-primary">
                NFTs
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel
                className={
                  "mt-1 flex w-[95vw] flex-col items-center justify-center gap-1 rounded-lg bg-primary md:w-[80vw]"
                }
              >
                <Tokens tokenData={tokenData} />
                <Navigate
                  prevPage={getPrevTokenPage}
                  nextPage={getNextTokenPage}
                  pageNum={tokenPageNum}
                  end={!tokenData.pageKey ? true : false}
                />
              </Tab.Panel>
              <Tab.Panel
                className={"mt-1 flex w-[95vw] flex-col items-center justify-center rounded-lg bg-primary md:w-[80vw]"}
              >
                <Nfts nftData={nftData} />
                <Navigate
                  prevPage={getPrevNftpage}
                  nextPage={getNextNftpage}
                  pageNum={nftPageNum}
                  end={!nftData.pageKey ? true : false}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}
    </div>
  );
}
