import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { nftAddress, nftMarketAddress } from "../../config";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { useWeb3React } from "@web3-react/core";
import { useContractNFTMarket } from "../contracts/NFTMarketContract";
import { useContractNFT } from "../contracts/NFTContract";
import { FaEthereum } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import Loading from "react-loading";
import DefaultErrorPage from "next/error";
import { ProductCard, ProductCardNFT } from "../components/card/ProductCard";
import { formatUnits } from "ethers/lib/utils";
import { useActiveWeb3React } from "../services/web3";
import { useRouter } from "next/router";

const Collections = () => {
  const { active, account, connector, activate, error, deactivate, library } =
    useActiveWeb3React();

  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const contractNFT = useContractNFT();
  const contractNFTMarket = useContractNFTMarket();

  console.warn(contractNFTMarket);

  // load all the available NFTs, should be called when the web is loaded
  const loadNFTs = async () => {
    // connect to ethereum node through RPC
    // const provider = new ethers.providers.JsonRpcProvider(
    //   `https://polygon-mumbai.g.alchemy.com/v2/qK8Okt3Kcazu3EFNSK8zQdewbpK4uFhp`
    // );

    const data = await contractNFTMarket.fetchItemsCreated();

    // loop through all the data and fetch them
    const items: any[] = await Promise.all(
      data.map(async (i: any) => {
        const tokenUri = await contractNFT.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);

        const price = formatUnits(i.price.toString(), "ether");

        return {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          imageSrc: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
      })
    );

    setNFTs(items as []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  const router = useRouter();

  if (!account) {
    router.push(`/login?referrer=${encodeURI("/collections")}`);
    return <></>;
  }

  return (
    <div className="flex flex-col items-center mt-12 mb-20">
      <div className="max-w-7xl w-full">
        <h2 className="text-5xl font-bold mb-6">My Collections</h2>
        <h3 className="text-xl text-gray-400">
          Create, curate, and manage collections of unique NFTs to share and
          sell.
        </h3>
        <div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <Loading type="spin" height={50} width={50} className="mb-4" />
              <h3 className="font-bold text-xl">Loading...</h3>
            </div>
          ) : (
            <div
              className={
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4"
              }
            >
              {nfts.map((nft: ProductCardNFT, idx) => (
                <ProductCard key={`nft-${idx}`} nft={nft} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collections;
