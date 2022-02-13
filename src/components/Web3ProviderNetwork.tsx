import { AbstractConnector } from "@web3-react/abstract-connector";
import { createWeb3ReactRoot } from "@web3-react/core";
import { NetworkContextName } from "../constant";

const Web3ReactRoot = createWeb3ReactRoot(NetworkContextName);

type Web3ProviderNetworkProps = {
  children: JSX.Element;
  getLibrary: (
    provider?: any,
    connector?: AbstractConnector | undefined
  ) => any;
};

export const Web3ProviderNetwork = ({
  children,
  getLibrary,
}: Web3ProviderNetworkProps) => {
  return <Web3ReactRoot getLibrary={getLibrary}>{children}</Web3ReactRoot>;
};

export default Web3ProviderNetwork;
