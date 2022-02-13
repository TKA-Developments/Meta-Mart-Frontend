import {
  InputHTMLAttributes,
  useState,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { Contract, ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import DefaultErrorPage from "next/error";
import Loading from "react-loading";

// connect to the ipfs client through infura
const ipfsHTTPClient = ipfsHttpClient({
  url: "https://ipfs.infura.io:5001/api/v0",
});

import { nftAddress, nftMarketAddress } from "../../../config";

import { useWeb3React } from "@web3-react/core";
import { FaRegImage, FaTimes } from "react-icons/fa";
import { Result } from "@ethersproject/abi";
import { parseUnits } from "@ethersproject/units";
import { useContractNFTMarket } from "../../contracts/NFTMarketContract";
import { useContractNFT } from "../../contracts/NFTContract";
import { useActiveWeb3React } from "../../services/web3";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  required?: boolean;
  label: string;
  sublabel?: string;
  placeholder?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  rest?: object;
};

const Input = ({
  sublabel,
  required = false,
  label,
  placeholder,
  value,
  setValue,
  type = "text",
  ...rest
}: InputProps) => {
  return (
    <>
      <label className="font-bold">
        {label} {required && <b className="text-red-700">*</b>}
      </label>
      {sublabel && (
        <label className="font-semibold text-xs text-gray-400">
          {sublabel}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 border rounded p-4 border-black text-black"
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
        {...rest}
      />
    </>
  );
};

type ImageInputProps = {
  required?: boolean;
  label: string;
  sublabel?: string;
  imageFile: null | File;
  setImageFile: Dispatch<SetStateAction<null | File>>;
  imageUrl: null | string;
  setImageUrl: Dispatch<SetStateAction<null | string>>;
  disabled: boolean;
};

const ImageInput = ({
  sublabel,
  label,
  required = false,
  imageFile,
  setImageFile,
  imageUrl,
  setImageUrl,
  disabled = false,
}: ImageInputProps) => {
  const onImageToUploadChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (ev.target.files && ev.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setImageUrl(ev.target?.result as string);
        };
        setImageFile(ev.target.files[0]);
        reader.readAsDataURL(ev.target.files[0]);
      } else {
        setImageFile(null);
        setImageUrl(null);
      }
    },
    [setImageFile, setImageUrl]
  );

  const removeCurrentImage = useCallback(() => {
    setImageFile(null);
    setImageUrl(null);
  }, [setImageFile, setImageUrl]);

  const imageRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <label className="font-bold">
        {label} {required && <b className="text-red-700">*</b>}
      </label>
      {sublabel && (
        <label className="font-semibold text-xs text-gray-400">
          {sublabel}
        </label>
      )}
      <div
        className="w-96 h-72 mt-4 border-dashed border-2 border-white rounded relative"
        onClick={!disabled ? () => imageRef.current?.click() : undefined}
      >
        {imageUrl ? (
          <>
            {disabled ? null : (
              <FaTimes
                className="top-1 right-1 absolute"
                onClick={removeCurrentImage}
                size={24}
              />
            )}
            <img src={imageUrl} className="object-cover w-full h-full" />
          </>
        ) : (
          <FaRegImage
            className="top-0 right-0 bottom-0 left-0 absolute m-auto w-20 h-20"
            size={80}
          />
        )}
      </div>
      <input
        ref={imageRef}
        type="file"
        onChange={onImageToUploadChange}
        className="hidden"
      />
    </>
  );
};

// the page
const Create = () => {
  const router = useRouter();
  const { active, account, connector, activate, error, deactivate, library } =
    useActiveWeb3React();

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
  const [errorMessages, setErrorMessages] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [itemImageFile, setItemImageFile] = useState<File | null>(null);
  const [itemImageUrl, setItemImageUrl] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("0");

  const contractNFT = useContractNFT();
  const contractNFTMarket = useContractNFTMarket();

  useEffect(() => {
    setIsSubmitButtonDisabled(
      itemImageFile === null || itemName === "" || parseFloat(itemPrice) <= 0.0
    );
  }, [itemImageFile, itemName, itemPrice]);

  const createItem = useCallback(async () => {
    if (
      itemImageFile === null ||
      itemName === "" ||
      parseFloat(itemPrice) <= 0.0
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const fileAddResult = await ipfsHTTPClient.add(itemImageFile, {
        progress: (prog) => console.log(`Received: ${prog}`),
      });
      const imageUrl = `https://ipfs.infura.io/ipfs/${fileAddResult.path}`;

      const data = JSON.stringify({
        name: itemName,
        description: itemDescription,
        image: imageUrl,
      });

      const metadataAddResult = await ipfsHTTPClient.add(data);
      const imageMetadataUrl = `https://ipfs.infura.io/ipfs/${metadataAddResult.path}`;

      const nftTransaction = await contractNFT.createToken(imageMetadataUrl);
      const nftTransactionResult = await nftTransaction.wait();
      const nftTransactionResultEvent = nftTransactionResult.events[0];
      const nftTokenId = nftTransactionResultEvent.args[2].toNumber();

      const price = parseUnits(itemPrice, "ether");

      const listingPrice = await contractNFTMarket.getListingPrice();
      const marketTransaction = await contractNFTMarket.createMarketItem(
        nftAddress,
        nftTokenId,
        price,
        {
          value: listingPrice.toString(),
        }
      );
      await marketTransaction.wait();
      router.push(`/asset/${nftTokenId}`);
    } catch (err: any) {
      setErrorMessages(err);
      setIsLoading(false);
    }
  }, [itemImageFile, itemName, itemPrice]);

  if (!account) {
    router.push(`/login?referrer=${encodeURI("/asset/create")}`);
    return <></>;
  }

  return (
    <div className="flex flex-col items-center mt-12 mb-20">
      <div className="max-w-2xl w-full">
        <h2 className="text-5xl font-bold mb-6">Create New Item</h2>
        <div>
          <div className="flex flex-col my-2">
            <ImageInput
              disabled={isLoading}
              setImageFile={setItemImageFile}
              imageFile={itemImageFile}
              setImageUrl={setItemImageUrl}
              imageUrl={itemImageUrl}
              required={true}
              label="Image"
              sublabel="File types supported: JPG, PNG, GIF, SVG. Max size: 100 MB"
            />
          </div>
          <div className="flex flex-col my-2">
            <Input
              disabled={isLoading}
              setValue={setItemName}
              value={itemName}
              required={true}
              placeholder="Item name"
              label="Name"
            />
          </div>
          <div className="flex flex-col my-2">
            <Input
              disabled={isLoading}
              setValue={setItemDescription}
              value={itemDescription}
              placeholder="Item description"
              label="Description"
              sublabel="The description will be included on the item's detail page underneath its image. Markdown syntax is supported."
            />
          </div>
          <div className="flex flex-col my-2">
            <Input
              type="number"
              setValue={setItemPrice}
              value={itemPrice}
              required={true}
              placeholder="Item price"
              label="Price"
              sublabel="Price in ETH"
              min={0}
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-row mt-4 items-center">
            <button
              onClick={createItem}
              className="font-bold bg-blue-500 disabled:bg-opacity-30 text-white rounded py-3 px-6 shadow-lg w-min"
              disabled={isSubmitButtonDisabled || isLoading}
            >
              Create
            </button>
            {isLoading && (
              <Loading type="spin" height={30} width={30} className="ml-4" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
