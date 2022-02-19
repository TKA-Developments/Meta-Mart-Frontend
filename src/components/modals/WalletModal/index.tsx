import { AbstractConnector } from "@web3-react/abstract-connector";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  injected,
  SUPPORTED_WALLETS,
  WalletInfo,
} from "../../../config/wallet";
import {
  ApplicationModal,
  setOpenModal,
} from "../../../state/application/actions";
import {
  useIsModalOpen,
  useToggleWalletModal,
} from "../../../state/application/hooks";
import { FaExclamationTriangle, FaUserCircle } from "react-icons/fa";
import { isMobile } from "react-device-detect";
import { Option } from "./Option";
import { useAppDispatch } from "../../../state/hooks";
import { AccountHeaderDetails } from "./AccountHeaderDetails";
import { useActiveWeb3React } from "../../../services/web3";
import { classNames } from "../../../util/style";

export enum WalletView {
  Account,
  Pending,
  Connect,
}

export type WalletModalProps = {
  isNavbarExtended: boolean;
};

export const WalletModal = ({ isNavbarExtended }: WalletModalProps) => {
  const { active, account, connector, activate, error, deactivate } =
    useWeb3React();
  const dispatch = useAppDispatch();
  const [pendingError, setPendingError] = useState<boolean>();
  const isModalOpen = useIsModalOpen(ApplicationModal.Wallet);
  const toggleWalletModal = useToggleWalletModal();

  const tryActivation = useCallback(
    async (
      connector:
        | (() => Promise<AbstractConnector>)
        | AbstractConnector
        | undefined,
      id: string
    ) => {
      let name = "";
      let conn =
        typeof connector === "function" ? await connector() : connector;

      Object.keys(SUPPORTED_WALLETS).map((key) => {
        if (connector === SUPPORTED_WALLETS[key].connector) {
          return (name = SUPPORTED_WALLETS[key].name);
        }
        return true;
      });

      // setPendingWallet({ connector: conn, id }); // set wallet for pending view
      // setWalletView(WALLET_VIEWS.PENDING);

      // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
      if (
        conn instanceof WalletConnectConnector &&
        conn.walletConnectProvider?.wc?.uri
      ) {
        conn.walletConnectProvider = undefined;
      }

      conn &&
        activate(conn, undefined, true).catch((error) => {
          if (error instanceof UnsupportedChainIdError) {
            // @ts-ignore TYPE NEEDS FIXING
            activate(conn); // a little janky...can't use setError because the connector isn't set
          } else {
            setPendingError(true);
          }
        });
    },
    [activate]
  );

  const walletOptions = useMemo(() => {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask;
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key];

      // check for mobile options
      if (isMobile) {
        // disable portis on mobile for now
        if (option.name === "Portis") {
          return null;
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => tryActivation(option.connector, key)}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              link={option.href}
              header={option.name}
              icon={
                "https://app.sushi.com" + "/images/wallets/" + option.iconName
              }
            />
          );
        }
        return null;
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === "MetaMask") {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                header={"Install Metamask"}
                link={"https://metamask.io/"}
                icon="https://app.sushi.com/images/wallets/metamask.png"
              />
            );
          } else {
            return null; // dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === "MetaMask" && !isMetamask) {
          return null;
        }
        // likewise for generic
        else if (option.name === "Injected" && isMetamask) {
          return null;
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? null
                : !option.href && tryActivation(option.connector, key);
            }}
            key={key}
            active={option.connector === connector}
            link={option.href}
            header={option.name}
            icon={
              "https://app.sushi.com" + "/images/wallets/" + option.iconName
            }
          />
        )
      );
    });
  }, [connector, tryActivation]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        isModalOpen
      ) {
        event.preventDefault();
        toggleWalletModal();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, isModalOpen]);

  return (
    <>
      <div
        ref={wrapperRef}
        className={classNames(
          "fixed w-96 bottom-0 -right-96 transform transition ease-in-out delay-150 bg-gray-800 duration-300",
          isModalOpen ? "-translate-x-96" : "-translate-x-0",
          isNavbarExtended ? "h-[calc(100%-108px)]" : "h-[calc(100%-72px)]"
        )}
      >
        {error instanceof UnsupportedChainIdError ? (
          <div className="flex flex-col justify-center m-3 p-4 rounded-xl border-2">
            <p>Please connect to the Mumbai Testnet.</p>
            <button
              onClick={() => deactivate()}
              className="bg-red-600 mt-2 py-2 rounded"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <>
            <AccountHeaderDetails />

            {!account ? (
              <div className="mx-4">
                <h3 className="text-lg mb-2 text-gray-400">
                  Connect with one of our available wallet providers or create a
                  new one.
                </h3>
                <div>{walletOptions}</div>
              </div>
            ) : null}
          </>
        )}
      </div>
      <div
        className={classNames(
          "fixed w-full h-full top-0 left-0 right-0 bottom-0 -z-50 transition-all ease-in-out delay-150  bg-black bg-opacity-60 duration-300 ",
          isModalOpen ? "" : "hidden"
        )}
      />
    </>
  );
};
