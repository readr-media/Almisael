import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import evc from '@readr-media/react-election-votes-comparison'
import { json } from 'd3'
import { feature } from 'topojson'

const DataLoader = evc.DataLoader

import { mockData as presidentCountry } from '../mock-datas/maps/presidents/2020_president_country'
import { mockData as presidentCounty } from '../mock-datas/maps/presidents/2020_president_county_63000'
import { mockData as presidentTown } from '../mock-datas/maps/presidents/2020_president_town_63000010'

import { mockData as councilmanCounty } from '../mock-datas/maps/councilmen/2018_councilmen_county_63000'
import { mockData as CouncilmanConstituency } from '../mock-datas/maps/councilmen/2018_councilmen_constituency_6300001'

import { mockData as legislatorCounty } from '../mock-datas/maps/legislators/2020_legislator_county_63000'
import { mockData as legislatorConstituency } from '../mock-datas/maps/legislators/2020_legislator_constituency_6300001'

const gcsBaseUrl = 'https://whoareyou-gcs.readr.tw/elections-dev'

const fetchEVCData = async (year, electionType, district) => {
  const dataLoader = new DataLoader({
    apiUrl: gcsBaseUrl,
    year,
    type: electionType,
    district,
  })
  return await dataLoader.loadData()
}

const fetchMayorMapData = async ({
  electionType,
  year,
  folderName,
  fileName,
}) => {
  const mapDataUrl = `${gcsBaseUrl}/${year}/${electionType}/map/${folderName}/${fileName}.json`
  const { data } = await axios.get(mapDataUrl)
  return data
}
const fetchReferendumMapData = async ({
  electionType,
  year,
  folderName,
  fileName,
  number,
}) => {
  const mapDataUrl = `${gcsBaseUrl}/${year}/${electionType}/map/${number}/${folderName}/${fileName}.json`
  const { data } = await axios.get(mapDataUrl)
  return data
}

