import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FaChevronDown,
  FaExclamationTriangle,
  FaGripHorizontal,
  FaUserCircle,
  FaWallet,
} from "react-icons/fa";
import { ApplicationModal } from "../../state/application/actions";
import {
  useOpenModal,
  useToggleWalletModal,
} from "../../state/application/hooks";
import { WalletModal } from "../modals/WalletModal";
import { FlyoutMenu } from "./FlyoutTab";
import DefaultErrorPage from "next/error";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useActiveWeb3React } from "../../services/web3";
import { ChainId } from "../../config/chainid";
import { classNames } from "../../util/style";

export const Navbar = () => {
  const { chainId, account, error } = useWeb3React();
  const toggleWalletModal = useToggleWalletModal();
  const [showMobileMenuDropdown, setShowMobileMenuDropdown] = useState(false);

  const [isInInvalidChainId, setIsInInvalidChainId] = useState(false);

  const switchToMumbai = useCallback(
    () =>
      (
        window as unknown as Window & typeof globalThis & { ethereum?: any }
      )?.ethereum
        ?.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x13881`,
              chainName: "Mumbai Test Network",
              nativeCurrency: {
                name: "MATIC",
                symbol: "matic",
                decimals: 18,
              },
              rpcUrls: ["https://rpc-mumbai.matic.today"],
              blockExplorerUrls: [`https://mumbai.polygonscan.com/`],
            },
          ],
        })
        .then(console.log)
        .catch(console.error),
    []
  );

  useEffect(() => {
    const isInInvalidChainId_ =
      error instanceof UnsupportedChainIdError &&
      ChainId[chainId!] === undefined;

    setIsInInvalidChainId(isInInvalidChainId_);

    if (isInInvalidChainId_) {
      switchToMumbai();
    }
  }, [error, chainId]);

  return (
    <>
      <nav className="bg-gray-900 text-gray-200 border-gray-400 absolute flex items-center py-[18px] w-full px-7">
        <div className="flex flex-row flex-wrap justify-between w-full gap-5">
          {/* <div className="flex flex-row flex-1 gap-5"> */}
          <div className="flex items-center">
            <Link href="/">
              <a>
                <div className="flex">
                  <svg
                    className="mr-3 h-10"
                    viewBox="0 0 52 72"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.87695 53H28.7791C41.5357 53 51.877 42.7025 51.877 30H24.9748C12.2182 30 1.87695 40.2975 1.87695 53Z"
                      fill="#76A9FA"
                    />
                    <path
                      d="M0.000409561 32.1646L0.000409561 66.4111C12.8618 66.4111 23.2881 55.9849 23.2881 43.1235L23.2881 8.87689C10.9966 8.98066 1.39567 19.5573 0.000409561 32.1646Z"
                      fill="#A4CAFE"
                    />
                    <path
                      d="M50.877 5H23.9748C11.2182 5 0.876953 15.2975 0.876953 28H27.7791C40.5357 28 50.877 17.7025 50.877 5Z"
                      fill="#1C64F2"
                    />
                  </svg>
                  <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">
                    Meta Mart
                  </span>
                </div>
              </a>
            </Link>
          </div>
          <button
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => setShowMobileMenuDropdown(!showMobileMenuDropdown)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg
              className="hidden w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div
            className={classNames(
              `md:flex w-full md:w-auto gap-10 items-center justify-center`,
              showMobileMenuDropdown ? "" : "hidden"
            )}
          >
            <div className="relative max-w-xl">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="email-adress-icon"
                className="block p-2 pl-10 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search items/collections/accounts..."
              />
            </div>
            {/* </div> */}
            <div className="justify-between md:w-auto md:order-2 flex flex-col md:flex-row items-center">
              {/* TODO fix this on mobile */}
              <ul className="w-full flex flex-col mt-4 md:flex-row md:mt-0 md:text-sm md:font-medium h-full">
                <li className="h-full text-lg">
                  <Link href="/explore">
                    <a
                      className="px-4 py-2 h-full flex items-center"
                      aria-current="page"
                    >
                      Explore
                    </a>
                  </Link>
                </li>
                <li className="h-full text-lg">
                  <Link href="/asset/create">
                    <a className="px-4 py-2 h-full flex items-center">Create</a>
                  </Link>
                </li>
              </ul>
              <ul className="flex flex-row-reverse md:flex-row py-2 gap-4">
                <li className="h-full text-lg">
                  <FlyoutMenu
                    containerProps={{
                      className:
                        "mx-2 h-full flex flex-col justify-center relative border-0",
                    }}
                    buttonProps={{
                      className: "h-full border-0 outline-none",
                    }}
                    panelProps={{
                      className: "absolute top-[calc(100%)] right-0 w-64 z-20",
                    }}
                    titleComponent={(props) => (
                      <div className=" py-2 h-full flex flex-row items-center">
                        <FaUserCircle size={25} />
                        <FaChevronDown size={14} className="ml-2" />
                      </div>
                    )}
                    popoverComponent={(props) => (
                      <ul className="bg-gray-600 px-4 rounded-b-xl">
                        <li className="py-4">
                          <Link href="/collections">
                            <a className="flex flex-row items-center text-lg">
                              <FaGripHorizontal className="mr-4" />
                              My Collections
                            </a>
                          </Link>
                        </li>
                      </ul>
                    )}
                  />
                </li>
                <li className="h-full text-lg">
                  <button
                    onClick={toggleWalletModal}
                    className="px-2 py-2 h-full flex items-center"
                  >
                    {isInInvalidChainId ? (
                      <FaExclamationTriangle
                        size={25}
                        className="text-red-400"
                      />
                    ) : (
                      <FaWallet size={25} />
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {isInInvalidChainId ? (
          <div className="bg-red-400 h-[36px] text-center flex flex-col justify-center">
            <h3>
              You are in a wrong network. Please connect to the Mumbai Testnet.
            </h3>
          </div>
        ) : null}
      </nav>
      <WalletModal isNavbarExtended={isInInvalidChainId} />
    </>
  );
};
