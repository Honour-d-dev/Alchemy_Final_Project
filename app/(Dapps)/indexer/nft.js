function Nfts({ nftData }) {
  return (
    <div className="m-2 grid grid-cols-3 gap-2 p-1 md:grid-cols-4 md:p-4">
      {nftData.ownedNfts.map((nft) => {
        return (
          <div className="justify-center rounded-md p-1 shadow-md" key={nft.contract.address + nft.tokenId}>
            <img
              className="mx-auto aspect-square h-auto w-full rounded-sm"
              src={nft.media[0]?.thumbnail || nft.media[0]?.gateway || "https://via.placeholder.com/200"}
            />
            <div className=" overflow-hidden text-ellipsis whitespace-nowrap text-center font-body">
              {nft.contract.name ? `${nft.contract.name} #${nft.tokenId}` : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Nfts;
