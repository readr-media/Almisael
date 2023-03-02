# Related-Report / 相關報導

## Feature

- 元件功能

  - 自動根據螢幕寬度 & 報導數量，調整報導排版形式。
  - 點按報導圖片 or 報導標題，可另開分頁至該報導頁面。

- 使用設計

  - 需傳入 `relatedData`，傳入相關報導資料 array。
  - 使用者可傳入 `title`，指定標題文字。
  - 使用者可傳入 `ariaLevel`，指定標題(role=heading)的 "aria-level"。
  - 使用者可傳入 `highlightColor`，指定標題 highlight 顏色 。
  - 使用者可傳入 `defaultImage`。當文章圖片無法正常顯示時，會改為顯示此 `defaultImage`。
  - 使用預設的 className : `.readr-report-title`, `.readr-report-caption` 調整標題/報導標題樣式，或傳入自訂 className，並以該 className 進行調整。

![Related report](./imgs/related-report.svg)

## How to Use This Pkg as React Component ?

1. Install the npm [package](https://www.npmjs.com/package/@readr-media/react-component)
   `yarn add @readr-media/react-component`
2. Import component in the desired place

```
import { RelatedReport } from '@readr-media/react-component'

const data = [
  {
    id: 1,
    caption: '文章標題 01',
    imageUrl: 'https://www.readr.tw/assets/images/cld2ymzdw000p10ykb7pshoop-tablet.png',
    alt: '文章敘述 01',
    link: 'https://www.readr.tw/post/2932',
    date: '2023-02-08T07:00:00.000Z',
    time: 100,
  }
]

export default function ComponentName() {
  return (
    <RelatedReport
      relatedData={data}
      title="最新報導"
      highlightColor="yellow"
      titleClassName="title"
      captionClassName="caption"
      defaultImage="default-img.svg"
      ariaLevel={3}
    />
  )
}
```

## Props

| 名稱             | 資料型別 | 必須 | 預設值                   | 說明                                                                                                                                                                             |
| ---------------- | -------- | ---- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| relatedData      | Array    | `V`  | `[]`                     | 報導資訊。範例：`[ { id: 1, caption: '報導01', date: '2023-02-08T07:00:00.000Z', time: 100 ,imageUrl: 'https://www.readr.tw', alt: '報導01',link: 'https://www.readr.tw' } ]` 。 |
| title            | string   |      | `"最新報導"`             | 標題。                                                                                                                                                                           |
| highlightColor   | string   |      | `"ffffff"`                     | 標題 highlight 顏色。                                                                                                                                                            |
| titleClassName   | string   |      | `"readr-report-title"`   | 指定標題 className，可用於變更標題樣式。                                                                                                                                         |
| captionClassName | string   |      | `"readr-report-caption"` | 指定文章標題 className，可用於變更文章標題樣式。                                                                                                                                 |
| defaultImage     | string   |      | `""`                     | 文章預設圖片。當 `relatedData` 的 `imageUrl` 載入失敗時，則載入預設圖片。                                                                                                        |
| ariaLevel        | number   |      | `""`                     | 設定標題（role="heading"）的 aria-level，                                                                                                                                        |

## Props Detail : relatedData

### required

- `caption`: 報導標題。
- `date`: 報導日期。
- `time`: 報導閱讀時間。

### optional

- `id`: 報導 id。
- `imageUrl`: 報導圖片 URL。
- `alt`: 報導圖片替代文字。
- `link`: 報導連結。

## TODOs

- [ ] 建立 CI pipeline，透過 CI 產生 npm package，並且上傳至 npm registry
- [ ] 透過 Lerna 控制 packages 之間的版號
- [ ] 圖片載入改為使用 `@readr-media/react-image`
