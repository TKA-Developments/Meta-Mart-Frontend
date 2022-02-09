import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { nftAddress, nftMarketAddress } from "../../config";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { useWeb3React } from "@web3-react/core";

const Explore = () => {
  const [nfts, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const { library } = useWeb3React();
  const signer = library.getSigner();

  useEffect(() => {
    loadNFTs();
  }, []);

  // load all the available NFTs, should be called when the web is loaded
  const loadNFTs = async () => {
    // connect to ethereum node through RPC
    // const provider = new ethers.providers.JsonRpcProvider(
    //   `https://polygon-mumbai.g.alchemy.com/v2/qK8Okt3Kcazu3EFNSK8zQdewbpK4uFhp`
    // );

    // get the reference to the smart contracts and the data
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, signer);
    const marketContract = new ethers.Contract(
      nftMarketAddress,
      Market.abi,
      signer
    );
    const data = await marketContract.fetchMarketItems();

    // loop through all the data and fetch them
    const items: any[] = await Promise.all(
      data.map(async (i: any) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);

        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return item;
      })
    );

    // load all the nfts
    setNFTs(items as []);
    setLoadingState("loaded");
  };

  // called by the user, should open metamask and let user buy the NFT using the smart contract
  const buyNFT = async (nft: any) => {
    // pops up the web3 modal and connect to user's wallet
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    // get the signer and the Market contract
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    // initate the transaction
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );

    // wait until the transaction is executed
    await transaction.wait();
    loadNFTs();
  };

  if (loadingState === "loaded" && !nfts.length) {
    return <h1 className={"px-20 py-10 text-3xl"}>No items in marketplace</h1>;
  }

  return (
    <div>
      <h2 className="text-center text-4xl font-bold my-10">
        Explore Collections
      </h2>
      <div className={"flex justify-center"}>
        <div className={"px-4"} style={{ maxWidth: "1600px" }}>
          <div
            className={
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4"
            }
          >
            {nfts.map((nft: any, i) => (
              <div
                key={i}
                className={"border shadow rounded-xl overflow-hidden"}
              >
                <img src={nft.image} />
                <div className={"p-4"}>
                  <p
                    style={{ height: "64px" }}
                    className={"text-2xl font-semibold"}
                  >
                    {nft.name}
                  </p>
                  <div style={{ height: "70px", overflow: "hidden" }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl mb-4 font-bold text-white">
                    {nft.price} ETH
                  </p>
                  <button
                    className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                    onClick={() => buyNFT(nft)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
