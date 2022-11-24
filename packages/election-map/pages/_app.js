import Head from 'next/head'
import { GlobalStyles } from '../styles/global-styles'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
      <Head>
        <title>2022 縣市長、議員選舉暨公投開票即時資訊</title>
      </Head>
    </>
  )
}

export default MyApp
