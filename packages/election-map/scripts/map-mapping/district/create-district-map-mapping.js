/**
 * 本 script 主要產生選舉模板手機版 filter 需要的行政區對照表 (各縣市->各鄉鎮市區->各村裡)
 * input: 台灣村裡 topojson objects.villages.geometries
 * ouput: 行政區對照表
 *
 * note: 日後更新地圖 geojson 的話需要重新更新 input 檔案，目前檔案為 (2024年選舉用)
 */

const fs = require('fs')

// get param subFolderPath
const args = process.argv.slice(2)

// Parse command-line arguments into an object
const parsedArgs = args.reduce((acc, arg) => {
  const [key, value] = arg.split('=')
  acc[key] = value
  return acc
}, {})

// Access the variable
const filePath = parsedArgs.FilePath

if (!filePath) {
  throw new Error(
    `required param 'FilePath' not provided\n ex: node script.js filePath=legislator`
  )
}

const twVillagesTopojson = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
const rawVillages = twVillagesTopojson.objects.villages.geometries.map(
  (geometry) => geometry.properties
)

console.log('rawVillages count', rawVillages.length)

// 過濾特殊資料，像是為 "NOTE": "未編定村里"，可與下面的 loop 合併，不過為了可讀性所以分開進行 (其實是懶)
const filterVillages = rawVillages.filter((village) => {
  const { COUNTYCODE, COUNTYNAME, TOWNCODE, TOWNNAME, VILLCODE, VILLNAME } =
    village
  if (
    COUNTYCODE &&
    COUNTYNAME &&
    TOWNCODE &&
    TOWNNAME &&
    VILLCODE &&
    VILLNAME
  ) {
    return true
  } else {
    // 基本上是一堆未編定村里的 village，可開啟以下 log 來看被過濾的資料
    // console.log(village)
  }
})

console.log('filterVillages count', filterVillages.length)

const rawObj = {
  code: '',
  name: '',
  type: '',
  sub: [],
}
const countryObj = {
  ...rawObj,
  name: '台灣',
  type: 'nation',
}
const countyObj = {
  ...rawObj,
  type: 'county',
}
const townObj = {
  ...rawObj,
  type: 'town',
}
const villageObj = {
  ...rawObj,
  type: 'village',
  sub: null,
}

const countryMap = {}
// store all district (county, town, village) code mapping to district name
const districtCodeToName = {}

filterVillages.forEach((village) => {
  const { COUNTYCODE, COUNTYNAME, TOWNCODE, TOWNNAME, VILLCODE, VILLNAME } =
    village

  if (!countryMap[COUNTYCODE]) {
    countryMap[COUNTYCODE] = {}
    districtCodeToName[COUNTYCODE] = COUNTYNAME
  }
  if (!countryMap[COUNTYCODE][TOWNCODE]) {
    countryMap[COUNTYCODE][TOWNCODE] = {}
    districtCodeToName[TOWNCODE] = TOWNNAME
  }
  if (!countryMap[COUNTYCODE][TOWNCODE][VILLCODE]) {
    countryMap[COUNTYCODE][TOWNCODE][VILLCODE] = {}
    districtCodeToName[VILLCODE] = VILLNAME
  }

  countryMap[COUNTYCODE][TOWNCODE][VILLCODE] = village
})

countryObj.sub = Object.keys(countryMap).map((COUNTYCODE) => {
  const countyMap = countryMap[COUNTYCODE]
  return {
    ...countyObj,
    code: COUNTYCODE,
    name: districtCodeToName[COUNTYCODE],
    // 這個 county 下所有的 towns
    sub: Object.keys(countyMap).map((TOWNCODE) => {
      const townMap = countyMap[TOWNCODE]
      // console.log(subs)
      return {
        ...townObj,
        code: TOWNCODE,
        name: districtCodeToName[TOWNCODE],
        // 這個 town 下所有的 villages
        sub: Object.keys(townMap).map((VILLAGECODE) => {
          const village = townMap[VILLAGECODE]
          return {
            ...villageObj,
            code: village.VILLCODE,
            name: village.VILLNAME,
          }
        }),
      }
    }),
  }
})

// reorder the subs
// console.log(countryObj.sub.map((countyObj) => countyObj.name))

/**
 * 中選會行政區順序
 * 縣市：直轄市 (北到南) -> 縣 (本島 -> 離島，同類型依照 countyCode 排序) ->市  (本島 -> 離島，同類型依照 countyCode 排序)
 * 鄉鎮市區：依照 townCode 排序
 * 選區：依照 areaCode 排序
 * 村里：依照 villCode 排序
 */
const countyNamesInOrder = [
  '臺北市',
  '新北市',
  '桃園市',
  '臺中市',
  '臺南市',
  '高雄市',
  '宜蘭縣',
  '新竹縣',
  '苗栗縣',
  '彰化縣',
  '南投縣',
  '雲林縣',
  '嘉義縣',
  '屏東縣',
  '臺東縣',
  '花蓮縣',
  '澎湖縣',
  '連江縣',
  '金門縣',
  '基隆市',
  '新竹市',
  '嘉義市',
]

// countryObj with sorted sub for each level
const outputCountryObj = {
  ...countryObj,
  sub: countryObj.sub.reduce((newSub, countyObj) => {
    const newSubIndex = countyNamesInOrder.findIndex(
      (countyName) => countyName === countyObj.name
    )
    const newCountyObj = {
      ...countyObj,
      sub: [...countyObj.sub]
        .sort((townObj1, townObj2) => {
          return Number(townObj1.code) - Number(townObj2.code)
        })
        .map((townObj) => {
          const newTownObj = {
            ...townObj,
            sub: [...townObj.sub].sort((villObj1, villObj2) => {
              return Number(villObj1.code) - Number(villObj2.code)
            }),
          }
          return newTownObj
        }),
    }
    newSub[newSubIndex] = newCountyObj
    return newSub
  }, []),
}

if (!fs.existsSync('./output')) {
  fs.mkdirSync('./output')
}

fs.writeFileSync('./output/mapping.json', JSON.stringify(outputCountryObj))
