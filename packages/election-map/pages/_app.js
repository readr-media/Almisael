import Head from 'next/head'
import { useEffect } from 'react'
import { Provider } from 'react-redux'

import { GlobalStyles } from '../styles/global-styles'
import { og } from '../consts/config'
import store from '../store'
import gtag from '../utils/gtag'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    gtag.init()
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
