const topojson = require('topojson')
const fs = require('fs')

// 讀取 topojson 檔案
const tw = JSON.parse(fs.readFileSync('tw-villages.json', 'utf-8'))
const mapping = JSON.parse(fs.readFileSync('mapping.json', 'utf-8'))

const countyCode = '63000'
const countyMappingObj = mapping.sub.find(
  (countyObj) => countyObj.code === countyCode
)

const initialGeoJson = {
  type: 'FeatureCollection',
  features: [],
}

initialGeoJson.features = countyMappingObj.sub.map((areaMappingObj) => {
  const areaVillsCode = areaMappingObj.sub.map((villObj) => villObj.code)
  const villGeometries = tw.objects.villages.geometries.filter((geometry) =>
    areaVillsCode.includes(geometry.properties.VILLCODE)
  )
  const feature = topojson.merge(tw, villGeometries)
  return feature
})

// 將縣市資料加入 topojson 檔案
fs.writeFileSync('./merged-areas.json', JSON.stringify(initialGeoJson))
