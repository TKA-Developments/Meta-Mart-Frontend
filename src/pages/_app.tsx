import "../../styles/globals.css";

import { Web3ReactProvider } from "@web3-react/core";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { Footer } from "../components/Footer";
import { Navbar } from "../components/navbar/Navbar";
import Web3ReactManager from "../components/Web3ReactManager";
import getLibrary from "../misc/getLibrary";
import { store } from "../state";

import type { AppProps } from "next/app";
const Web3ProviderNetwork = dynamic(
  () => import("../components/Web3ProviderNetwork"),
  { ssr: false }
);

function App({ Component, pageProps }: AppProps) {
  const header = useMemo(
    () => (
      // sticky top-0 z-10
      <header className="pb-[76px]">
        <Navbar />
      </header>
    ),
    []
  );

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Web3ReactManager>
          <ReduxProvider store={store}>
            {header}
            <Component {...pageProps} />
            <Footer />
          </ReduxProvider>
        </Web3ReactManager>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
}

export default App;
