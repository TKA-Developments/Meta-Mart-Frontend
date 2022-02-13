import "../../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { Navbar } from "../components/navbar/Navbar";
import { Footer } from "../components/Footer";
import getLibrary from "../misc/getLibrary";
import { Provider as ReduxProvider } from "react-redux";
import { Web3ReactProvider } from "@web3-react/core";
import Web3ReactManager from "../components/Web3ReactManager";
import { store } from "../state";
import dynamic from "next/dynamic";

const Web3ProviderNetwork = dynamic(
  () => import("../components/Web3ProviderNetwork"),
  { ssr: false }
);

function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Web3ReactManager>
          <ReduxProvider store={store}>
            <header className="sticky top-0 z-10">
              <Navbar />
            </header>
            <Component {...pageProps} />
            <Footer />
          </ReduxProvider>
        </Web3ReactManager>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
}

export default App;
