"use client";
import { PropsWithChildren, createContext, useState, useEffect, useContext, useCallback } from "react";
import { Address } from "viem";
import { EscrowClient, ExcEscrows, OtcEscrows, TlEscrows, createEscrowClient } from "./types";
import { toast } from "sonner";

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
    if (!wallet) {
      toast.info("connect your wallet to view escrows", { duration: 3000 });
      return;
    }
    const fetchEscrows = async () => {
      const [otcEscrows, tlEscrows, excEscrows] = await wallet.read({ functionName: "getEscrows" });
      setOtcEscrows(otcEscrows);
      setTlEscrows(tlEscrows);
      setExcEscrows(excEscrows);
    };
    fetchEscrows();

    const unwatchExc = wallet.watch({
      eventName: "ExcCreated",
      onLogs: async () => {
        setExcEscrows(await wallet.read({ functionName: "getExcEscrows" }));
      },
    });

    const unwatchOtc = wallet.watch({
      eventName: "OTCCreated",
      onLogs: async () => {
        setOtcEscrows(await wallet.read({ functionName: "getOTCEscrows" }));
      },
    });

    const unwatchTl = wallet.watch({
      eventName: "TLCreated",
      onLogs: async () => {
        setTlEscrows(await wallet.read({ functionName: "getTLEscrow" }));
      },
    });

    window.ethereum.on("accountsChanged", () => connectWallet());

    return () => {
      unwatchExc();
      unwatchOtc();
      unwatchTl();
      window.ethereum.removeListener("accountsChanged", () => connectWallet());
    };
  }, [wallet, connectWallet]);

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
