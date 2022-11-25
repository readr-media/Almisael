import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { organization } from '../consts/config'

function CustomDocument() {
  const ogImage =
    organization === 'readr-media'
      ? 'https://www.readr.tw/assets/images/claw5sez9000t10wm6qhp59t3-tablet.png'
      : 'https://www.mirrormedia.mg/assets/images/20221125150423-5e1b78e027fcab670d8b0eeb5723be8d-tablet.png'
  const ogDescription =
    organization === 'readr-media'
      ? '2022 年縣市長、議員、公投開票結果看 READr！提供最詳盡的選舉票數地圖、歷年比較等功能。'
      : '2022 年縣市長、議員、公投開票結果看鏡週刊！提供最詳盡的選舉票數地圖、歷年比較等功能。'
  const ogUrl =
    organization === 'readr-media'
      ? 'https://www.mirrormedia.mg/projects/election2022/index.html'
      : 'https://www.readr.tw/project/3/election2022/index.html'
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <meta
          property="og:title"
          content="2022 縣市長、議員選舉暨公投開票即時資訊"
        />
        <meta property="og:locale" content="zh_TW" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="2022 縣市長、議員選舉暨公投開票即時資訊"
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:secure_url" content={ogImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={ogUrl} />
        <meta property="fb:app_id" content="175313259598308" />
        <meta name="description" content={ogDescription} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

CustomDocument.getInitialProps = async (ctx) => {
  const sheet = new ServerStyleSheet()
  const originalRenderPage = ctx.renderPage

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
      })
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      ),
    }
  } finally {
    sheet.seal()
  }
}

export default CustomDocument
