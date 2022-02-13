import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaExclamationTriangle,
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

export const Navbar = () => {
  const { active, account, connector, activate, error, deactivate } =
    useWeb3React();
  const toggleWalletModal = useToggleWalletModal();
  const [showMobileMenuDropdown, setShowMobileMenuDropdown] = useState(false);

  const [isNavbarExtended, setIsNavbarExtended] = useState(false);

  useEffect(() => {
    if (error instanceof UnsupportedChainIdError) {
      setIsNavbarExtended(true);
    } else {
      setIsNavbarExtended(false);
    }
  }, [error]);

  return (
    <>
      <nav className="bg-gray-900 text-gray-200 border-gray-400 flex justify-center flex-col">
        <div className="container flex flex-wrap items-center mx-auto gap-20  h-[72px] px-3">
          <div className="flex flex-row flex-1 gap-5">
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
            <div className="flex md:order-1 flex-1">
              <div className="hidden relative mr-3 md:mr-0 md:block flex-1  max-w-xl">
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
            </div>
          </div>
          <div className="justify-between md:w-auto md:order-2 h-full flex items-center">
            <button
              type="button"
              className="inline-flex items-center p-2 ml-3 text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
            {/* TODO fix this on mobile */}
            <div
              className={
                "md:flex h-full " + (showMobileMenuDropdown ? null : "hidden")
              }
            >
              <ul className="flex flex-col mt-4 md:flex-row md:mt-0 md:text-sm md:font-medium h-full">
                <li className="h-full text-lg">
                  <Link href="/explore">
                    <a
                      className="px-4 text-gray-200 h-full flex items-center"
                      aria-current="page"
                    >
                      Explore
                    </a>
                  </Link>
                </li>
                <li className="h-full text-lg">
                  <Link href="/asset/create">
                    <a className="px-4 h-full flex items-center">Create</a>
                  </Link>
                </li>
                <li className="h-full text-lg">
                  <FlyoutMenu
                    containerProps={{
                      className: "px-2 h-full flex items-center relative",
                    }}
                    panelProps={{
                      className: "bg-white absolute",
                    }}
                    titleComponent={({ open }) => (
                      <div className="flex flex-row items-center">
                        <FaUserCircle size={25} />
                        <FaChevronDown size={14} className="ml-2" />
                      </div>
                    )}
                    popoverComponent={({ open }) => (
                      <ul>
                        <li>
                          <Link href="/collections">
                            <a>My Collections</a>
                          </Link>
                        </li>
                      </ul>
                    )}
                  />
                </li>
                <li className="h-full text-lg">
                  <button
                    onClick={toggleWalletModal}
                    className="px-2 h-full flex items-center"
                  >
                    {error instanceof UnsupportedChainIdError ? (
                      <FaExclamationTriangle
                        size={25}
                        className="text-red-600"
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
        {error instanceof UnsupportedChainIdError ? (
          <div className="bg-red-600 h-[36px] text-center flex flex-col justify-center">
            <h3>
              You are in a wrong network. Please connect to the appropriate
              network.
            </h3>
          </div>
        ) : null}
      </nav>
      <WalletModal isNavbarExtended={isNavbarExtended} />
    </>
  );
};
