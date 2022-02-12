import { Contract } from "@ethersproject/contracts";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { nftAddress, nftMarketAddress } from "../../../config";

import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { useContractNFT } from "../../contracts/NFTContract";
import { useContractNFTMarket } from "../../contracts/NFTMarketContract";
import axios from "axios";
import { formatUnits, parseUnits } from "@ethersproject/units";
import Image from "next/image";
import Loading from "react-loading";
import { shortenAddress } from "../../util/string";
import Link from "next/link";
import { FaAlignLeft, FaEthereum, FaWallet } from "react-icons/fa";

export default function Assets() {
  const router = useRouter();
  const tokenId = router.query.slug;

  const [isLoading, setIsLoading] = useState(true);
  const [nft, setNFT] = useState<any>(null);

  const contractNFT = useContractNFT();
  const contractNFTMarket = useContractNFTMarket();

  const loadNFT = useCallback(async () => {
    const data = await contractNFTMarket.fetchMarketItem(tokenId);

    const tokenUri = await contractNFT.tokenURI(data.tokenId);
    const meta = await axios.get(tokenUri);

    let price = formatUnits(data.price.toString(), "ether");

    const item = {
      price,
      tokenId: data.tokenId.toNumber(),
      seller: data.seller,
      owner: data.owner,
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.description,
    };

    setNFT(item);
    console.log(item);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadNFT();
  }, []);

  const buyNFT = useCallback(async () => {
    const price = parseUnits(nft.price.toString(), "ether");
    const transaction = await contractNFTMarket.createMarketSale(
      nftAddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNFT();
  }, [nft]);

  return (
    <div>
      <div
        className={
          "max-w-7xl flex flex-col mx-auto my-12 " +
          (isLoading ? "min-h-[24rem] justify-center" : null)
        }
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Loading type="spin" height={50} width={50} className="mb-4" />
            <h3 className="font-bold text-xl">Loading...</h3>
          </div>
        ) : (
          <div className="mx-5">
            <div className="flex flex-col lg:flex-row w-full gap-6">
              <div className="flex-[1] flex-col flex gap-6">
                <div className="w-full h-28 relative bg-gray-700 rounded-xl">
                  <Image src={nft.image} layout="fill" objectFit="contain" />
                </div>
                <div className="text-white flex flex-col gap-1">
                  <div className="flex flex-row items-center rounded-t-xl bg-gray-900 px-5 py-4">
                    <FaAlignLeft />
                    <h3 className="font-semibold ml-3">Description</h3>
                  </div>
                  <div className="rounded-b-xl bg-gray-700 px-8 py-8">
                    <h3 className="text-gray-100 text-sm mb-2">
                      Created by{" "}
                      <a className="text-indigo-400">
                        <Link
                          href={`https://etherscan.io/address/${nft.seller}`}
                        >
                          {shortenAddress(nft.seller)}
                        </Link>
                      </a>
                    </h3>
                    <p className="text-white">
                      {nft.description ? nft.description : "No description"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-[2] gap-8">
                <div>
                  <h2 className="text-3xl font-bold mb-5">{nft.name}</h2>
                  <h3 className="text-gray-100 text-lg">
                    Owned by{" "}
                    <a className="text-indigo-400">
                      <Link href={`https://etherscan.io/address/${nft.owner}`}>
                        {shortenAddress(nft.seller)}
                      </Link>
                    </a>
                  </h3>
                </div>
                <div className="text-white flex flex-col gap-1">
                  <div className="rounded-xl bg-gray-700 px-8 py-5 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <h5 className="text-gray-400">Current Price</h5>
                      <div className="flex flex-row items-center">
                        <FaEthereum size={25} className="text-gray-200 mr-2" />
                        <h4 className="text-white text-2xl font-semibold">
                          {nft.price}
                        </h4>
                      </div>
                    </div>
                    <div className="flex flex-row">
                      <button
                        className="flex gap-3 items-center bg-blue-500 py-3 px-14 rounded-xl font-semibold"
                        onClick={buyNFT}
                      >
                        <FaWallet />
                        Buy now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        )}
      </div>
    </div>
  );
}
