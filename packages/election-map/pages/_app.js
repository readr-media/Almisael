import Head from 'next/head'
import ReactGA from 'react-ga'
import { useEffect } from 'react'
import { Provider } from 'react-redux'

import { GlobalStyles } from '../styles/global-styles'
import { environment, og } from '../consts/config'
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
        <title>{og.title}</title>
      </Head>
    </>
  )
}

export default MyApp
