import Head from 'next/head'
import ReactGA from 'react-ga'
import { useEffect } from 'react'
import { Provider } from 'react-redux'

import { GlobalStyles } from '../styles/global-styles'
import { environment } from '../consts/config'
import store from '../store'

ReactGA.initialize(environment === 'dev' ? 'UA-83609754-2' : 'UA-83609754-1')

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])
  return (
    <>
      <GlobalStyles />

      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
      <Head>
        <title>2022 縣市長、議員選舉暨公投開票即時資訊</title>
      </Head>
    </>
  )
}

export default MyApp
