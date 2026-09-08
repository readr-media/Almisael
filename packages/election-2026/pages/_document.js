import { Html, Head, Main, NextScript } from 'next/document'

export default function CustomDocument() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
