import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

const Navigate = ({ prevPage, nextPage, pageNum, end }) => {
  return (
    <div className="mb-2 flex h-6 flex-row items-center gap-3 bg-primary p-1">
      <button
        className="flex h-6 w-6 items-center justify-center rounded bg-white shadow-sm disabled:cursor-not-allowed"
        disabled={pageNum.current === 0 ? true : false}
        onClick={(e) => {
          e.preventDefault();
          prevPage();
        }}
      >
        <MdNavigateBefore />
      </button>
      <span className=" text-center text-sm">{pageNum.current + 1}</span>
      <button
        className="flex h-6 w-6 items-center justify-center rounded bg-white shadow-sm disabled:cursor-not-allowed"
        disabled={end}
        onClick={async (e) => {
          e.preventDefault();
          await nextPage();
        }}
      >
        <MdNavigateNext />
      </button>
    </div>
  );
};

export default Navigate;
