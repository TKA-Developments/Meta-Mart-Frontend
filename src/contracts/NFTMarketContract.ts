import { Result } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract, PayableOverrides } from "@ethersproject/contracts";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { nftAddress, nftMarketAddress } from "../../config";
import {useContract} from "../hooks/useContract";

export type NFTMarketContract = Contract & {
    getListingPrice: () => Promise<BigNumber>;
    createMarketItem: (contract: string, nftTokenId: string, price: BigNumber, override: PayableOverrides) => Promise<Result>;
    fetchMarketItems: () => Promise<Result>;
};

export const useContractNFTMarket = () => useContract(
    nftMarketAddress,
    NFTMarket.abi
  )!;