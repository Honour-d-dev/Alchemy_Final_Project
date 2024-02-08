import { redirect } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { isAddress, isHash } from "viem";

export default async function ExplorerLayout({ children }: { children: React.ReactNode }) {
  const navigateRoute = async (formData: FormData) => {
    "use server";
    const searchItem = formData.get("input") as string;

    if (isAddress(searchItem)) {
      redirect(`/explorer/wallet/${searchItem}`);
    } else if (isHash(searchItem)) {
      redirect(`/explorer/transaction/${searchItem}`);
    } else {
      redirect(`/explorer/block/${searchItem}`);
    }
  };

  return (
    <div className="relative top-24 flex w-screen flex-col items-center justify-center lg:top-0">
      <div className=" fixed top-0 z-10 h-20 w-screen bg-primary"></div>
      <div className="fixed top-0 z-20 flex flex-col items-center justify-center gap-2 md:flex-row">
        <h1 className="relative top-4 z-20 text-4xl font-semibold text-white">Block Explorer</h1>
        <form
          action={navigateRoute}
          className="relative top-4 flex min-w-[300px] max-w-[500px] rounded-md bg-white p-1 focus-within:outline focus-within:outline-zinc-400"
        >
          <input
            name="input"
            type="text"
            className="m-1 flex flex-grow px-1 placeholder:text-center placeholder:font-[cursive] focus-visible:outline-none"
            placeholder="Search address / tx hash / block no."
          />
          <button type="submit" className=" m-auto rounded-md bg-zinc-200 p-2">
            <FiSearch />
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
