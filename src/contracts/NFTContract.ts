import { Result } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { nftAddress } from "../../config";
import {useContract} from "../hooks/useContract";

export type NFTContract = Contract & {
    createToken: (imageUrl: string) => Promise<Result>;
};

export const useContractNFT = () => useContract(nftAddress, NFT.abi)!;