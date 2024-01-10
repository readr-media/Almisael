這個 package 為 Readr, 鏡週刊 2022, 2024 年度大選專題的選舉模組，預期會來的大選也會繼續修改使用。

- 鏡週刊 2022 縣市長、議員選舉暨公投開票即時資訊 [link](https://mirrormedia.mg/projects/election2022/index.html)
- Readr 2022 縣市長、議員選舉暨公投開票即時資訊 [link](https://www.readr.tw/project/3/election2022/)
- 鏡週刊 2024 總統、立委選舉開票即時資訊 [link](https://mirrormedia.mg/projects/election2024/index.html)
- Readr 2024 總統、立委選舉開票即時資訊 [link](https://www.readr.tw/project/3/election2024/)

專案於 2022 年因應縣市首長、縣市議員以及公投等選制開發，架構上因為各選制的資料呈現有許多繁瑣的差異，因此在整體架構上比較凌亂，在 2023 年開發時 2024 總統、立委選制的時候經過一輪的重構將 `useElectionData` 這個 hook 中的 useState 改存到 redux 的各個 slice 中，同時把原本的桌機、手機版都是地圖控制的模式改版為桌機保留地圖控制，手機則使用篩選器控制的方式。進一步的把資料和顯示的邏輯拆開，不過即便如此，因為開發時程的關係仍有許多地方有待優化。

## 專案架構

選舉模板主要透過 [config.js](https://github.com/readr-media/Almisael/blob/main/packages/election-map/consts/config.js) 和 [electionConfig.js](https://github.com/readr-media/Almisael/blob/main/packages/election-map/consts/electionsConfig.js) 來控制專案要在哪個網站上呈現哪些選舉類別。

模板由 Dashboard 所構成，Dashboard 依照瀏覽裝置分別又分成桌機版的 [Dashboard.js](https://github.com/readr-media/Almisael/blob/main/packages/election-map/components/Dashboard.js) 和手機版的 [MobileDashboardNew.js](https://github.com/readr-media/Almisael/blob/main/packages/election-map/components/mobile/MobileDashboardNew.js)，兩者都會控制包含 [EVC](https://github.com/readr-media/Almisael/blob/main/packages/election-map/components/ElectionVoteComparisonPanel.js) (Election-Votes-Comparison, 票數比較元件)[、SeatChart](https://github.com/readr-media/Almisael/blob/main/packages/election-map/components/SeatsPanel.js) (席次表) 和 [Infobox](https://github.com/readr-media/Almisael/blob/main/packages/election-map/components/InfoboxPanels.js) 三種 panels。

選舉對應的資料會藉由 Panels 各自呈現對應的資料來提供使用者全面的選舉資訊，而控制 Panels 顯示什麼選舉、什麼地區層級的資訊則由控制器來決定，像是桌機版的地圖控制器 [MapContainer.js](https://github.com/readr-media/Almisael/blob/main/packages/election-map/components/MapContainer.js) 和手機版的 [SelectorsContainer.js](https://github.com/readr-media/Almisael/blob/main/packages/election-map/components/mobile/SeletorsContainer.js)。

關於模板所需用來呈現的選舉資料，會由 custom hook [useElectionData.js](https://github.com/readr-media/Almisael/blob/main/packages/election-map/hook/useElectinData.js) 中依照當前的選制、年份、地區層級... 等相對應的狀態來拿取放在 gcs bucket 上的資料，並更新到 redux store 中 ([election-slice.js](https://github.com/readr-media/Almisael/blob/main/packages/election-map/store/election-slice.js))，而各個 panels 則透過 redux 獲取各自需要的資料來顯示。同樣的，控制器也是透過 redux reducer 來修改 election-slice 中的 state，觸發 `useElectionData` 進行新資料的拿取最終導致各個 Panels 更新顯示的資料。

### Configs

選舉模板的 configs 分別放在 [config.js](https://github.com/readr-media/Almisael/blob/main/packages/election-map/consts/config.js) 和 [electionConfig.js](https://github.com/readr-media/Almisael/blob/main/packages/election-map/consts/electionsConfig.js) 之中。

`Config.js` 中主要放的是專案的設定：

| Const        | Value                               | description                                                     |
| ------------ | ----------------------------------- | --------------------------------------------------------------- |
| organization | '`readr-media`' or '`mirror-media`' | 切換週刊和 Readr 之間，會改變對應的背景色、標題和 og 相關的資料 |
| environment  | '`dev`' or '`prod`'                 | 切換環境，影響選舉資料拿取的路徑                                |

`ElectionConfig.js` 中則是包含了選舉相關的設定值

| Const                 | Value                                                                                                                       | description                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| defaultElectionType   | [ElectionType](https://github.com/readr-media/Almisael/blob/main/packages/election-map/consts/electionsConfig.js#L7)        | 預設的選舉制度                                                                           |
| currentYear           | number (年份)                                                                                                               | 選舉的年份                                                                               |
| electionsConfig       | [ElectionConfig](https://github.com/readr-media/Almisael/blob/main/packages/election-map/consts/electionsConfig.js#L52-L57) | 各個選制的設定值，包含中英文名稱、選舉年份、子選舉類別和各個 Panels 對應的 metadata      |
| defaultElectionConfig | [ElectionConfig](https://github.com/readr-media/Almisael/blob/main/packages/election-map/consts/electionsConfig.js#L52-L57) | 預設的選舉設定值                                                                         |
| countyMappingData     | Object                                                                                                                      | 縣市中英文名稱和代碼對照表，主要用來與 EVC 和 SeatChart 等外部元件溝通時轉換縣市單位使用 |

#### 補充說明

`electionsConfig` 各選制本身就有許多微妙的差異，同在在開發階段因應持續新增的需求，所以目前的 config 會依照不同選制而長得不太一樣，可以參考以下的選制介紹先了解選制後再回來看設定值會比較能夠理解。

### 選舉資料

補上 Mock Data 介紹

選舉模板的資料主要分成三大類，分別是 map、seat、evc 三種：

- map: 提供地圖、infobox 顯示資訊使用，各個選制都一定會有資料，名稱取為 map 是因為資料結構的設計是以地圖為出發點下去設計，而 infobox 是剛好可以透過同一份資料來顯示，以 2022 年縣市首長的縣市層級為例，其 [country.json](https://storage.googleapis.com/whoareyou-gcs.readr.tw/elections-dev/2022/mayor/map/country/country.json) 中包含了全國縣市的縣市首長選舉資料，在地圖顯示全國層級的時候就可以透過這個資料來呈現各縣市勝選政黨的顏色，而在此時因為縣市首長沒有全國性的資料所以會顯示 "點擊地圖看更多資料" ; 如果在地圖點擊台北市的話，將會取得 [63000.json](https://storage.googleapis.com/whoareyou-gcs.readr.tw/elections-dev/2022/mayor/map/county/63000.json) 台北市的資料，而台北市的資料中會有台北市各個鄉鎮市區的投票狀況，以供地圖使用，而 infobox 在這個層級則是需要呈現台北市整體的市長選舉狀況，因此其實是從前一個層級取得的 country.json 中取出台北市的資料來顯示，在理解上相對來說會複雜一些。
- seat: 提供席次表使用，只有縣市議員、立法委員等有席次的選制才會有此資料，資料只會有子選制層級，沒有像 map 有到鄉鎮市區或是村裡層級。
- evc: 提供票數比較元件使用，各選制都有，資料只會有子選制層級，沒有像 map 有到鄉鎮市區或是村裡層級。

> 如果仔細看三者的資料，會發現只有 map json 中有包含了 `isRunning` 和 `is_started` 的資料，選舉模板在即時開票的狀況下會依照這兩個 properties 來決定 infobox 所實際顯示的內容 (像是尚未開票、開票中、開票結束等提示)，後續提到的即時開票三個階段會再詳述。

基本上選舉模板只會呈現一個選制、一個子類別(如果有的話)、一個層級下(每個選制略有不同，參考下方選制介紹)的資料，而基於選舉模板實際上會抓取的資料繁多，為了避免重複抓取相同的資料，有一套完整的儲存機制在選制等條件切換的情況下去取得所需的資料之後確保不會再重複拿取資料會大大節省網路成本，這邊的邏輯主要由 `useElectionData` 和 redux `election-slice` 所共同組成。

#### useElectionData

`useElectionData` 為 react custom hook，主要用來拿取各選制下所有 Panel 對應的資料，並控制 refetch 機制確保開票時能及時更新最新的開票資訊。

拿取三大資料的 function 為放在 `utils/electionsData` 中的 [prepareElectionData](https://github.com/readr-media/Almisael/blob/main/packages/election-map/utils/electionsData.js#L484)，其中根據每個選舉類別和層級去拿取對應的資料。

三種資料都是儲存在 whoareyou-gcs.readr.tw/elections (dev 環境是 elections-dev) 的對應年份、層級中，理論上可以直接在專題內發 request 拿取 json，不過因為 evc 和 seat 的顯示邏輯已經切到 [readr-media/election-widget](https://github.com/readr-media/react/tree/main/packages/election-widgets/src) 之中，在獨立成套件的同時也一併將資料的拿取封裝到對應的 `dataLoader` 之中，因此這個專案中針對這兩種資料會直接使用對應的 `dataLoader` 來取得資料，只有 map 的資料是 maintain 在專案之中，未來如果有修改的話要注意。

而因為 map 相關的資料最為複雜，為了簡化每次 call function 時要帶的參數，`electionsConfig` 中已經把 map 對應的 json url 資料夾和檔案名稱固定的部分記錄起來，搭配動態傳入的行政區代碼來覆蓋所有的檔案路徑。

### redux slices

因為所有的選舉類別、各自的子類別和所有的選舉年份、公投案號都存在 `electionsConfig` 之中，因此在專案初始化的時候 `election-slice` 就會先透過 `electionsConfig` 來產生一個包含所有選制下各年份、各公投案號、各子類別等條件組成的儲存三大資料的 Object，可以看[此段註解](https://github.com/readr-media/Almisael/blob/main/packages/election-map/utils/electionsData.js#L102-L350)會比較好理解 `electionsData` 的結構。

`electionsData` 因為受限於各個選制都有各自不同的邏輯，像是年份和案號、有的有子類別有的沒有，因此沒辦法設計成完全一樣的格式，因此在讀取和寫入的時候需要另外依靠不同的選制各別處理 (寫入： [updateElectionsData](https://github.com/readr-media/Almisael/blob/main/packages/election-map/utils/electionsData.js#L412)，讀取： [getElectionData](https://github.com/readr-media/Almisael/blob/main/packages/election-map/utils/electionsData.js#L452))。

除了 `electionsData` 之外，`electionSlice` 中還存了大量的狀態，見 [`initialElectionState`](https://github.com/readr-media/Almisael/blob/main/packages/election-map/store/election-slice.js#L83)：

- config: 當前顯示中的選舉類別的 electionConfig，用來讓年份、公投案號等 component 知道要 render 哪些時間和案號。
- data: 除了 `electionsData` 之外，其餘的 properties 都是各個 panels 在當前的選舉條件下所需要顯示的資料，像是 infobox、地圖、席次表和票數比較，這些資料都是在切換選制、子類別、年份、層級時在 `prepareElectionData` 拿取對應的三大資料後更新 `electionsData` 後， `useElectionData` 隨著 rerender 而產生出新的對應資料。
- compare: 如同 data 中的 `infoboxData`、`mapData`，都是在 `useElectionData` rerender 的時候當 `compareMode=true` 的時候依照 compare 的選制、子類別、年份、公投案號和層級等條件拿取 `electionsData` 中對應的資料，微小的不同的是 compareMode 的情況下並不會顯示席次表和票數比較。
- control: 當前顯示的子選舉類別、年份、公投案號和層級，選制因為已經在 config 中有涵蓋所以不需要另外存選制在這之中。

### Panels

Infobox 和 EVC 兩者都是呈現選舉得票數資訊，兩者的差異是 Infobox 呈現的資料層級會隨著地圖或是篩選器的控制(層級的改變)而呈現不同的資料，提供使用者更微觀的選舉票數資訊，而 EVC 則是會持續顯示最高層級的資料，讓使用者在選擇較低層級(例如村里)的資料的時候可以同時看到選舉的大局資訊，兩者算是互補的性質。

#### Infobox

資料：從 map 而來
Infobox 主要為顯示目前層級下的選舉資訊，會依照不同選舉、不同層級顯示不同的資料，

使用方式？
開票相關呈現：講 infobox 直接相關的呈現，剩下的放到即時開票去講
note 的用法
介紹 infobxoxData function

#### EVC (票數比較)

資料：
EVC (Election Votes Comparison，票數比較元件)，是由選舉模板和政見追蹤平台(whoareyou)兩個頁面所共用，因此不像 map 和 seat 資料都是以行政區碼為 json 檔名，evc 的檔案大致分為 all 和縣市英文名兩者，視下面講到的最高層級是否有多個而定。
evc 主要為顯示目前選制下的整體的投票資訊，只會有該選制下最高層級的資料，以下列出所有選制的層級：

| 選制                   | 最高層級   | EVC 檔名          |
| ---------------------- | ---------- | ----------------- |
| 總統                   | 全國       | all.json          |
| 區域立委               | 各縣市選區 | [縣市英文名].json |
| 山地、平地原住民立委   | 全國       | all.json          |
| 不分區政黨票           | 全國       | all.json          |
| 縣市首長               | 各縣市     | [縣市英文名].json |
| 縣市議員(區域、原住民) | 各縣市選區 | [縣市英文名].json |
| 全國性公投             | 全國       | all.json          |

使用方式？
顯示/隱藏：沒資料就隱藏
確認開票前的資料，補充進級開票中章節

#### SeatChart (席次表)

資料：只有子選制最高層級的資料
介紹開票中席次表用開票中、尚未有席次的正檔名稱邏輯，補充近即時開票中章節
介紹立委切換按鈕
使用方式

### 地圖

### 手機篩選器

### 即時開票

選舉模板每次上線一定是因為有即時開票的資訊提供需求，而即時開票從尚未開始、開始開票到最後開票結束因應各個階段資料都會略有不同，需要各自處理。

雖然選舉模板會有三大資料(參考選舉資料章節)，但實際上會紀錄即時開票狀態的只有 map 的資料，只有這個類別的資料中都會夾帶 `is_started` 和 `is_running` 兩個 boolean properties，透過這兩個 flag 的組合可以表述開票前中後三個階段 (不會有 `is_started=false`, `is_running=true` 的狀態)。

以下詳述三個階段的狀態，其中開票結束的狀態其實就等同於即時開票結束，該選舉結束變成歷史選舉，換句話說，歷史選舉中的資料就會符合開票結束的長相。

#### 開票前：

EVC
Seat
Infobox

```
{
  is_started: false,
  is_running: false
}
```

#### 開票中：

```
{
  is_started: true,
  is_running: true
}
```

#### 開票結束：

```
{
  is_started: true,
  is_running: false
}
```

### 待優化項目

- `useElectionData` 中呼叫 `prepareElectionData` 的 useEffect 因為 `electionData` 是使用 redux-slice 來儲存，每次更新後都會是新的 Object，因此如果加到 useEffect 中的 dependency 就會導致 `useElectionData` 無限 rerender，因此目前只能先註解掉，未來有時間需要修改整個呼叫方式，配合 redux 的特性和 useEffect 的機制來最佳化程式碼，避免潛在的 bug。

## 選制

這個專案涵蓋台灣各種類別的大選，因為各個選制之間有需多差異但又需要共用同樣的架構來呈現，因此造成程式碼在處理選制上有許多 case by case 的處理方式，而對於選制本身有基本的了解有助於維護並開發新的功能，以下逐一介紹選制並把各選制特殊的商業邏輯一併補上。

如對任一選舉有疑惑可以查看[中選會選舉資料庫](https://db.cec.gov.tw/ElecTable/Election?type=President)以查看各年度選舉資料長相。

### 總統

總統選制為全國選民統一針對多組候選人(總統候選人＋副總統候選人為一組)進行單組勝出的投票。

> 專案中一組候選人統一以提名政黨為其政黨名稱。

- 選舉範圍：全國
- 勝出人數：全國一組
- 各地圖/篩選層級：全國 > 縣市 > 鄉鎮市區 > 村里 (皆為行政區)

### 立法委員

立法委員選制主要分成區域、山地原住民、平地原住民和不分區政黨票四種方式共同決定立法院所有席次的分配，以下逐一介紹。

> electinConfig 中有五種，主要是多了手機版特別呈現全立委席次分佈的全國立委子類別 (key: 'all')，並非實際子類別。

#### 區域立法委員

區域立委由各縣市向下劃分１到多個選區，選區由一個到多個鄉鎮市區所組成，單一鄉鎮市區有可能被拆成兩個選區 (ex: 台北市松山區北松山南松山為不同選區)，選區以下則是村里 (桌機版的選區地圖是由村里透過 mapping 表組成)。

各縣市內的各選區內選民針對該選區的多位候選人進行單人勝出的投票，也就是單一選區只會有一人勝選。

- 選舉範圍：縣市各選區
- 勝出人數：各選區一人
- 各地圖/篩選層級：縣市 > 選區 > 村里 (選區不是一般行政區)

#### 山地原住民、平地原住民立法委員 (兩子分類合併介紹)

原住民立法委員又分成山地和平地原住民，兩者皆為全國山地和平地原住民選民針對各自的多位候選人投票選出多位立法委員。

- 選舉範圍：全國
- 勝出人數：全國多位 (看該年該子選舉類別有幾席)
- 各地圖/篩選層級：全國 > 縣市 > 鄉鎮市區 > 村里 (皆為行政區)

#### 不分區政黨

不分區立委由全國選民針對多個政黨投票，得出第一階段各政黨得票率，而第一階段得票佔比少於 5% 的政黨將會淘汰並將其票數按比例分給未被淘汰的政黨，得出第二階段各政黨得票率，最後依照得票率來分配不分區政黨的固定席次，得出最後政黨分配席次。

> 選舉模板中只會呈現第一階段得票率和最終各政黨獲得的席次數量，也就是人民直接投票的結果和最終席次分配。

- 選舉範圍：全國
- 勝出政黨：多個政黨，按比例分配席次
- 各地圖/篩選層級：全國 > 縣市 > 鄉鎮市區 > 村里 (皆為行政區)

### 縣市首長

縣市首長(包含直轄市長、縣市長)為各縣市選民針對多位候選人進行單人勝出的投票。

- 選舉範圍：縣市
- 勝出人數：各縣市一人
- 各地圖/篩選層級：全國 > 縣市 > 鄉鎮市區 > 村里 (皆為行政區)

### 縣市議員

縣市議員選制主要分成區域、平地原住民、山地原住民三種方式來共同決定該縣市議會所有席次的分配，本專案因平地原住民和山地原住民選區互相不重疊，因此簡化分類為區域和原住民兩種類別，以下逐一介紹。

### 區域縣市議員

區域縣市議員由各縣市向下劃分 1 到多個選區，選區由一到多個鄉鎮市區所組成，不像區域立法委員，區域縣市議員的選區沒有將鄉鎮市區拆分成兩個以上的選區。

> 雖然選區是由鄉鎮市區組成，但在開發當下因時程較趕以及不夠熟悉地圖資料的合成等技術，因此在選舉模板地圖版中仍是以行政區為主要的瀏覽方式，未來若有時間應將區域縣市議員改為選區地圖的呈現方式，不過後端生成的選舉資料也會需要重新產生。

各縣市內的各選區內的選民針對該選區的多位候選人進行多人勝出(視各選區分配席次而有所不同)的投票，也就是單一選區多人勝選。

- 選舉範圍：各縣市個選區
- 勝出人數：各選區多人
- 各地圖/篩選層級：縣市 > 鄉鎮市區 > 村里 (皆為行政區)

### 原住民議員

原住民議員包含山地和平地原住民議員，只要各縣市中有對應的原住民選民就會有對應的議員選區，一個行政區(上至縣市、小至村里)都有可能同時有山地或平地的原住民選區、有其中一種原住民選區或是都沒有原住民選區(離島)，因此在地圖呈現上較為複雜，因此直接採用行政區的方式瀏覽並針對上述情形一一呈現對應的資料。

原住民選區(兩種類別)內的對應類別原住民選民針對多位候選人進行 1 到多人勝出(視各選區分配席次而有所不同)的投票，也就是單一選區 1 至多人勝選。

- 選舉範圍：具有山地或平地原住民選區的縣市中的選區
- 勝出人數：各選區 1 至多人
- 各地圖/篩選層級：縣市 > 鄉鎮市區 > 村里 (皆為行政區)

### 全國性公投

全國性公投以公投案號為單位，全國選民針對每一個公投案投下同意或是不同意票，最後決定公投通過與否。

- 選舉範圍：全國
- 勝出： 通過/不通過
- 各地圖/篩選層級：全國 > 縣市 > 鄉鎮市區 > 村里 (選區為行政區)

## 新年度修改方式
