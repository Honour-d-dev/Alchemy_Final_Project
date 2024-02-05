"use client";
import { PropsWithChildren, createContext, useState, useEffect, useContext, useCallback } from "react";
import { Address } from "viem";
import { EscrowClient, ExcEscrows, OtcEscrows, TlEscrows, createEscrowClient } from "./types";

type TEscrowContext = {
  account?: Address;
  wallet?: EscrowClient;
  otcEscrows: OtcEscrows;
  tlEscrows: TlEscrows;
  excEscrows: ExcEscrows;
  connectWallet: () => Promise<void>;
};

const EscrowContext = createContext({} as TEscrowContext);

export const EscrowProvider = ({ children }: PropsWithChildren) => {
  const [account, setAccount] = useState<Address>();
  const [wallet, setWallet] = useState<EscrowClient>();
  const [otcEscrows, setOtcEscrows] = useState<OtcEscrows>([]);
  const [tlEscrows, setTlEscrows] = useState<TlEscrows>([]);
  const [excEscrows, setExcEscrows] = useState<ExcEscrows>([]);

  const connectWallet = useCallback(async () => {
    console.log("in getAccount");
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const wallet = createEscrowClient(account);

    setAccount(account);
    setWallet(wallet);
  }, []);

  useEffect(() => {
    async function fetchEscrows() {
      if (wallet) {
        const [otcEscrows, tlEscrows, excEscrows] = await wallet.read({ functionName: "getEscrows" });
        setOtcEscrows(otcEscrows);
        setTlEscrows(tlEscrows);
        setExcEscrows(excEscrows);
      } //todo contract listener goes here
    }
    fetchEscrows();
  }, [wallet]);

  return (
    <EscrowContext.Provider
      value={{
        account,
        wallet,
        otcEscrows,
        excEscrows,
        tlEscrows,
        connectWallet,
      }}
    >
      {children}
    </EscrowContext.Provider>
  );
};

export const useEscrow = () => useContext(EscrowContext);
