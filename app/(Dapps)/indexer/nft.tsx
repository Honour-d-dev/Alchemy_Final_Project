import type { OwnedNftsResponse } from "alchemy-sdk";

function Nfts({ nftData }: { nftData: OwnedNftsResponse }) {
  return (
    <div className="m-2 grid grid-cols-3 gap-2 p-1 md:grid-cols-4 md:p-4">
      {nftData.ownedNfts.map((nft) => {
        return (
          <div className="justify-center rounded-md p-1 shadow-md" key={nft.contract.address + nft.tokenId}>
            <img
              className="mx-auto aspect-square h-auto w-full rounded-sm"
              src={
                nft.image.cachedUrl || nft.image.pngUrl || nft.image.originalUrl || "https://via.placeholder.com/200"
              }
            />
            <div className=" font-body overflow-hidden text-ellipsis whitespace-nowrap text-center">
              {nft.contract.name ? `${nft.contract.name} #${nft.tokenId}` : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Nfts;
