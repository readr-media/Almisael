# Readr Logo

## Feature

- 可傳入 `iconStyle`，調整 Logo (svg path) 顏色。選項僅限 `"original"｜"black" ｜"white"`，分別對應：原始色 / 黑色 / 白色。若傳入其餘 string，則一律視為 `"original"`。
- 可傳入 `href` 設定點擊後連結的頁面網址。預設值為 [Readr 首頁](https://www.readr.tw/)。
- 設定 `openNewTab` 決定點擊後是否另開分頁，預設為 true。( true = 另開分頁 ; false = 原頁面切換至該連結 )
- 使用預設的 className : `.readr-logo` 調整 Logo 尺寸或外框/背景樣式，或傳入自訂的 className，並以該 className 進行調整。
- 可傳入 `onClick` function，設定按鈕點擊後所觸發的函式。( 可利用此 props 設定 GA Event )
- 可傳入 `children` ，替換掉原始 Readr icon。 `children` 可以是 `<img>` 或 `<SVGComponent>`。（可見下方應用範例。）

![Readr Logo](./imgs/logo.svg)

## How to Use This React Component ?

1. Install the npm [package](https://www.npmjs.com/package/@readr-media/react-component)
   `yarn add @readr-media/react-component`
2. Import component in the desired place

```
import styled from 'styled-components'
import { Logo } from '@readr-media/react-component'
import { Test } from './icons/test'

const Container = styled.div`

  //adjust style by passing `className` props
  .default-logo {
     margin: auto;
  }
`

const ClickLogo = () => {
  console.log('click logo')
}

export default function ComponentName() {
  return (
    <Container>

      <Logo
        className="default-logo"
        iconStyle="black"
        href="/"
        openNewTab={false}
        onClick={ClickLogo}
      />

      <Logo className="logo-with-img-children">
        <img src="./imgs/test.png" />
      </Logo>

      <Logo className="logo-with-svg-component-children">
        <Test />
      </Logo>

     </Container >
  )
}
```

## Props

| 名稱       | 資料型別          | 必須 | 預設值                    | 說明                                                                                                                                         |
| ---------- | ----------------- | ---- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| iconStyle  | `"original"` \| `"black"` \| `"white"`            |      | `"original"`              | 設定 Readr Logo (svg path) 顏色。因設計需求緣故，選項僅限填入：`"original"｜"black" ｜"white"`，若傳入其餘 string，則一律視為 `"original"`。 |
| href       | String            |      | `"https://www.readr.tw/"` | 設定 Logo 點擊後連結頁面網址。                                                                                                               |
| openNewTab | Boolean           |      | true                      | 設定點擊後是否另開分頁。true='target: "\_blank"', false='target: "\_self"',                                                                  |
| className  | String            |      | `"readr-logo"`            | 自訂 className。如無傳入自訂 className，仍可透過 `.readr-logo` 更改 Logo 尺寸或背景/外框樣式。                                               |
| onClick    | MouseEventHandler |      |                           | 點擊 LOGO 後觸發之函式。                                                                                                                     |
| children   | React.ReactNode   |      |                           | 可傳入 `children` 替換原始 Readr Icon。（ ex: `<img src="example.png">` 或 `<CustomSVG>`）                                                   |

## TODOs

- [ ] 建立 CI pipeline，透過 CI 產生 npm package，並且上傳至 npm registry
- [ ] 透過 Lerna 控制 packages 之間的版號
