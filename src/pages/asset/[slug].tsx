import { Contract } from "@ethersproject/contracts";
import { useRouter } from "next/router";
import { useState } from "react";
import { nftAddress, nftMarketAddress } from "../../../config";

import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function Assets() {
  const router = useRouter();
  const tokenId = router.query.slug;
  const [isLoadingList, setIsLoadingList] = useState(true);

  const loadNFTs = async () => {
    // connect to ethereum node through RPC
    const provider = new ethers.providers.JsonRpcProvider(
      `https://polygon-mumbai.g.alchemy.com/v2/qK8Okt3Kcazu3EFNSK8zQdewbpK4uFhp`
    );

    // get the reference to the smart contracts and the data
    const tokenContract = new Contract(nftAddress, NFT.abi, provider);
    const marketContract = new Contract(nftMarketAddress, Market.abi, provider);

    const tokenUri = await tokenContract.tokenURI(tokenId);
    const meta = await axios.get(tokenUri);

    let price = ethers.utils.formatUnits(price.toString(), "ether");

    let item = {
      price,
      tokenId: tokenId.toNumber(),
      seller: seller,
      owner: owner,
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.description,
    };
  };

  return (
    <div>
      <div></div>
      <div></div>
    </div>
  );
}
