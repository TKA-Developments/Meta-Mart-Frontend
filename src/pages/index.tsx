import { formatUnits } from "@ethersproject/units";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import Loading from "react-loading";
import { useContractNFT } from "../contracts/NFTContract";
import { useContractNFTMarket } from "../contracts/NFTMarketContract";
import { shortenAddress } from "../util/string";

enum FeaturedImageState {
  Loading,
  Loaded,
  NoFeaturedImage,
}

const Index = () => {
  const [featuredImageState, setFeaturedImageState] = useState(
    FeaturedImageState.Loading
  );
  const [featuredNFT, setFeaturedNFT] = useState(null);

  const contractNFT = useContractNFT();
  const contractNFTMarket = useContractNFTMarket();

  const loadFeaturedNFT = useCallback(async () => {
    try {
      const data = await contractNFTMarket.fetchLastItem();

      const tokenUri = await contractNFT.tokenURI(data.tokenId);
      const meta = await axios.get(tokenUri);

      const price = formatUnits(data.price.toString(), "ether");

      setFeaturedNFT({
        price,
        tokenId: data.tokenId.toNumber(),
        seller: data.seller,
        owner: data.owner,
        imageSrc: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      });
      setFeaturedImageState(FeaturedImageState.Loaded);
    } catch (err) {
      // Overflow on indexing
      if (err.code == -32603) {
        setFeaturedImageState(FeaturedImageState.NoFeaturedImage);
      }
      console.log(err);
    }
  }, []);

  useEffect(() => {
    loadFeaturedNFT();
  }, []);

  const featuredImageComponent = useMemo(() => {
    if (featuredImageState === FeaturedImageState.Loaded) {
      return (
        <Link href={`/asset/${featuredNFT.tokenId}`}>
          <a>
            <div className="max-w-[550px] w-full relative bg-gray-700 rounded-xl flex flex-col">
              <img
                src={featuredNFT.imageSrc}
                className="w-full h-full max-w-[550px] max-h-[550px] object-cover rounded-t-xl"
              />
              <div className="flex flex-row justify-between px-4 py-3">
                <div className="flex flex-col">
                  <h2 className="font-semibold">{featuredNFT.name}</h2>
                  <h3 className="text-gray-400">
                    {shortenAddress(featuredNFT.seller)}
                  </h3>
                </div>
              </div>
              <div></div>
            </div>
          </a>
        </Link>
      );
    } else if (featuredImageState === FeaturedImageState.Loading) {
      return (
        <div className="max-w-[550px] w-full relative bg-gray-700 rounded-xl flex flex-col">
          <Loading
            type="spin"
            height={50}
            width={50}
            className="self-center my-[200px]"
          />
          <div className="flex flex-row justify-between px-4 py-3">
            <div className="flex flex-col">
              <h2 className="font-semibold">Loading...</h2>
              <h3 className="text-gray-400">Loading...</h3>
            </div>
          </div>
          <div></div>
        </div>
      );
    } else {
      return (
        <div className="max-w-[550px] w-full relative bg-gray-700 rounded-xl flex flex-col">
          <FaQuestionCircle size={50} className="self-center my-[200px]" />
          <div className="flex flex-row justify-between px-4 py-3">
            <div className="flex flex-col">
              <h2 className="font-semibold">No featured NFT</h2>
              <h3 className="text-gray-400"></h3>
            </div>
          </div>
          <div></div>
        </div>
      );
    }
  }, [featuredNFT, featuredImageState]);

  return (
    <>
      <div className="flex items-center">
        <div className="flex flex-row w-full mx-20 my-20 flex-wrap">
          <div className="flex-1 py-36">
            <h2 className="text-4xl font-bold">
              Discover, collect, and sell extraordinary NFTs
            </h2>
            <h3 className="mt-6 text-xl">
              Meta Mart is the world's first and largest NFT marketplace
            </h3>
          </div>
          <div className="flex-1 flex justify-center">
            {featuredImageComponent}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
