# election-2026

2026 年九合一選舉即時開票 iframe，在 11 月 28 日開票當天顯示於集團三個新聞網站的首頁。

以 [Next.js](https://nextjs.org/) 建置成靜態網站，同一份程式碼會依發布網站(鏡週刊、鏡報、鏡電視)分別 build 出不同的靜態檔案，再部署到三網的 GCS bucket，由三網和 APP 分別嵌入。

## 這是什麼

即時開票 iframe，由以下三個區塊組成：縣市選擇器(桌機版為按鈕群組，平板版和手機版為下拉式選單)、選中縣市的候選人得票長條圖、資料來源與時間戳。資料為每分鐘向後端 JSON API 輪詢一次，用 [SWR](https://swr.vercel.app/) 處理快取跟重新驗證。

因為 iframe 會分別嵌入在集團三個新聞網站和 APP 上，三網的 GCS bucket 路徑、GA4 帳號、資料來源網址都不一樣，所以整個專案的建置流程是靠 `NEXT_PUBLIC_RELEASE_TARGET` 這個環境變數，在 build 時切出不同版本。

## 專案結構

```
election-2026/
├── config/
│   └── index.mjs          # 單一設定來源:依 NEXT_PUBLIC_RELEASE_TARGET 決定要 build 給哪個網站，產出對應的 GCS bucket 路徑和資料來源網址
├── components/
│   └── Select.js           # 縣市下拉式選單(Radix UI)，於平板版和手機版渲染
├── pages/
│   ├── _app.js              # Next.js 全域進入點，初始化 GA4
│   ├── _document.js         # 自訂 HTML document 結構
│   └── index.js             # 處理 iframe UI 與邏輯的主要檔案
├── deploy-scripts/
│   └── index.mjs           # build 完後用 gsutil 把靜態檔案丟到對應網站的 GCS bucket
├── styles/
│   └── global-styles.js    # styled-components 的全域 CSS reset
├── utils/
│   └── gtag.js              # 包裝 react-ga4，記錄分頁點擊等互動事件
├── public/
│   └── *.svg                # 候選人黨徽等靜態圖片資源
└── next.config.mjs          # 設定 assetPrefix，讓 build 出來的靜態檔案走各網站自己的 GCS bucket 路徑
```

## 開發指令

```bash
yarn dev              # 啟動本機開發伺服器 (http://localhost:3000)
yarn lint             # 執行 next lint
```

建置 / 匯出 / 部署都是依發布網站分開的指令，例如:

```bash
yarn build:mirrorMedia        # 正式站 build
yarn build:dev-mirrorMedia    # 測試站 build
yarn export:mirrorMedia       # build 後 export 成靜態檔案到 out/mirrorMedia
yarn export:all               # 一次 export 所有網站
yarn deploy:mirrorMedia       # build 後把 out/mirrorMedia 上傳到正式站的 GCS bucket
```

目前支援的發布網站:`mirrorMedia`、`mirrorDaily`、`mirrorTV`(和各自的 `dev-` 版本)。

> `yarn deploy:*` 會直接把檔案上傳到測試/正式站的 GCS bucket，請確認要部署的網站後才執行。

## 架構重點

- **`config/index.mjs` 是所有跟網站相關設定的唯一來源**:新增一個發布網站時，要同步修改這個檔案、`package.json` 裡的 script、以及 `deploy-scripts/index.mjs` 的部署目標，三處要保持一致。
- **`pages/index.js` 是整個 app**:用 `useSWR` 每 60 秒輪詢一次開票資料，依使用者選的縣市過濾出候選人清單並渲染得票長條圖。背景輪詢失敗時會保留上一次成功的資料繼續顯示，只有在「從未成功拿到任何資料」時才顯示錯誤畫面。
- **樣式用 `styled-components`**，全域 reset 寫在 `styles/global-styles.js`，在 `pages/_app.js` 套用一次。
- **分析事件**透過 `utils/gtag.js` 包裝 `react-ga4`，初始化時用對應網站的 `ga4Id`。
