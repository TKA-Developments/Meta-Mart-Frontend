import Link from "next/link";
import Image from "next/image";
import { FaEthereum } from "react-icons/fa";
import { Key } from "react";

export type ProductCardNFT = {
  tokenId: string;
  imageSrc: string;
  price: number;
  name: string;
};

export type ProductCardProps = {
  // key?: Key | null;
  nft: ProductCardNFT;
};

export const ProductCard = ({ nft }: ProductCardProps) => {
  return (
    <a>
      <Link href={`/asset/${nft.tokenId}`}>
        <div className="cursor-pointer drop-shadow-2xl rounded overflow-hidden bg-gray-700 lg:max-w-[330px]">
          <div className="mb-5 bg-gray-700">
            <div className="w-full aspect-[1] relative">
              <Image src={nft.imageSrc} layout="fill" objectFit="cover" />
            </div>
          </div>
          <div className="min-h-[126px] flex flex-col justify-between">
            <div className="flex flex-row justify-between bg-gray-700 mx-4 items-center">
              <div>
                <h4 className="text-lg font-semibold">{nft.name}</h4>
              </div>
              <div className="font-semibold flex flex-row items-center">
                <FaEthereum size={20} className="text-gray-200 mr-2" />
                <p className="text-lg text-white">{nft.price}</p>
              </div>
            </div>
            <div className="min-h-[42px] shadow-inner"></div>
          </div>
        </div>
      </Link>
    </a>
  );
};
