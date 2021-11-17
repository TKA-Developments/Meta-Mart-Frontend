import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <nav className={"border-b p-6"}>
        <p className={"text-4xl font-bold"}>Meta Mart</p>
        <div className={"flex mt-4"}>
          <Link href={"/"}>
            <a className={"mr-4 text-blue-500"}>
              Home
            </a>
          </Link>
          <Link href={"/create-item"}>
            <a className={"mr-4 text-blue-500"}>
              Sell Digital Assets
            </a>
          </Link>
          <Link href={"/my-assets"}>
            <a className={"mr-4 text-blue-500"}>
              My Digital Assets
            </a>
          </Link>
          <Link href={"/creator-dashboard"}>
            <a className={"mr-4 text-blue-500"}>
              Creator Dashboard
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
