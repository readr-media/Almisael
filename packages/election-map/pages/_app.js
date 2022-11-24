import Head from 'next/head'
import { GlobalStyles } from '../styles/global-styles'
import ReactGA from 'react-ga'
import { environment } from '../consts/config'
import { useEffect } from 'react'

ReactGA.initialize(environment === 'dev' ? 'UA-83609754-2' : 'UA-83609754-1')

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])
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
