import { InputHTMLAttributes, useState, useRef } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

// connect to the ipfs client through infura
const client = ipfsHttpClient({ url: "https://ipfs.infura.io:5001/api/v0" });

import { nftAddress, nftMarketAddress } from "../../../config";

import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

type InputProps = {
  required?: boolean;
  label: string;
  placeholder?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
};

const Input = ({
  required = false,
  label,
  placeholder,
  type = "text",
}: InputProps) => {
  const [value, setValue] = useState("");
  return (
    <>
      <label>
        {label} {required && <b className="text-red-700">*</b>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 border rounded p-4 border-black"
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
      />
    </>
  );
};

// the page
const Create = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  // This function handles the image picked by the user and uploads it to IPFS
  const onChange = async (e: any) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  // function that uploads the stringified NFT Data to IPFS and then calls the calls createSale
  const createItem = async () => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  /**
   * this function takes the url of an image in IPFS and creates a new NFT object using the smart contract.
   * Also list the new NFT using the NFTMarket smart contract
   *
   * @param url
   */
  const createSale = async (url: any) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, "ether");

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftAddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    router.push("/");
  };

  const imageRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <div
          className="w-64 h-64 border-dashed border-2 border-black rounded"
          onClick={() => imageRef.current?.click()}
        >
          {fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )}
        </div>
        <input ref={imageRef} type="file" className="hidden" />
        <div className="flex flex-col my-2">
          <Input required={true} placeholder="Item name" label="Name" />
        </div>
        <div className="flex flex-col my-2">
          <Input
            required={true}
            placeholder="Item description"
            label="Description"
          />
        </div>
        <div className="flex flex-col my-2">
          <Input
            required={true}
            placeholder="Item description"
            label="Description"
            type="number"
          />
        </div>
        <button
          onClick={createItem}
          className="font-bold mt-4 bg-blue-500 text-white rounded py-3 px-6 shadow-lg w-min"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default Create;
