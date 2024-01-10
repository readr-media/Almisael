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

  useEffect(() => {
    // add comscore to track use traffic
    var _comscore = _comscore || []
    _comscore.push({ c1: '2', c2: '24318560' })
    ;(function () {
      var s = document.createElement('script'),
        el = document.getElementsByTagName('script')[0]
      s.async = true
      s.src = 'https://sb.scorecardresearch.com/cs/24318560/beacon.js'
      el.parentNode.insertBefore(s, el)
    })()
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
