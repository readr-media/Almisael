import Head from 'next/head'
import { GlobalStyles } from '../styles/global-styles'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
      <Head>
        <title></title>
      </Head>
    </>
  )
}

export default MyApp
