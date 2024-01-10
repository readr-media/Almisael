scripts 資料夾下為本專案輔助使用的 scripts，主要用來製作專案所需的 json 資料。

## mapping json

mapping json 的出現是為了因應選舉模板從原本的桌機手機都是地圖控制器來觀看選情，演變成手機版改成使用篩選器選取縣市或是各行政區來觀看選舉資料，為了要讓各層級的篩選器知道一個上層的層級選擇之後，下一個層級的篩選器有哪些可以選擇的資料，就需要一個行政區之間的對照表，而因應選制的不同，層級對照表又分成純粹行政區的對照表(全國>縣市>鄉鎮市區>村里)和行政區暨選區對照表(全國>縣市>選區>村里)兩種。

而為了讓篩選器的模式(手機版)和地圖(桌機版)一致，因此在製作篩選器的時候就會需要使用同樣的行政區資料，所幸，地圖的 topojson 本身就包含了所以上至全國下至村里的行政區資料，只要透過代碼來比對各層級之間的從屬關係，即可製作。

兩者的格式類同，以下以 district-mapping.json 的結構來示意：

不難發現資料是遞迴的結構，每一層都有相同的 properties，並含有名為 `sub` 的 property 來掌握下一層級的訊息，直到最下層的村里。

```json
{
  "code": "",
  "name": "台灣",
  "type": "nation",
  "sub": [
    {
      "code": "63000",
      "name": "臺北市",
      "type": "county",
      "sub": [
        {
          "code": "63000010",
          "name": "松山區",
          "type": "town",
          "sub": [
            {
              "code": "63000010002",
              "name": "莊敬里",
              "type": "village",
              "sub": null
            },
            {
              "code": "63000010003",
              "name": "東榮里",
              "type": "village",
              "sub": null
            }
          ]
        }
      ]
    }
  ]
}
```

以下依照兩種類型分別介紹兩種 mapping.json 的製作方式。

### district-mapping.json 製作

`scripts/map-mapping/district` 資料夾包含了 `input/`, `output/` 和 `create-district-map-mapping.js` 三個項目，其中 `input/` 中已經存放了當前使用版本的 tw-villages.json，只要在這個資料夾中呼叫以下 command 即可產生。

reference: [圖資位置](<https://console.cloud.google.com/storage/browser/whoareyou-gcs.readr.tw/taiwan-map?pageState=(%22StorageObjectListTable%22:(%22f%22:%22%255B%255D%22))&project=mirrorlearning-161006&prefix=&forceOnObjectsSortingFiltering=false>)

```shell
node create-district-map-mapping.js FilePath=./input/tw-villages.json
# tw-villages.json 為當前圖資檔名，若有變動須改變檔案名稱。
```

> 因為地圖在 2024 大選前已經優化成將村里、鄉鎮市區、縣市、全國圖資合成同樣一份，因此實際在 gcs 上拿的圖資會是不同檔案，但裡面關於縣市、鄉鎮市區和村里的資料和目前 input 資料夾中的是一致的。 未來若地圖因應行政區變動而更新，則需要以新的圖資來製作新的 mapping 表。 到時可能也會需要修改 `ate-district-map-mapping.js` 的內容。

產生的 mapping.json 需上傳至 gcs 上的對應資料夾，上傳位置：[link](<https://console.cloud.google.com/storage/browser/whoareyou-gcs.readr.tw/elections-dev/district-mapping/district?pageState=(%22StorageObjectListTable%22:(%22f%22:%22%255B%255D%22))&project=mirrorlearning-161006&prefix=&forceOnObjectsSortingFiltering=false>)

> gcs 上選舉相關的資料分成 dev 和 prod，記得兩邊都有上傳一次 mapping.json

### district-with-area.json 製作

目前因為只有立法委員的選制需要行政區暨選區對照表，因此在 `scripts/map-mapping/district-with-area/` 中只有一個 `legislator/` 的資料夾，且其擁有專屬的 script 來製作立法委員選區的對照表。

因為立法委員的選區是每次選舉都會略有變動，不像行政區本身相對變動較小(其實行政區也是逐年有些微變動，但除非是像五都升級直轄市等巨大變動，差異不大，可以隔久一點再以最新的行政區地圖來更新就好)，因此要製作對照表就會需要每年的選區資訊，`legislator/` 資料夾下的 `csv/` 資料夾中有當前使用的選區資訊。

> 未來的年份就需要新增對應的選區資訊，需要請後端或是數據記者協助產生

reference: [選區資訊](https://github.com/readr-data/election_history/tree/master/map_mapping/legislator)

在使用選區資訊前，為了方便 node.js 處理，先透過 `scripts/turn-csvs-into-jsons.js` 來將 csv 檔案轉成 json 檔，在 `scritps/` 資料夾呼叫如下 command (其他位置應修改傳入的相對路徑)：

```shell
node turn-csvs-into-jsons.js FolderPath=map-mapping/district-with-area/legislator/csv/
# 此處傳入的是 folder，也就是說整個資料夾內的 csv 檔都會被轉完 json 檔。
```

執行完畢後就會在 `legislator/` 中看到 `output/` 資料夾，裡面會是轉換完的 jsons，接下來的步驟尚未指令化，需要手動把這批 json 移動到 `legislator/input/` 資料夾中，並在 `legislator/` 資料夾下執行以下 command：

```shell
node create-legislator-constituency-map-mapping.js FolderPath=input/
```

就會在 `legislator/input/output/` 資料夾中得到各個年份的行政區暨選區對照表， `output/` 中已經設計好依照年份的資料夾放置，只要把這些年份資料夾上傳到 gcs 相對應的位置就完成了。

gcs district-with-area folder 上傳位置：[link](<https://console.cloud.google.com/storage/browser/whoareyou-gcs.readr.tw/elections-dev/district-mapping/district-with-area/legislator?pageState=(%22StorageObjectListTable%22:(%22f%22:%22%255B%255D%22))&project=mirrorlearning-161006&prefix=&forceOnObjectsSortingFiltering=false>)

> gcs 上選舉相關的資料分成 dev 和 prod，記得兩邊都有上傳一次各年份 mapping.json

#### district-with-area.json 同樣會應用在選區地圖

如同手機版篩選器會使用到行政區暨選區對照表，桌機版的地圖同樣需要額外製作每個年份的選區地圖，這個部分請參照地圖相關的介紹章節，這邊要說明的是只有行政區暨選區對照表是手機和桌機版兩者都會需要使用的。
