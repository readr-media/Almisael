# Donate Button / 贊助按鈕

## Feature

- 可傳入 `title` 設定按鈕文字，預設值為: "贊助我們"。
- 可傳入 `href` 設定點擊後連結的頁面網址。預設值為 [Readr 贊助頁面](https://www.readr.tw/donate)。
- 設定 `openNewTab` 決定點擊後是否另開分頁，預設為 true。(true=另開分頁 ; false=原頁面切換至該連結)
- 使用預設的 className : `.readr-donate-button` 調整按鈕樣式，或傳入自定義的 className，並以該 className 進行調整。
- 可傳入 `onClick` function，設定按鈕點擊後所觸發的函式。( 可利用此 props 設定 GA Event )

## How to Use This React Component ?

1. Install the npm [package](https://www.npmjs.com/package/@readr-media/react-component)
   `yarn add @readr-media/react-component`
2. Import component in the desired place

```
import styled from 'styled-components'
import { DonateBtnRect } from '@readr-media/react-component'

const Container = styled.div`
  display: flex;
  align-item: center;
  justify-content: center;

  //adjust style by passing `className` props
  .custom-name {
     background: #ffffff;

     &:hover {
      background: #000000;
     }
  }
`

const ClickButton = () => {
  console.log('click button')
}

export default function ComponentName() {
  return (
    <Container >
      <DonateBtnRect
       title="設定新的贊助按鈕文字"
       href="/"
       openNewTab={false}
       className="custom-name"
       onClick={ClickFunction}
      />
    </Container >
  )
}
```

## Props

| 名稱       | 資料型別          | 必須 | 預設值                          | 說明                                                                                   |
| ---------- | ----------------- | ---- | ------------------------------- | -------------------------------------------------------------------------------------- |
| className  | String            |      | `"readr-donate-button"`         | 自訂 className。如無傳入自訂 className，仍可透過 `.readr-donate-button` 更改按鈕樣式。 |
| onClick    | MouseEventHandler |      |                                 | 點擊按鈕後觸發之函式。                                                                 |
| href       | String            |      | `"https://www.readr.tw/donate"` | 設定按鈕點擊後連結頁面網址。                                                           |
| openNewTab | Boolean           |      | true                            | 設定點擊後是否另開分頁。true='target: "\_blank"', false='target: "\_self"',            |
| title      | String            |      | `"贊助我們"` | 設定按鈕文字。                                                                         |
