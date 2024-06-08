"use client";

import { Address, formatEther, formatUnits, zeroAddress } from "viem";
import { useEscrow } from "./utils/useEscrow";
import { useEffect, useMemo, useState } from "react";
import { EscrowType } from "./utils/types";

export default function Escrow() {
  const { excEscrows, tlEscrows, otcEscrows } = useEscrow();
  const [loadedEscrow, setLoadedEscrow] = useState<{ type: EscrowType; index: number }>();
  const escrowsAvailable = excEscrows.length > 0 || tlEscrows.length > 0 || otcEscrows.length > 0;

  return (
    <div>
      {loadedEscrow ? (
        loadedEscrow.type === "exchange" ? (
          <LoadExc index={loadedEscrow.index} />
        ) : loadedEscrow.type === "timelock" ? (
          <LoadTl index={loadedEscrow.index} />
        ) : (
          <LoadOtc index={loadedEscrow.index} />
        )
      ) : null}
      {escrowsAvailable && (
        <div className="flex flex-col rounded-lg p-5 shadow-md">
          {excEscrows.map((escrow, index) => {
            return (
              <div key={escrow.counter} onClick={() => setLoadedEscrow({ type: "exchange", index })}>
                <span>Reciepient {escrow.beneficiary}</span>
                <span>Depositor {escrow.depositor}</span>
              </div>
            );
          })}
          {tlEscrows.map((escrow, index) => {
            return (
              <div key={escrow.counter} onClick={() => setLoadedEscrow({ type: "timelock", index })}>
                <span>Reciepient {escrow.beneficiary}</span>
                <span>Depositor {escrow.depositor}</span>
              </div>
            );
          })}
          {otcEscrows.map((escrow, index) => {
            return (
              <div key={escrow.counter} onClick={() => setLoadedEscrow({ type: "otc", index })}>
                <span>Reciepient {escrow.beneficiary}</span>
                <span>Depositor {escrow.depositor}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const LoadExc = ({ index }: { index: number }) => {
  const { wallet, excEscrows } = useEscrow();
  const escrow = useMemo(() => excEscrows[index], [excEscrows, index]);
  const [dToken, setDToken] = useState({ amount: "", symbol: "" });
  const [bToken, setBToken] = useState({ amount: "", symbol: "" });

  useEffect(() => {
    const fetchTokenData = async () => {
      if (escrow.dToken !== zeroAddress) {
        setDToken({
          amount: formatUnits(escrow.dAmount, await wallet!.tokenDecimals(escrow.dToken)),
          symbol: await wallet!.tokenSymbol(escrow.dToken),
        });
      } else {
        setDToken({ amount: formatEther(escrow.dAmount), symbol: "ETH" });
      }

      if (escrow.bToken !== zeroAddress) {
        setBToken({
          amount: formatUnits(escrow.bAmount, await wallet!.tokenDecimals(escrow.bToken)),
          symbol: await wallet!.tokenSymbol(escrow.bToken),
        });
      } else {
        setBToken({ amount: formatEther(escrow.bAmount), symbol: "ETH" });
      }
    };
    fetchTokenData();
  }, [escrow]);

  const claim = async () => {
    if (wallet) {
      if (escrow.bToken !== zeroAddress) await wallet.approveToken(escrow.bToken, escrow.bAmount);
      await wallet.write({ functionName: "claimExc", args: [BigInt(index)] });
    }
  };

  const cancel = async () => {
    if (wallet) await wallet.write({ functionName: "cancelExc", args: [BigInt(index)] });
  };
  return (
    <div>
      <div>Depositor {escrow.depositor}</div>
      <div>Recipient {escrow.beneficiary ?? "open"}</div>
      <div>Deposited Token {escrow.dToken}</div>
      <div>Amount {`${dToken.amount} ${dToken.symbol}`}</div>
      <div>Recipient Token {escrow.bToken}</div>
      <div>Amount {`${bToken.amount} ${bToken.symbol}`}</div>
      <div>
        <button onClick={claim}>claim</button>
        <button onClick={cancel}>cancel</button>
      </div>
    </div>
  );
};

const LoadTl = ({ index }: { index: number }) => {
  const { wallet, tlEscrows } = useEscrow();
  const escrow = useMemo(() => tlEscrows[index], [tlEscrows, index]);
  const [token, setToken] = useState({ amount: "", symbol: "" });

  useEffect(() => {
    const fetchTokenData = async () => {
      if (escrow.token !== zeroAddress) {
        setToken({
          amount: formatUnits(escrow.amount, await wallet!.tokenDecimals(escrow.token)),
          symbol: await wallet!.tokenSymbol(escrow.token),
        });
      } else {
        setToken({ amount: formatEther(escrow.amount), symbol: "ETH" });
      }
    };
    fetchTokenData();
  }, [escrow]);
  const claim = async () => {
    if (wallet) await wallet.write({ functionName: "claimTL", args: [BigInt(index)] });
  };

  return (
    <div>
      <div>Depositor {escrow.depositor}</div>
      <div>Reciepient {escrow.beneficiary}</div>
      <div>Token {escrow.token}</div>
      <div>Amount {`${token.amount} ${token.symbol}`}</div>
      <div>Timeleft {escrow.timeLock.toString()}</div>
      <div>
        <button onClick={claim}>claim</button>
      </div>
    </div>
  );
};

const LoadOtc = ({ index }: { index: number }) => {
  const { wallet, otcEscrows } = useEscrow();
  const escrow = useMemo(() => otcEscrows[index], [otcEscrows, index]);
  const [token, setToken] = useState({ amount: "", symbol: "" });

  useEffect(() => {
    const fetchTokenData = async () => {
      if (escrow.token !== zeroAddress) {
        setToken({
          amount: formatUnits(escrow.amount, await wallet!.tokenDecimals(escrow.token)),
          symbol: await wallet!.tokenSymbol(escrow.token),
        });
      } else {
        setToken({ amount: formatEther(escrow.amount), symbol: "ETH" });
      }
    };
    fetchTokenData();
  }, [escrow]);

  const claim = async () => {
    if (wallet) await wallet.write({ functionName: "claimOTC", args: [BigInt(index)] });
  };

  const dispute = async () => {
    if (wallet) await wallet.write({ functionName: "disputeOTC", args: [BigInt(index)] });
  };

  const approve = async () => {
    if (wallet) await wallet.write({ functionName: "approveDisputeOTC", args: [BigInt(index)] });
  };

  const release = async () => {
    if (wallet) await wallet.write({ functionName: "releaseOTC", args: [BigInt(index)] });
  };

  return (
    <div>
      <div>Depositor {escrow.depositor}</div>
      <div>Reciepient {escrow.beneficiary}</div>
      <div>Token {escrow.token}</div>
      <div>Amount {`${token.amount} ${token.symbol}`}</div>
      <div>
        <button onClick={claim}>claim</button>
        <button onClick={approve}>approve</button>
        <button onClick={release}>release</button>
        <button onClick={dispute}>dispute</button>
      </div>
    </div>
  );
};
