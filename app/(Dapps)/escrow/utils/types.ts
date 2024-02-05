import { EscrowAbi } from "./contractAbi";
import {
  Address,
  ContractEventName,
  ContractFunctionArgs,
  ContractFunctionName,
  EIP1193Provider,
  ReadContractParameters,
  ReadContractReturnType,
  WatchContractEventParameters,
  WriteContractParameters,
  createWalletClient,
  custom,
  erc20Abi,
  publicActions,
} from "viem";
import { sepolia } from "viem/chains";

declare global {
  interface Window {
    ethereum: EIP1193Provider;
  }
}

type abi = typeof EscrowAbi;

type WriteFunctionName = ContractFunctionName<abi, "payable" | "nonpayable">;

type WriteFunctionParameters<functionName extends WriteFunctionName = WriteFunctionName> = Omit<
  WriteContractParameters<abi, functionName, ContractFunctionArgs<abi, "payable" | "nonpayable", functionName>>,
  "address" | "abi" | "chain" | "account"
>;

type ReadFunctionName = ContractFunctionName<abi, "pure" | "view">;

type ReadFunctionParameters<functionName extends ReadFunctionName = ReadFunctionName> = Omit<
  ReadContractParameters<abi, functionName, ContractFunctionArgs<abi, "pure" | "view", functionName>>,
  "address" | "abi" | "chain"
>;

type ReadFunctionReturnType<functionName extends ReadFunctionName> = ReadContractReturnType<
  abi,
  functionName,
  ContractFunctionArgs<abi, "pure" | "view", functionName>
>;

export type EscrowType = "exchange" | "timelock" | "otc";

export type ExcEscrows = readonly {
  counter: bigint;
  depositor: `0x${string}`;
  beneficiary: `0x${string}`;
  dToken: `0x${string}`;
  bToken: `0x${string}`;
  dAmount: bigint;
  bAmount: bigint;
}[];

export type TlEscrows = readonly {
  counter: bigint;
  depositor: `0x${string}`;
  beneficiary: `0x${string}`;
  token: `0x${string}`;
  amount: bigint;
  timeLock: bigint;
}[];

export type OtcEscrows = readonly {
  counter: bigint;
  arbiter: readonly `0x${string}`[];
  depositor: `0x${string}`;
  beneficiary: `0x${string}`;
  token: `0x${string}`;
  amount: bigint;
  confirms: number;
  revokes: number;
  quorum: number;
}[];

export type EscrowClient = ReturnType<typeof createEscrowClient>;
const chain = sepolia;
const contractAddress = "0x570c5a51C297d4D3bf8E6a1e2902Ce5f39dFf80B";

export const createEscrowClient = (account: Address) =>
  createWalletClient({
    account,
    chain,
    transport: custom(window.ethereum),
  })
    .extend(publicActions)
    .extend((client) => ({
      escrowAddress: contractAddress,

      read: async <functionName extends ReadFunctionName>(parameters: ReadFunctionParameters<functionName>) =>
        client.readContract({
          address: contractAddress,
          abi: EscrowAbi,
          ...(parameters as ReadFunctionParameters),
        }) as ReadFunctionReturnType<functionName>,

      write: <functionName extends WriteFunctionName>(parameters: WriteFunctionParameters<functionName>) => {
        const { args, functionName, ...rest } = parameters as WriteFunctionParameters;
        return client.writeContract({
          address: contractAddress,
          abi: EscrowAbi,
          functionName: functionName,
          args: args as readonly [unknown],
          ...(rest as any), //😓 the only way
        }); //todo should add simulation first
      },
      watch: <eventName extends ContractEventName<abi>>(
        params: Omit<WatchContractEventParameters<abi, eventName>, "abi" | "address">,
      ) =>
        client.watchContractEvent<abi, eventName>({
          abi: EscrowAbi,
          address: contractAddress,
          ...params,
        }),

      approveToken: async (token: Address, amount: bigint) => {
        return client.writeContract({
          address: token,
          abi: erc20Abi,
          functionName: "approve",
          args: [contractAddress, amount],
        });
      },
      formatTokenAmount: async (token: Address, amount: bigint) => {
        const d = await client.readContract({ address: token, abi: erc20Abi, functionName: "decimals" });
        const value = amount / BigInt(10 ** d);
        switch (true) {
          case value >= 1000000000:
            return Number(value).toExponential(3);
          case value <= 0.000000001:
            return Number(value).toExponential(3);
          default:
            return value.toString();
        }
      },

      tokenSymbol: (token: Address) => client.readContract({ address: token, abi: erc20Abi, functionName: "symbol" }),
    }));
