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
const FolderPath = parsedArgs.FolderPath

if (!FolderPath) {
  throw new Error(
    `required param 'FolderPath' not provided\n ex: node script.js FolderPath=./map-mapping/district-with-area/legislator/csv/`
  )
}

const inputPath = FolderPath
const outputPath = `${FolderPath}//output/`

// Loop through each file in inputPath
fs.readdirSync(inputPath).forEach((fileName) => {
  console.log(fileName)
  // Use to generate json file
  // fileName be like 'election_dist_2020'
  const subFolderName = fileName.split('.')[0].split('_')[2] + '/'
  // Path to each CSV file
  const filePath = inputPath + fileName

  const rawVillages = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  console.log('rawVillages count', rawVillages.length)

  const normalizedVillages = rawVillages.map((rawVillage) => ({
    countyCode: rawVillage.countycode,
    countyName: rawVillage.countyname,
    areaCode: rawVillage.areaCode,
    areaName: `第${rawVillage.areaCode.slice(-2)}選區`,
    areaNickName: rawVillage.area_nickname,
    townCode: rawVillage.towncode,
    townName: rawVillage.townname,
    villCode: rawVillage.villcode,
    villName: rawVillage.villname,
  }))

  // 過濾空行，可與下面的 loop 合併，不過為了可讀性所以分開進行 (其實是懶)
  const filterVillages = normalizedVillages.filter((village) => {
    const {
      countyCode,
      countyName,
      areaCode,
      areaName,
      areaNickName,
      villCode,
      villName,
    } = village
    if (
      countyCode &&
      countyName &&
      areaCode &&
      areaName &&
      areaNickName &&
      villCode &&
      villName
    ) {
      return true
    } else {
      // 過濾 csv 空行
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
  const counstituencyObj = {
    ...rawObj,
    nickName: '',
    type: 'constituency',
  }
  const villageObj = {
    ...rawObj,
    type: 'village',
    sub: null,
  }

  const countryMap = {}
  // store all district (county, area, village) code mapping to district name
  const districtCodeToName = {}
  const areaCodeToNickName = {}

  filterVillages.forEach((village) => {
    const {
      countyCode,
      countyName,
      areaCode,
      areaName,
      areaNickName,
      villCode,
      villName,
    } = village

    if (!countryMap[countyCode]) {
      countryMap[countyCode] = {}
      districtCodeToName[countyCode] = countyName
    }
    if (!countryMap[countyCode][areaCode]) {
      countryMap[countyCode][areaCode] = {}
      districtCodeToName[areaCode] = areaName
      areaCodeToNickName[areaCode] = areaNickName
    }
    if (!countryMap[countyCode][areaCode][villCode]) {
      countryMap[countyCode][areaCode][villCode] = {}
      districtCodeToName[villCode] = villName
    }

    countryMap[countyCode][areaCode][villCode] = village
  })

  countryObj.sub = Object.keys(countryMap).map((countyCode) => {
    const countyMap = countryMap[countyCode]
    return {
      ...countyObj,
      code: countyCode,
      name: districtCodeToName[countyCode],
      // 這個 county 下所有的選區
      sub: Object.keys(countyMap).map((areaCode) => {
        const areaMap = countyMap[areaCode]
        // console.log(subs)
        return {
          ...counstituencyObj,
          code: areaCode,
          name: districtCodeToName[areaCode],
          nickName: areaCodeToNickName[areaCode],
          // 這個選區下所有的村裡
          sub: Object.keys(areaMap).map((villageCode) => {
            const village = areaMap[villageCode]
            return {
              ...villageObj,
              code: village.villCode,
              name: village.villName,
              nickName: village.townName + ' ' + village.villName,
            }
          }),
        }
      }),
    }
  })

  const outputVillageCodes = []
  const outputConstituencies = []
  countryObj.sub.forEach((countyObj) => {
    countyObj.sub.forEach((counstituencyObj) => {
      outputConstituencies.push(counstituencyObj)
      outputVillageCodes.push(
        ...counstituencyObj.sub.map((villageObj) => villageObj.code)
      )
    })
  })
  console.log('output area count', outputConstituencies.length)
  console.log('output villages count', outputVillageCodes.length)

  const missingVillages = filterVillages.filter((village) => {
    return outputVillageCodes.includes(village)
  })
  console.log(missingVillages)
  // 有重複的village...

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
          .sort((areaObj1, areaObj2) => {
            return Number(areaObj1.code) - Number(areaObj2.code)
          })
          .map((areaObj) => {
            const newAreaObj = {
              ...areaObj,
              sub: [...areaObj.sub].sort((villObj1, villObj2) => {
                return Number(villObj1.code) - Number(villObj2.code)
              }),
            }
            return newAreaObj
          }),
      }
      newSub[newSubIndex] = newCountyObj
      return newSub
    }, []),
  }

  const outputFilePath = outputPath + subFolderName + 'mapping.json'

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath)
  }

  if (!fs.existsSync(outputPath + subFolderName)) {
    fs.mkdirSync(outputPath + subFolderName)
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(outputCountryObj))
})
