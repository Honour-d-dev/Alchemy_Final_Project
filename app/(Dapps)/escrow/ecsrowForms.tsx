"use client";
import { useRef, useState } from "react";
import type { EscrowType } from "./utils/types";
import { Address, parseEther, parseUnits, zeroAddress } from "viem";
import { IoIosAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { useEscrow } from "./utils/useEscrow";
import { toast } from "sonner";

export const EscrowForm = ({ escrowType }: { escrowType?: EscrowType }) => {
  return escrowType === "exchange" ? (
    <ExcForm />
  ) : escrowType === "timelock" ? (
    <TlForm />
  ) : escrowType === "otc" ? (
    <OtcForm />
  ) : (
    <EscrowSkeleton />
  );
};

const isAddress = (s: unknown) => (typeof s === "string" ? /^0x[0-9a-fA-F]{40}$/.test(s) : false);

export const OtcForm = () => {
  const { wallet } = useEscrow();
  const formSchema = z.object({
    beneficiary: z.custom<Address>(isAddress),
    token: z.custom<Address>(isAddress).optional(),
    amount: z.string().regex(/^[0-9]+(\.[0-9]+)?$/),
    arbiter: z.custom<Address>(isAddress).array().min(1),
  });

  type EscrowForm = z.infer<typeof formSchema>;
  const formRef = useRef<EscrowForm>({ arbiter: Array.from({ length: 1 }) } as EscrowForm);
  const [extraArbiters, setExtraArbiters] = useState(0);

  const addArbiter = () => {
    console.log(range(extraArbiters));
    setExtraArbiters((p) => p + 1);
  };

  const removeAbiter = () => {
    //check the formref if the arbiter has been included and delete it
    if (formRef.current.arbiter.length >= extraArbiters + 1) formRef.current.arbiter.pop();
    console.log(range(extraArbiters));
    setExtraArbiters((p) => p - 1);
  };

  const range = (l: number) => {
    return Array.from({ length: l }, (_, i) => i);
  };

  const createEscrow = async () => {
    const id = toast.loading("validating form...");
    if (!formSchema.safeParse(formRef.current).success) {
      toast.error("form validation failed", { id, duration: 3000 });
      return;
    }
    if (wallet && formRef.current) {
      const { amount, arbiter, beneficiary, token } = formRef.current;
      const tokenAmount = token ? parseUnits(amount, await wallet.tokenDecimals(token)) : parseEther(amount);
      try {
        if (token) {
          toast.loading("approving token...", { id });

          await wallet.approveToken(token, tokenAmount);

          toast.loading("creating escrow...", { id });

          await wallet.write({
            functionName: "createOTC",
            args: [arbiter, beneficiary, token, tokenAmount],
          });
        } else {
          toast.loading("creating escrow...", { id });

          await wallet.write({
            functionName: "createOTC",
            args: [arbiter, beneficiary, zeroAddress, tokenAmount],
            value: tokenAmount,
          });
        }
        toast.success("escrow created!", { id, duration: 3000 });
      } catch (error) {
        if (error && typeof error === "object" && "message" in error) {
          toast.error(`${error.message}`, { id, duration: 3000 });
        } else {
          toast.error(`could not create escrow`, { id, duration: 3000 });
        }
      }
    }
  };

  return (
    <form className="border-gray flex flex-col gap-2 rounded-lg border p-8" action="">
      <label className="font-semibold" htmlFor="beneficiary">
        Beneficiary
      </label>
      <input
        required
        className="-mt-2 h-8 rounded-md border border-primary pl-2"
        type="text"
        id="beneficiary"
        pattern="0x[0-9a-fA-F]{40}"
        onChange={(e) => {
          formRef.current.beneficiary = e.target.value as Address;
        }}
      />
      <label className="font-semibold" htmlFor="arbiter">
        Arbiters
      </label>
      <div className="-mt-2 flex flex-row rounded-md border border-primary px-1">
        <input
          required
          className="h-8 grow rounded-md pl-2 focus-visible:outline-none"
          type="text"
          id="arbiter"
          pattern="0x[0-9a-fA-F]{40}"
          onChange={(e) => {
            formRef.current.arbiter[0] = e.target.value as Address;
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            addArbiter();
          }}
        >
          <IoIosAddCircleOutline />
        </button>
      </div>
      {range(extraArbiters).map((i) => {
        return (
          <div className="flex flex-row rounded-md border border-primary px-1" key={i}>
            <input
              required
              className=" h-8 grow rounded-md pl-2 focus-visible:outline-none"
              type="text"
              pattern="0x[0-9a-fA-F]{40}"
              onChange={(e) => {
                formRef.current.arbiter[i + 1] = e.target.value as Address;
              }}
            />
            <button
              className="opacity-80 disabled:opacity-50"
              disabled={i !== extraArbiters - 1}
              onClick={(e) => {
                e.preventDefault();
                removeAbiter();
              }}
            >
              <IoMdRemoveCircleOutline />
            </button>
          </div>
        );
      })}
      <label className="font-semibold" htmlFor="token">
        Token
      </label>
      <input
        className="-mt-2 h-8 rounded-md border border-primary pl-2"
        type="text"
        id="token"
        pattern="0x[0-9a-fA-F]{40}"
        onChange={(e) => {
          formRef.current.token = e.target.value as Address;
        }}
      />
      <label className="font-semibold" htmlFor="amount">
        Amount
      </label>
      <input
        required
        className="-mt-2 h-8 rounded-md border border-primary pl-2"
        type="text"
        id="amount"
        pattern="/^[0-9]+(\.[0-9]+)?$/"
        onChange={(e) => {
          formRef.current.amount = e.target.value;
        }}
      />
      <button
        className="flex items-center justify-center rounded-md bg-primary py-2 text-white"
        onClick={(e) => {
          e.preventDefault();
          createEscrow();
        }}
      >
        {" "}
        Create Escrow
      </button>
    </form>
  );
};

export const TlForm = () => {
  const { wallet } = useEscrow();
  const formSchema = z.object({
    beneficiary: z.custom<Address>(isAddress),
    token: z.custom<Address>(isAddress).optional(),
    amount: z.string().regex(/^[0-9]+(\.[0-9]+)?$/),
    timeLock: z.bigint().positive(),
  });

  type EscrowForm = z.infer<typeof formSchema>;
  const formRef = useRef<EscrowForm>({} as EscrowForm);

  const createEscrow = async () => {
    const id = toast.loading("validating form...");
    if (!formSchema.safeParse(formRef.current).success) {
      toast.error("form validation failed", { id, duration: 3000 });
      return;
    }
    if (wallet && formRef.current) {
      const { beneficiary, timeLock, token, amount } = formRef.current;
      const tokenAmount = token ? parseUnits(amount, await wallet.tokenDecimals(token)) : parseEther(amount);
      try {
        if (token) {
          toast.loading("approving token...", { id });
          await wallet.approveToken(token, tokenAmount);
          toast.loading("creating escrow...", { id });
          await wallet.write({
            functionName: "createTL",
            args: [beneficiary, timeLock, token, tokenAmount],
          });
        } else {
          toast.loading("creating escrow...", { id });
          await wallet.write({
            functionName: "createTL",
            args: [beneficiary, timeLock, zeroAddress, tokenAmount],
            value: tokenAmount,
          });
        }
        toast.success("escrow created!", { id, duration: 3000 });
      } catch (error) {
        if (error && typeof error === "object" && "message" in error) {
          toast.error(`${error.message}`, { id, duration: 3000 });
        } else {
          toast.error(`could not create escrow`, { id, duration: 3000 });
        }
      }
    }
  };

  return (
    <form className="border-gray flex flex-col gap-2 rounded-lg border p-8" action="">
      <label className="font-semibold" htmlFor="beneficiary">
        Beneficiary
      </label>
      <input
        required
        className="-mt-2 h-8 rounded-md border border-primary pl-2"
        type="text"
        id="beneficiary"
        pattern="0x[0-9a-fA-F]{40}"
        onChange={(e) => {
          formRef.current.beneficiary = e.target.value as Address;
        }}
      />
      <label className="font-semibold" htmlFor="token">
        Token
      </label>
      <input
        className="-mt-2 h-8 rounded-md border border-primary pl-2"
        type="text"
        id="token"
        pattern="0x[0-9a-fA-F]{40}"
        onChange={(e) => {
          formRef.current.token = e.target.value as Address;
        }}
      />
      <label className="font-semibold" htmlFor="amount">
        Amount
      </label>
      <input
        required
        className="-mt-2 h-8 rounded-md border border-primary pl-2"
        type="text"
        id="amount"
        pattern="/^[0-9]+(\.[0-9]+)?$/"
        onChange={(e) => {
          formRef.current.amount = e.target.value;
        }}
      />
      <label className="font-semibold" htmlFor="duration">
        Duration
      </label>
      <input
        className="-mt-2 h-8 rounded-md border border-primary pl-2"
        type="text"
        id="duration"
        pattern="[0-9]+"
        onChange={(e) => {
          formRef.current.timeLock = BigInt(e.target.value);
        }}
      />
      <button
        className="flex items-center justify-center rounded-md bg-primary py-2 text-white"
        onClick={(e) => {
          e.preventDefault();
          createEscrow();
        }}
      >
        {" "}
        Create Escrow
      </button>
    </form>
  );
};
export const ExcForm = () => {
  const { wallet } = useEscrow();
  const formSchema = z.object({
    beneficiary: z.custom<Address>(isAddress),
    dToken: z.custom<Address>(isAddress).optional(),
    bToken: z.custom<Address>(isAddress).optional(),
    dAmount: z.string().regex(/^[0-9]+(\.[0-9]+)?$/),
    bAmount: z.string().regex(/^[0-9]+(\.[0-9]+)?$/),
  });

  type EscrowForm = z.infer<typeof formSchema>;
  const formRef = useRef<EscrowForm>({} as EscrowForm);

  const createEscrow = async () => {
    const id = toast.loading("validating form...");
    if (!formSchema.safeParse(formRef.current).success) {
      toast.error("form validation failed", { id, duration: 3000 });
      return;
    }
    if (wallet && formRef.current) {
      const { beneficiary, dToken, bToken, dAmount, bAmount } = formRef.current;
      const dTokenAmount = dToken ? parseUnits(dAmount, await wallet.tokenDecimals(dToken)) : parseEther(dAmount);
      const bTokenAmount = bToken ? parseUnits(bAmount, await wallet.tokenDecimals(bToken)) : parseEther(bAmount);
      try {
        if (dToken) {
          toast.loading("approving token...", { id });
          await wallet.approveToken(dToken, dTokenAmount);
          toast.loading("creating escrow...", { id });
          await wallet.write({
            functionName: "createExc",
            args: [beneficiary, dToken, bToken ?? zeroAddress, dTokenAmount, bTokenAmount],
          });
        } else {
          toast.loading("creating escrow...", { id });
          await wallet.write({
            functionName: "createExc",
            args: [beneficiary, zeroAddress, bToken ?? zeroAddress, dTokenAmount, bTokenAmount],
            value: dTokenAmount,
          });
        }
        toast.success("escrow created!", { id, duration: 3000 });
      } catch (error) {
        if (error && typeof error === "object" && "message" in error) {
          toast.error(`${error.message}`, { id, duration: 3000 });
        } else {
          toast.error(`could not create escrow`, { id, duration: 3000 });
        }
      }
    }
  };

  return (
    <form className="border-gray flex flex-col gap-2 rounded-lg border p-8">
      <label className="font-semibold" htmlFor="beneficiary">
        Beneficiary
      </label>
      <input
        required
        className="-mt-2 h-8 rounded-md border border-primary pl-2"
        type="text"
        id="beneficiary"
        pattern="0x[0-9a-fA-F]{40}"
        onChange={(e) => {
          formRef.current.beneficiary = e.target.value as Address;
        }}
      />
      <label className="font-semibold" htmlFor="dToken">
        Deposit Token
      </label>
      <input
        className="-mt-2 h-8 rounded-md border border-primary pl-2"
        type="text"
        id="dToken"
        pattern="0x[0-9a-fA-F]{40}"
        onChange={(e) => {
          formRef.current.dToken = e.target.value as Address;
        }}
      />
      <label className="font-semibold" htmlFor="dAmount">
        Amount
      </label>
      <input
        required
        className="-mt-2 h-8 rounded-md border border-primary pl-2"
        type="text"
        id="dAmount"
        pattern="/^[0-9]+(\.[0-9]+)?$/"
        onChange={(e) => {
          formRef.current.dAmount = e.target.value;
        }}
      />
      <label className="font-semibold" htmlFor="bToken">
        Recieve Token
      </label>
      <input
        className="-mt-2 h-8 rounded-md border border-primary pl-2"
        type="text"
        id="bToken"
        pattern="0x[0-9a-fA-F]{40}"
        onChange={(e) => {
          formRef.current.bToken = e.target.value as Address;
        }}
      />
      <label className="font-semibold" htmlFor="bAmount">
        Amount
      </label>
      <input
        required
        className="-mt-2 h-8 rounded-md border border-primary pl-2"
        type="text"
        id="bAmount"
        pattern="/^[0-9]+(\.[0-9]+)?$/"
        onChange={(e) => {
          formRef.current.bAmount = e.target.value;
        }}
      />
      <button
        className="flex items-center justify-center rounded-md bg-primary py-2 text-white"
        onClick={(e) => {
          e.preventDefault();
          createEscrow();
        }}
      >
        {" "}
        Create Escrow
      </button>
    </form>
  );
};

const EscrowSkeleton = () => {
  return (
    <div className="border-gray flex flex-col gap-2 rounded-lg border p-8">
      <label className="font-semibold" htmlFor="">
        Beneficiary
      </label>
      <Skeleton className="flex h-8 grow" />
      <label className="font-semibold" htmlFor="">
        Token
      </label>
      <Skeleton className="flex h-8 grow" />
      <label className="font-semibold" htmlFor="">
        Amount
      </label>
      <Skeleton className="flex h-8 grow" />
      <Skeleton className="h-12 w-1/3 self-center" />
    </div>
  );
};
