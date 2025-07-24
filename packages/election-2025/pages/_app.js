import { GlobalStyles } from '../styles/global-styles'
import { useEffect } from 'react'
import gtag from '../utils/gtag'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    gtag.init()
  }, [])

  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
