import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { nftAddress, nftMarketAddress } from "../../config";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { useContractNFTMarket } from "../contracts/NFTMarketContract";
import { useContractNFT } from "../contracts/NFTContract";
import { FaEthereum } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import Loading from "react-loading";
import { ProductCard } from "../components/card/ProductCard";

const Explore = () => {
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const contractNFT = useContractNFT();
  const contractNFTMarket = useContractNFTMarket();

  const loadNFTs = useCallback(async () => {
    const data = await contractNFTMarket.fetchMarketItems();

    // loop through all the data and fetch them
    const items: any[] = await Promise.all(
      data.map(async (i: any) => {
        const tokenUri = await contractNFT.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);

        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        // console.log(tokenUri);

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          imageSrc: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return item;
      })
    );

    setNFTs(items as []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadNFTs();
  }, []);

  // called by the user, should open metamask and let user buy the NFT using the smart contract
  // const buyNFT = async (nft: any) => {
  //   // pops up the web3 modal and connect to user's wallet
  //   const web3Modal = new Web3Modal();
  //   const connection = await web3Modal.connect();
  //   const provider = new ethers.providers.Web3Provider(connection);

  //   // get the signer and the Market contract
  //   const signer = provider.getSigner();
  //   const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  //   const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

  //   // initate the transaction
  //   const transaction = await contract.createMarketSale(
  //     nftaddress,
  //     nft.tokenId,
  //     {
  //       value: price,
  //     }
  //   );

  //   // wait until the transaction is executed
  //   await transaction.wait();
  //   loadNFTs();
  // };

  // if (isLoading === "loaded" && !nfts.length) {
  //   return <h1 className={"px-20 py-10 text-3xl"}>No items in marketplace</h1>;
  // }

  return (
    <div className="flex flex-col items-center mt-12 mb-20">
      <div className="max-w-7xl w-full px-5">
        <h2 className="text-5xl font-bold mb-6">Explore</h2>
        <div className="">
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
              {nfts.map((nft: any, idx) => (
                <ProductCard key={`nft-${idx}`} nft={nft} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