const elections = [
  {
    electionType: 'president',
    electionName: '總統',
    years: [{ year: 2020 }, { year: 2016 }, { year: 2012 }],
    levels: [
      {
        //level 0 country
        mapJson: 'tw_country.topojson',
        electionDatas: 'president_country.json',
      },
      {
        //level 1 county
        mapJson: 'tw_county_63000.topojson',
        electionDatas: 'president_county_63000.json',
      },
      {
        //level 2 town
        mapJson: 'tw_town_63000010.topojson',
        electionDatas: 'president_town_63000010.json',
      },
      {
        //level 3 village
        mapJson: 'tw_vill_63000010010.topojson',
        electionDatas: null,
      },
    ],
  },
  {
    electionType: 'mayor',
    electionName: '縣市首長',
    years: [{ year: 2022 }, { year: 2018 }, { year: 2014 }, { year: 2010 }],
    meta: {
      evc: { district: 'all' },
      map: {
        folderNames: {
          0: '',
          1: 'county',
          2: 'town',
        },
        fileNames: {
          0: 'country',
          1: '',
          2: '',
        },
      },
    },
  },
  {
    electionType: 'legislator',
    electionName: '立法委員',
    subType: ['區域', '原住民'],
    years: [{ year: 2020 }, { year: 2016 }, { year: 2012 }],
    seats: { wrapperTitle: '立法委員席次圖', componentTitle: '立法委員選舉' },
    levels: [
      {
        //level 0 country
        mapJson: 'tw_country.topojson',
        electionDatas: null,
      },
      {
        // level 1 county
        mapJson: 'tw_county_63000.topojson',
        electionDatas: 'legislator_county_63000.json',
      },
      {
        // level 2 constituency
        mapJson: 'tw_town_63000010.topojson',
        electionDatas: 'legislator_constituency_63000010.json',
      },
      {
        // level 3 village
        mapJson: 'tw_vill_63000010010.topojson',
        electionDatas: null,
      },
    ],
  },
  {
    electionType: 'legislator-party',
    electionName: '立法委員（不分區）',
    years: [{ year: 2020 }, { year: 2016 }, { year: 2012 }],
    seats: { wrapperTitle: '立法委員席次圖', componentTitle: '立法委員選舉' },
    levels: [
      {
        //level 0 country
        mapJson: 'tw_country.topojson',
        electionDatas: null,
      },
      {
        // level 1 county
        mapJson: 'tw_county_63000.topojson',
        electionDatas: 'legislator_county_63000.json',
      },
      {
        // level 2 constituency
        mapJson: 'tw_town_63000010.topojson',
        electionDatas: 'legislator_constituency_63000010.json',
      },
      {
        // level 3 village
        mapJson: 'tw_vill_63000010010.topojson',
        electionDatas: null,
      },
    ],
  },
  {
    electionType: 'councilman',
    subType: ['區域', '原住民'],
    electionName: '縣市議員',
    years: [{ year: 2022 }, { year: 2018 }, { year: 2014 }, { year: 2010 }],
    seats: { wrapperTitle: '縣市議員席次圖', componentTitle: '議員選舉' },
    levels: [
      {
        //level 0 country
        mapJson: 'tw_country.topojson',
        electionDatas: null,
      },
      {
        // level 1 county
        mapJson: 'tw_county_63000.topojson',
        electionDatas: 'councilmen_county_63000.json',
      },
      {
        // level 2 constituency
        mapJson: 'tw_town_63000010.topojson',
        electionDatas: 'councilmen_constituency_63000010.json',
      },
      {
        // level 3 village
        mapJson: 'tw_vill_63000010010.topojson',
        electionDatas: null,
      },
    ],
  },
  {
    electionType: 'referendum',
    electionName: '全國性公民投票',
    years: [
      { year: 2022, number: ['F1'] },
      { year: 2021, number: ['20', '19', '18', '17'] },
      {
        year: 2018,
        number: ['16', '15', '14', '13', '12', '11', '10', '9', '8', '7'],
      },
    ],
    meta: {
      evc: { district: 'all' },
      map: {
        folderNames: {
          0: '',
          1: 'county',
          2: 'town',
        },
        fileNames: {
          0: 'country',
          1: '',
          2: '',
        },
      },
    },
  },
  {
    electionType: 'referendum-local',
    electionName: '地方性公民投票',
    years: [{ year: 2021, number: ['Hsinchu-1'] }],
    levels: [
      {
        //level 0 country
        mapJson: 'tw_country.topojson',
        electionDatas: null,
      },
      {
        // level 1 county
        mapJson: 'tw_county_63000.topojson',
        electionDatas: 'legislator_county_63000.json',
      },
      {
        // level 2 constituency
        mapJson: 'tw_town_63000010.topojson',
        electionDatas: 'legislator_constituency_63000010.json',
      },
      {
        // level 3 village
        mapJson: 'tw_vill_63000010010.topojson',
        electionDatas: null,
      },
    ],
  },
]

const defaultMapObject = {
  level: 0,
  currentFeature: null,
  countyId: '',
  countyName: '',
  townId: '',
  townName: '',
  villageId: '',
  villageName: '',
  constituencyId: '',
  constituencyName: '',
  activeId: '',
  upperLevelId: 'background',
}

const defaultMapData = { 0: null, 1: null, 2: null }
const defaultElectionMapData = elections.reduce((obj, election) => {
  obj[election.electionType] = { ...defaultMapData }
  return obj
}, {})

