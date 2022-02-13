import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { nftAddress, nftMarketAddress } from "../../config";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useContractNFTMarket } from "../contracts/NFTMarketContract";
import { useContractNFT } from "../contracts/NFTContract";
import { FaEthereum } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import Loading from "react-loading";
import DefaultErrorPage from "next/error";
import { ProductCard, ProductCardNFT } from "../components/card/ProductCard";
import { formatUnits } from "ethers/lib/utils";
import { useActiveWeb3React } from "../services/web3";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";
import { Option } from "../components/modals/WalletModal/Option";
import { injected, SUPPORTED_WALLETS } from "../config/wallet";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const Login = () => {
  const { active, account, connector, activate, error, deactivate, library } =
    useActiveWeb3React();
  const [pendingError, setPendingError] = useState<boolean>();
  const router = useRouter();

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

  if (account) {
    if (router.query.referrer) {
      router.push(router.query.referrer.toString());
    } else {
      router.push("/");
    }

    return <></>;
  }

  return (
    <div className="flex flex-col items-center mt-12 mb-20">
      <div className="max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-3">Connect your wallet.</h2>
        <h3 className="text-lg text-gray-400">
          Connect with one of our available wallet providers or create a new
          one.
        </h3>
        <div className="mt-6">{walletOptions}</div>
      </div>
    </div>
  );
};

export default Login;
