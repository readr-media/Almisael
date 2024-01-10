import Head from 'next/head'
import { useEffect } from 'react'
import { Provider } from 'react-redux'

import { GlobalStyles } from '../styles/global-styles'
import { og, siteUrl } from '../consts/config'
import store from '../store'
import gtag from '../utils/gtag'
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    gtag.init()
  }, [])

  return (
    <>
      <GlobalStyles />
      {/* add comscore to track use traffic */}
      <Script
        id="comScore"
        dangerouslySetInnerHTML={{
          __html: `var _comscore = _comscore || []
      _comscore.push({ c1: '2', c2: '24318560' })
      ;(function () {
        var s = document.createElement('script'),
          el = document.getElementsByTagName('script')[0]
        s.async = true
        s.src = 'https://sb.scorecardresearch.com/cs/24318560/beacon.js'
        el.parentNode.insertBefore(s, el)
      })()`,
        }}
      />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
      <Head>
        <title>{og.title}</title>
        <link rel="canonical" href={siteUrl} key="canonical" />
      </Head>
    </>
  )
}

export default MyApp