export const useElectionData = (showLoading) => {
  const [election, setElection] = useState(elections[1])
  const [mapGeoJsons, setMapGeoJsons] = useState()

  const [electionMapData, setElectionMapData] = useState({
    ...defaultElectionMapData,
  })
  const [evcData, setEvcData] = useState()
  const [infoboxData, setInfoboxData] = useState({})

  const [mapObject, setMapObject] = useState(defaultMapObject)
  const [shouldRefetch, setShouldRefetch] = useState(false)

  const mapData = electionMapData[election.electionType]
  const year = election.years[0].year

  const prepareGeojsons = useCallback(async () => {
    const twCountiesJson =
      'https://whoareyou-gcs.readr.tw/taiwan-map/taiwan-map-counties.json'
    const twTownsJson =
      'https://whoareyou-gcs.readr.tw/taiwan-map/taiwan-map-towns.json'
    const twVillagesJson =
      'https://whoareyou-gcs.readr.tw/taiwan-map/taiwan-map-villages.json'
    try {
      const responses = await Promise.allSettled([
        json(twCountiesJson),
        json(twTownsJson),
        json(twVillagesJson),
      ])
      const mapJsons = responses.map((response) => response.value)

      const [countiesTopoJson, townsTopoJson, villagesTopoJson] = mapJsons

      const counties = feature(
        countiesTopoJson,
        countiesTopoJson.objects.counties
      )
      const towns = feature(townsTopoJson, townsTopoJson.objects.towns)
      const villages = feature(
        villagesTopoJson,
        villagesTopoJson.objects.villages
      )
      return { counties, towns, villages }
    } catch (error) {
      console.error('fetch map error', error)
    }
  }, [])

  const prepareElectionData = useCallback(
    async (election, mapObject, mapData, evcData, year) => {
      let newMapData = mapData
      let newEvcData = evcData
      const { level } = mapObject
      const { electionType } = election
      const newInfoboxData = {
        electionType,
        level: mapObject.level,
      }

      switch (electionType) {
        case 'president':
          newMapData = {
            0: presidentCountry,
            1: presidentCounty,
            2: presidentTown,
          }

          switch (level) {
            case 0:
              newInfoboxData.electionData = newMapData[0].summary
              break
            case 1:
              newInfoboxData.electionData = newMapData[0].districts.find(
                (district) => district.county === mapObject.activeId
              )
              // dev
              if (!newInfoboxData.electionData) {
                newInfoboxData.electionData = newMapData[0].districts[0]
              }
              break
            case 2:
              newInfoboxData.electionData = newMapData[1].districts.find(
                (district) =>
                  district.county + district.town === mapObject.activeId
              )
              // dev
              if (!newInfoboxData.electionData) {
                newInfoboxData.electionData = newMapData[1].districts[0]
              }
              break
            case 3:
              newInfoboxData.electionData = newMapData[2].districts.find(
                (district) =>
                  district.county + district.town + district.vill ===
                  mapObject.activeId
              )
              // dev
              if (!newInfoboxData.electionData) {
                newInfoboxData.electionData = newMapData[2].districts[0]
              }
              break

            default:
              break
          }
          break
        case 'mayor':
          switch (level) {
            case 0: {
              if (!newEvcData) {
                try {
                  const data = await fetchEVCData(
                    year,
                    electionType,
                    election.meta.evc.district
                  )
                  newEvcData = data
                } catch (error) {
                  console.error(error)
                }
              }
              if (!newMapData[0]) {
                console.log('fetching country data')
                try {
                  const data = await fetchMayorMapData({
                    electionType,
                    year,
                    folderName: election.meta.map.folderNames[level],
                    fileName: election.meta.map.fileNames[level],
                  })
                  newMapData = { ...newMapData, 0: data }
                } catch (error) {
                  console.error(error)
                }
              }
              break
            }
            case 1: {
              const { countyId } = mapObject
              if (!newMapData[1] || !newMapData[1][countyId]) {
                console.log('fetching county data')
                if (countyId !== '10020') {
                  try {
                    const data = await fetchMayorMapData({
                      electionType,
                      year,
                      folderName: election.meta.map.folderNames[level],
                      fileName: countyId,
                    })
                    const countyData = { ...newMapData[1], [countyId]: data }
                    newMapData = { ...newMapData, 1: countyData }
                  } catch (error) {
                    console.error(error)
                  }
                } else {
                  console.log('pass 嘉義市選舉資料')
                }
              }

              newInfoboxData.electionData = newMapData[0]?.districts.find(
                (district) => district.county === mapObject.activeId
              )
              break
            }
            case 2: {
              const { townId, countyId } = mapObject

              if (!newMapData[2] || !newMapData[2][townId]) {
                console.log('fetching town data')
                const countyId = townId.slice(0, 5)
                if (countyId !== '10020') {
                  try {
                    const data = await fetchMayorMapData({
                      electionType,
                      year,
                      folderName: election.meta.map.folderNames[level],
                      fileName: townId,
                    })
                    const townData = { ...newMapData[2], [townId]: data }
                    newMapData = { ...newMapData, 2: townData }
                  } catch (error) {
                    console.error(error)
                  }
                } else {
                  console.log('pass 嘉義市選舉資料')
                }
              }
              try {
                newInfoboxData.electionData = newMapData[1][
                  countyId
                ]?.districts.find(
                  (district) =>
                    district.county + district.town === mapObject.activeId
                )
              } catch (error) {
                console.log(
                  `mayor no data for county: ${countyId}, error: `,
                  error
                )
              }
              break
            }
            case 3: {
              const { townId } = mapObject
              try {
                newInfoboxData.electionData = newMapData[2][
                  townId
                ].districts.find(
                  (district) =>
                    district.county + district.town + district.vill ===
                    mapObject.activeId
                )
              } catch (error) {
                console.log(`mayor no data for town: ${townId}, error: `, error)
              }
              break
            }

            default:
              break
          }
          break
        case 'legislator':
          newMapData = {
            0: null,
            1: legislatorCounty,
            2: legislatorConstituency,
          }

          switch (mapObject.level) {
            case 0:
              break
            case 1:
              newInfoboxData.electionData = newMapData[1]
              break
            case 2:
              newInfoboxData.electionData = newMapData[1].districts.find(
                (district) =>
                  district.county + district.area + '0' === mapObject.activeId
              )
              // dev
              if (!newInfoboxData.electionData) {
                newInfoboxData.electionData = newMapData[1].districts[0]
              }
              break
            case 3:
              newInfoboxData.electionData = newMapData[2].districts.find(
                (district) =>
                  district.county + district.area + '0' + district.vill ===
                  mapObject.activeId
              )
              // dev
              if (!newInfoboxData.electionData) {
                newInfoboxData.electionData = newMapData[2].districts[0]
              }
              break

            default:
              break
          }

          break
        case 'councilman':
          newMapData = {
            0: null,
            1: councilmanCounty,
            2: CouncilmanConstituency,
          }

          switch (mapObject.level) {
            case 0:
              break
            case 1:
              newInfoboxData.electionData = newMapData[1]
              break
            case 2:
              newInfoboxData.electionData = newMapData[1].districts.find(
                (district) =>
                  district.county + district.area + '0' === mapObject.activeId
              )
              // dev
              if (!newInfoboxData.electionData) {
                newInfoboxData.electionData = newMapData[1].districts[0]
              }
              break
            case 3:
              newInfoboxData.electionData = newMapData[2].districts.find(
                (district) =>
                  district.county + district.area + '0' + district.vill ===
                  mapObject.activeId
              )
              // dev
              if (!newInfoboxData.electionData) {
                newInfoboxData.electionData = newMapData[2].districts[0]
              }
              break

            default:
              break
          }

          break
        case 'referendum':
          switch (level) {
            case 0: {
              if (!newEvcData) {
                try {
                  const data = await fetchEVCData(
                    year,
                    electionType,
                    election.meta.evc.district
                  )
                  newEvcData = data
                } catch (error) {
                  console.error(error)
                }
              }
              if (!newMapData[0]) {
                console.log('fetching country data')
                try {
                  const data = await fetchReferendumMapData({
                    electionType,
                    year,
                    folderName: election.meta.map.folderNames[level],
                    fileName: election.meta.map.fileNames[level],
                    number: 'F1',
                  })
                  newMapData = { ...newMapData, 0: data }
                } catch (error) {
                  console.error(error)
                }
              }
              //dev
              newInfoboxData.electionData = newMapData[0].summary
              break
            }
            case 1: {
              const { countyId } = mapObject
              if (!newMapData[1] || !newMapData[1][countyId]) {
                console.log('fetching county data')
                try {
                  const data = await fetchReferendumMapData({
                    electionType,
                    year,
                    folderName: election.meta.map.folderNames[level],
                    fileName: countyId,
                    number: 'F1',
                  })
                  const countyData = { ...newMapData[1], [countyId]: data }
                  newMapData = { ...newMapData, 1: countyData }
                  console.log(newMapData)
                } catch (error) {
                  console.error(error)
                }
              }

              newInfoboxData.electionData = newMapData[0].districts.find(
                (district) => district.county === mapObject.activeId
              )
              break
            }
            case 2: {
              const { townId, countyId } = mapObject

              if (!newMapData[2] || !newMapData[2][townId]) {
                console.log('fetching town data')
                try {
                  const data = await fetchReferendumMapData({
                    electionType,
                    year,
                    folderName: election.meta.map.folderNames[level],
                    fileName: townId,
                    number: 'F1',
                  })
                  console.log('data', data)
                  const townData = { ...newMapData[2], [townId]: data }
                  newMapData = { ...newMapData, 2: townData }
                } catch (error) {
                  console.error(error)
                }
              }

              try {
                newInfoboxData.electionData = newMapData[1][
                  countyId
                ].districts.find(
                  (district) =>
                    district.county + district.town === mapObject.activeId
                )
              } catch (error) {
                console.log(
                  `referendum no data for town: ${countyId}, error: `,
                  error
                )
              }

              break
            }
            case 3: {
              const { townId } = mapObject
              try {
                newInfoboxData.electionData = newMapData[2][
                  townId
                ].districts.find(
                  (district) =>
                    district.county + district.town + district.vill ===
                    mapObject.activeId
                )
              } catch (error) {
                console.log(
                  `referendum no data for town: ${townId}, error: `,
                  error
                )
              }
              break
            }

            default:
              break
          }
          break

        default:
          break
      }

      showLoading(false)
      return { newInfoboxData, newMapData, newEvcData }
    },
    [showLoading]
  )

  const onElectionChange = (e) => {
    const electionType = e.target.value
    setElection(
      elections.find((election) => election.electionType === electionType)
    )
    setElectionMapData({ ...defaultElectionMapData })
    setMapObject(defaultMapObject)
    setInfoboxData({})
    setEvcData()
    showLoading(true)
  }

  const onMapObjectChange = async (newMapObject = defaultMapObject) => {
    // fetch data before map scales, useEffect will called prepareData again,
    // make sure to avoid fetch duplicate data
    const { newInfoboxData, newMapData, newEvcData } =
      await prepareElectionData(
        election,
        newMapObject,
        electionMapData[election.electionType],
        evcData,
        year
      )
    setInfoboxData(newInfoboxData)
    setElectionMapData((oldData) => ({
      ...oldData,
      [election.electionType]: newMapData,
    }))
    setEvcData(newEvcData)
    setMapObject(newMapObject)
  }

  useEffect(() => {
    showLoading(true)
    Promise.allSettled([
      prepareElectionData(election, mapObject, mapData, evcData, year),
      mapGeoJsons ? undefined : prepareGeojsons(),
    ]).then((results) => {
      if (results[0]?.value) {
        const { newInfoboxData, newMapData, newEvcData } = results[0].value
        setInfoboxData(newInfoboxData)
        setElectionMapData((oldData) => ({
          ...oldData,
          [election.electionType]: newMapData,
        }))
        setEvcData(newEvcData)
      }
      if (results[1]?.value) {
        const newMapGeoJsons = results[1].value
        setMapGeoJsons(newMapGeoJsons)
      }
      showLoading(false)
    })
  }, [
    election,
    evcData,
    mapObject,
    prepareElectionData,
    mapData,
    mapGeoJsons,
    prepareGeojsons,
    showLoading,
    year,
  ])

  // create interval to periodically trigger refetch and let react lifecycle to handle the refetch
  useEffect(() => {
    const interval = setInterval(() => {
      setShouldRefetch(true)
    }, 3 * 60 * 1000)
    // }, 6 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const refetch = async () => {
      console.log('refetch data..')
      showLoading(true)
      const { level, activeId } = mapObject
      const newMapData = { ...defaultMapData }
      const { electionType } = election
      let newEvcData
      for (let currentLevel = 0; currentLevel <= level; currentLevel++) {
        switch (electionType) {
          case 'mayor': {
            switch (currentLevel) {
              case 0: {
                try {
                  const data = await fetchEVCData(
                    year,
                    electionType,
                    election.meta.evc.district
                  )
                  newEvcData = data
                } catch (error) {
                  console.error(error)
                }

                try {
                  const data = await fetchMayorMapData({
                    electionType,
                    year,
                    folderName: election.meta.map.folderNames[currentLevel],
                    fileName: 'country',
                  })
                  newMapData[0] = data
                } catch (error) {
                  console.error(error)
                }
                break
              }
              case 1: {
                const countyId = activeId.slice(0, 5)
                try {
                  const data = await fetchMayorMapData({
                    electionType,
                    year,
                    folderName: election.meta.map.folderNames[currentLevel],
                    fileName: countyId,
                  })
                  const countyData = { [countyId]: data }
                  newMapData[1] = countyData
                } catch (error) {
                  console.error(error)
                }
                break
              }
              case 2: {
                const townId = activeId.slice(0, 8)
                try {
                  const data = await fetchMayorMapData({
                    electionType,
                    year,
                    folderName: election.meta.map.folderNames[currentLevel],
                    fileName: townId,
                  })
                  const townData = { [townId]: data }
                  newMapData[2] = townData
                } catch (error) {
                  console.error(error)
                }

                break
              }

              default:
                break
            }
            break
          }
          case 'referendum': {
            switch (currentLevel) {
              case 0: {
                try {
                  const data = await fetchEVCData(year, electionType, 'all')
                  newEvcData = data
                } catch (error) {
                  console.error(error)
                }

                try {
                  const data = await fetchReferendumMapData({
                    electionType,
                    year,
                    folderName: election.meta.map.folderNames[currentLevel],
                    fileName: election.meta.map.fileNames[currentLevel],
                    number: 'F1',
                  })
                  newMapData[0] = data
                } catch (error) {
                  console.error(error)
                }
                break
              }
              case 1: {
                const countyId = activeId.slice(0, 5)
                try {
                  const data = await fetchReferendumMapData({
                    electionType,
                    year,
                    folderName: election.meta.map.folderNames[currentLevel],
                    fileName: countyId,
                    number: 'F1',
                  })
                  const countyData = { [countyId]: data }
                  newMapData[1] = countyData
                } catch (error) {
                  console.error(error)
                }
                break
              }
              case 2: {
                const townId = activeId.slice(0, 8)
                try {
                  const data = await fetchReferendumMapData({
                    electionType,
                    year,
                    folderName: election.meta.map.folderNames[currentLevel],
                    fileName: townId,
                    number: 'F1',
                  })
                  const townData = { [townId]: data }
                  newMapData[2] = townData
                } catch (error) {
                  console.error(error)
                }
                break
              }

              default:
                break
            }
            break
          }

          default:
            break
        }
      }
      setElectionMapData(() => ({
        ...defaultElectionMapData,
        [election.electionType]: newMapData,
      }))
      setEvcData(newEvcData)
      setShouldRefetch(false)
      showLoading(false)
    }
    if (shouldRefetch) {
      refetch()
    }
  }, [
    shouldRefetch,
    mapObject,
    election.electionType,
    showLoading,
    election,
    year,
  ])

  // console.log(
  //   'election\n',
  //   election,
  //   '\nelectionMapData\n',
  //   electionMapData,
  //   '\nmapData\n',
  //   mapData,
  //   '\ninfoboxData\n',
  //   infoboxData,
  //   '\nmapObject\n',
  //   mapObject
  // )

  return {
    electionNamePairs: elections.map(({ electionType, electionName }) => ({
      electionType,
      electionName,
    })),
    onElectionChange,
    election,
    mapData,
    infoboxData,
    evcData,
    mapObject,
    setMapObject: onMapObjectChange,
    mapGeoJsons,
  }
}
