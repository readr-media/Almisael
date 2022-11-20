import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import evc from '@readr-media/react-election-votes-comparison'
import { json } from 'd3'
import { feature } from 'topojson'
import {
  generateDefaultElectionsData,
  getElectionData,
  updateElectionsData,
  defaultElectionData,
} from '../components/helper/electionData'
import {
  defaultElectionType,
  currentYear,
  elections,
  getReferendumNumbers,
  countyMappingData,
} from '../components/helper/election'
import { deepCloneObj } from '../components/helper/helper'

const DataLoader = evc.DataLoader

import { mockData as presidentCountry } from '../mock-datas/maps/presidents/2020_president_country'
import { mockData as presidentCounty } from '../mock-datas/maps/presidents/2020_president_county_63000'
import { mockData as presidentTown } from '../mock-datas/maps/presidents/2020_president_town_63000010'

import { mockData as legislatorCounty } from '../mock-datas/maps/legislators/2020_legislator_county_63000'
import { mockData as legislatorConstituency } from '../mock-datas/maps/legislators/2020_legislator_constituency_6300001'

const gcsBaseUrl = 'https://whoareyou-gcs.readr.tw/elections-dev'

const fetchSeatData = async ({
  electionType,
  yearKey,
  folderName,
  fileName,
}) => {
  const seatDataUrl = `${gcsBaseUrl}/${yearKey}/${electionType}/seat/${folderName}/${fileName}.json`
  const { data } = await axios.get(seatDataUrl)
  return data
}

const fetchMayorEvcData = async ({ yearKey }) => {
  const loader = new DataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
  const data = await loader.loadMayorData({
    year: yearKey,
  })
  return data
}

const fetchReferendumEvcData = async ({ yearKey }) => {
  const loader = new DataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
  const data = await loader.loadReferendumData({
    year: yearKey,
  })
  return data
}

const fetchCouncilMemberEvcData = async ({ yearKey, district, subtypeKey }) => {
  const loader = new DataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
  const data = await loader.loadCouncilMemberDataForElectionMapProject({
    year: yearKey,
    district,
    includes:
      subtypeKey === 'normal'
        ? ['normal']
        : ['plainIndigenous', 'mountainIndigenous'],
  })

  return data
}

const fetchMayorMapData = async ({
  electionType,
  yearKey,
  folderName,
  fileName,
}) => {
  const mapDataUrl = `${gcsBaseUrl}/${yearKey}/${electionType}/map/${folderName}/${fileName}.json`
  const { data } = await axios.get(mapDataUrl)
  return data
}
const fetchReferendumMapData = async ({
  electionType,
  yearKey,
  folderName,
  fileName,
  numberKey,
}) => {
  const mapDataUrl = `${gcsBaseUrl}/${yearKey}/${electionType}/map/${numberKey}/${folderName}/${fileName}.json`
  const { data } = await axios.get(mapDataUrl)
  return data
}

const fetchCouncilMemberMapData = async ({
  electionType,
  yearKey,
  subtypeKey,
  folderName,
  fileName,
}) => {
  const mapDataUrl = `${gcsBaseUrl}/${yearKey}/${electionType}/map/${folderName}/${subtypeKey}/${fileName}.json`
  const { data } = await axios.get(mapDataUrl)
  return data
}

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

const defaultElectionsData = generateDefaultElectionsData()

const defaultCompareInfo = {
  compareMode: false,
  filter: {
    year: null,
    subtype: null,
    number: null,
  },
}

export const useElectionData = (showLoading, showTutorial) => {
  const [election, setElection] = useState(
    elections.find((election) => election.electionType === defaultElectionType)
  )
  const [electionsData, setElectionsData] = useState(
    deepCloneObj(defaultElectionsData)
  )
  const [mapGeoJsons, setMapGeoJsons] = useState()
  const [infoboxData, setInfoboxData] = useState({})

  const [mapObject, setMapObject] = useState(defaultMapObject)
  const [shouldRefetch, setShouldRefetch] = useState(false)

  const [year, setYear] = useState(election.years[0])
  //for councilMember, legislator
  const [subtype, setSubtype] = useState(
    election.subtypes?.find((subtype) => subtype.key === 'normal')
  )
  //for referendum, referendumLocal
  const [number, setNumber] = useState(
    election.years[0].numbers && election.years[0].numbers[0]
  )
  const [evcScrollTo, setEvcScrollTo] = useState()
  const [lastUpdate, setLastUpdate] = useState()

  const [compareInfoboxData, setCompareInfoboxData] = useState({})
  const [compareInfo, setCompareInfo] = useState(defaultCompareInfo)
  const electionData = getElectionData(
    electionsData,
    election.electionType,
    year?.key,
    subtype?.key,
    number?.key
  )

  const compareElectionData =
    compareInfo.compareMode &&
    getElectionData(
      electionsData,
      election.electionType,
      compareInfo.filter.year?.key,
      compareInfo.filter.subtype?.key,
      compareInfo.filter.number?.key
    )

  console.log(
    'compareInfo',
    compareInfo,
    'compareElectionData',
    compareElectionData
  )

  const { mapData, evcData, seatData } = electionData
  const { mapData: compareMapData } = compareElectionData || {}

  const subtypes = election.subtypes
  const numbers = getReferendumNumbers(election)

  const prepareGeojsons = useCallback(async () => {
    const twCountiesJson =
      'https://whoareyou-gcs.readr.tw/taiwan-map/taiwan_map_counties.json'
    const twTownsJson =
      'https://whoareyou-gcs.readr.tw/taiwan-map/taiwan_map_towns.json'
    const twVillagesJson =
      'https://whoareyou-gcs.readr.tw/taiwan-map/taiwan_map_villages_20220902.json'

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
    async (
      electionData,
      election,
      mapObject,
      yearKey,
      subtypeKey,
      numberKey,
      lastUpdate,
      compareMode
    ) => {
      let newElectionData = electionData
      let {
        mapData: newMapData,
        evcData: newEvcData,
        seatData: newSeatData,
      } = newElectionData
      let newLastUpdate = lastUpdate
      const { level: currentLevel, townId, countyId } = mapObject
      const { electionType } = election
      const newInfoboxData = {
        electionType,
        level: currentLevel,
      }

      for (let level = 0; level <= currentLevel; level++) {
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
            if (yearKey === 2022 && countyId === '10020') {
              // 2022 chiayi city postpond the mayor election
              newInfoboxData.electionData = '10020'
              break
            }
            switch (level) {
              case 0:
                if (!newEvcData[level] && !compareMode) {
                  try {
                    const data = await fetchMayorEvcData({
                      yearKey,
                    })
                    newEvcData[level] = data
                  } catch (error) {
                    console.error(error)
                  }
                }
                if (!newMapData[level]) {
                  try {
                    const data = await fetchMayorMapData({
                      electionType,
                      yearKey,
                      folderName: election.meta.map.folderNames[level],
                      fileName: election.meta.map.fileNames[level],
                    })
                    newMapData[level] = data
                    newMapData.isRunning = data.is_running
                    newLastUpdate = data.updatedAt
                  } catch (error) {
                    console.error(error)
                  }
                }
                break
              case 1:
                if (!newMapData[level][countyId]) {
                  try {
                    const data = await fetchMayorMapData({
                      electionType,
                      yearKey,
                      folderName: election.meta.map.folderNames[level],
                      fileName: countyId,
                    })
                    newMapData[level][countyId] = data
                    newMapData.isRunning = data.is_running
                    newLastUpdate = data.updatedAt
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[0]?.districts.find(
                  (district) => district.county === mapObject.activeId
                )
                newInfoboxData.isRunning = newMapData.isRunning
                break
              case 2:
                if (!newMapData[level][townId]) {
                  try {
                    const data = await fetchMayorMapData({
                      electionType,
                      yearKey,
                      folderName: election.meta.map.folderNames[level],
                      fileName: townId,
                    })
                    newMapData[level][townId] = data
                    newMapData.isRunning = data.is_running
                    newLastUpdate = data.updatedAt
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[1][
                  countyId
                ]?.districts.find(
                  (district) =>
                    district.county + district.town === mapObject.activeId
                )
                newInfoboxData.isRunning = newMapData.isRunning
                break
              case 3:
                newInfoboxData.electionData = newMapData[2][
                  townId
                ]?.districts.find(
                  (district) =>
                    district.county + district.town + district.vill ===
                    mapObject.activeId
                )
                newInfoboxData.isRunning = newMapData.isRunning
                break

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
          case 'councilMember':
            switch (level) {
              case 0:
                break
              case 1:
                if (!newEvcData[level][countyId] && !compareMode) {
                  try {
                    const data = await fetchCouncilMemberEvcData({
                      yearKey,
                      district: countyMappingData.find(
                        (countyData) => countyData.countyCode === countyId
                      ).countyNameEng,
                      subtypeKey,
                    })
                    newEvcData[level][countyId] = data
                  } catch (error) {
                    console.error(error)
                  }
                }

                if (!newSeatData[level][countyId] && !compareMode) {
                  try {
                    console.log('prepare... fetchSeatData', compareMode)
                    const data = await fetchSeatData({
                      electionType,
                      yearKey,
                      folderName: 'county',
                      fileName: countyId,
                    })
                    newSeatData[level][countyId] = data
                  } catch (error) {
                    console.error(error)
                  }
                }

                if (!newMapData[level][countyId]) {
                  try {
                    const data = await fetchCouncilMemberMapData({
                      electionType,
                      yearKey,
                      subtypeKey,
                      folderName: election.meta.map.folderNames[level],
                      fileName: countyId,
                    })
                    newMapData[level][countyId] = data
                    newMapData.isRunning = data.is_running
                    newLastUpdate = data.updatedAt
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[1][countyId]?.summary
                newInfoboxData.isRunning = newMapData.isRunning
                break
              case 2:
                if (!newMapData[2][townId]) {
                  try {
                    const data = await fetchCouncilMemberMapData({
                      electionType,
                      yearKey,
                      subtypeKey,
                      folderName: election.meta.map.folderNames[level],
                      fileName: townId,
                    })
                    newMapData[level][townId] = data
                    newMapData.isRunning = data.is_running
                    newLastUpdate = data.updatedAt
                  } catch (error) {}
                }
                newInfoboxData.electionData = newMapData[1][
                  countyId
                ]?.districts.filter(
                  (district) =>
                    district.county + district.town === mapObject.activeId
                )
                newInfoboxData.isRunning = newMapData.isRunning
                break
              case 3:
                newInfoboxData.electionData = newMapData[2][
                  townId
                ]?.districts.filter(
                  (district) =>
                    district.county + district.town + district.vill ===
                    mapObject.activeId
                )
                newInfoboxData.isRunning = newMapData.isRunning
                break

              default:
                break
            }

            break
          case 'referendum':
            switch (level) {
              case 0:
                if (!newEvcData[level] && !compareMode) {
                  try {
                    const data = await fetchReferendumEvcData({
                      yearKey,
                    })
                    newEvcData[level] = data
                  } catch (error) {
                    console.error(error)
                  }
                }
                if (!newMapData[level]) {
                  try {
                    const data = await fetchReferendumMapData({
                      electionType,
                      yearKey,
                      folderName: election.meta.map.folderNames[level],
                      fileName: election.meta.map.fileNames[level],
                      numberKey,
                    })
                    newMapData[level] = data
                    newMapData.isRunning = data.is_running
                    newLastUpdate = data.updatedAt
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[0]?.summary
                newInfoboxData.isRunning = newMapData.isRunning
                break
              case 1:
                if (!newMapData[level][countyId]) {
                  try {
                    const data = await fetchReferendumMapData({
                      electionType,
                      yearKey,
                      folderName: election.meta.map.folderNames[level],
                      fileName: countyId,
                      numberKey,
                    })
                    newMapData[level][countyId] = data
                    newMapData.isRunning = data.is_running
                    newLastUpdate = data.updatedAt
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[0]?.districts.find(
                  (district) => district.county === mapObject.activeId
                )
                newInfoboxData.isRunning = newMapData.isRunning
                break
              case 2:
                if (!newMapData[level][townId]) {
                  try {
                    const data = await fetchReferendumMapData({
                      electionType,
                      yearKey,
                      folderName: election.meta.map.folderNames[level],
                      fileName: townId,
                      numberKey,
                    })
                    newMapData[level][townId] = data
                    newMapData.isRunning = data.is_running
                    newLastUpdate = data.updatedAt
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[1][
                  countyId
                ]?.districts.find(
                  (district) =>
                    district.county + district.town === mapObject.activeId
                )
                newInfoboxData.isRunning = newMapData.isRunning

                break
              case 3:
                newInfoboxData.electionData = newMapData[2][
                  townId
                ]?.districts.find(
                  (district) =>
                    district.county + district.town + district.vill ===
                    mapObject.activeId
                )
                newInfoboxData.isRunning = newMapData.isRunning

                break

              default:
                break
            }
            break

          default:
            break
        }
      }

      return {
        newElectionData,
        newInfoboxData,
        newLastUpdate,
      }
    },
    []
  )

  const refetch = useCallback(
    async (
      newElectionData,
      election,
      mapObject,
      yearKey,
      subtypeKey,
      numberKey,
      newLastUpdate,
      compareMode
    ) => {
      console.log('refetch data..')
      const { level: currentLevel, townId, countyId } = mapObject
      const { electionType } = election
      let {
        mapData: newMapData,
        evcData: newEvcData,
        seatData: newSeatData,
      } = newElectionData
      for (let level = 0; level <= currentLevel; level++) {
        switch (electionType) {
          case 'mayor': {
            switch (level) {
              case 0:
                if (!compareMode) {
                  try {
                    const data = await fetchMayorEvcData({
                      yearKey,
                    })
                    newEvcData[level] = data
                  } catch (error) {
                    console.error(error)
                  }
                }

                try {
                  const data = await fetchMayorMapData({
                    electionType,
                    yearKey,
                    folderName: election.meta.map.folderNames[level],
                    fileName: 'country',
                  })
                  newMapData[level] = data
                  newMapData.isRunning = data.is_running
                  newLastUpdate = data.updatedAt
                } catch (error) {
                  console.error(error)
                }
                break
              case 1:
                if (countyId === '10020') {
                  break
                }
                try {
                  const data = await fetchMayorMapData({
                    electionType,
                    yearKey,
                    folderName: election.meta.map.folderNames[level],
                    fileName: countyId,
                  })
                  newMapData[level][countyId] = data
                  newMapData.isRunning = data.is_running
                  newLastUpdate = data.updatedAt
                } catch (error) {
                  console.error(error)
                }
                break
              case 2:
                if (countyId === '10020') {
                  break
                }
                try {
                  const data = await fetchMayorMapData({
                    electionType,
                    yearKey,
                    folderName: election.meta.map.folderNames[level],
                    fileName: townId,
                  })
                  newMapData[level][townId] = data
                  newMapData.isRunning = data.is_running
                  newLastUpdate = data.updatedAt
                } catch (error) {
                  console.error(error)
                }
                break

              default:
                break
            }
            break
          }
          case 'councilMember': {
            switch (level) {
              case 0:
                break
              case 1:
                if (!compareMode) {
                  try {
                    const data = await fetchCouncilMemberEvcData({
                      yearKey,
                      district: countyMappingData.find(
                        (countyData) => countyData.countyCode === countyId
                      ).countyNameEng,
                      subtypeKey,
                    })
                    newEvcData[level][countyId] = data
                  } catch (error) {
                    console.error(error)
                  }
                  try {
                    console.log('refetch fetchSeatData', compareMode)
                    const data = await fetchSeatData({
                      electionType,
                      yearKey,
                      folderName: 'county',
                      fileName: countyId,
                    })
                    newSeatData[level][countyId] = data
                  } catch (error) {
                    console.error(error)
                  }
                }
                try {
                  const data = await fetchCouncilMemberMapData({
                    electionType,
                    yearKey,
                    subtypeKey,
                    folderName: election.meta.map.folderNames[level],
                    fileName: countyId,
                  })
                  newMapData[level][countyId] = data
                  newMapData.isRunning = data.is_running
                  newLastUpdate = data.updatedAt
                } catch (error) {
                  console.error(error)
                }
                break
              case 2:
                try {
                  const data = await fetchCouncilMemberMapData({
                    electionType,
                    yearKey,
                    subtypeKey,
                    folderName: election.meta.map.folderNames[level],
                    fileName: townId,
                  })
                  newMapData[level][townId] = data
                  newMapData.isRunning = data.is_running
                  newLastUpdate = data.updatedAt
                } catch (error) {
                  console.error(error)
                }
                break

              default:
                break
            }
            break
          }
          case 'referendum': {
            switch (level) {
              case 0:
                if (!compareMode) {
                  try {
                    const data = await fetchReferendumEvcData({
                      yearKey,
                    })
                    newEvcData[level] = data
                  } catch (error) {
                    console.error(error)
                  }
                }

                try {
                  const data = await fetchReferendumMapData({
                    electionType,
                    yearKey,
                    folderName: election.meta.map.folderNames[level],
                    fileName: election.meta.map.fileNames[level],
                    numberKey,
                  })
                  newMapData[level] = data
                  newMapData.isRunning = data.is_running
                  newLastUpdate = data.updateAt
                } catch (error) {
                  console.error(error)
                }
                break
              case 1:
                try {
                  const data = await fetchReferendumMapData({
                    electionType,
                    yearKey,
                    folderName: election.meta.map.folderNames[level],
                    fileName: countyId,
                    numberKey,
                  })
                  newMapData[level][countyId] = data
                  newMapData.isRunning = data.is_running
                  newLastUpdate = data.updatedAt
                } catch (error) {
                  console.error(error)
                }
                break
              case 2:
                try {
                  const data = await fetchReferendumMapData({
                    electionType,
                    yearKey,
                    folderName: election.meta.map.folderNames[level],
                    fileName: townId,
                    numberKey,
                  })
                  newMapData[level][townId] = data
                  newMapData.isRunning = data.is_running
                  newLastUpdate = data.updatedAt
                } catch (error) {
                  console.error(error)
                }
                break

              default:
                break
            }
            break
          }

          default:
            break
        }
      }
      return { newElectionData, newLastUpdate }
    },
    []
  )

  const scrollEvcFromMapObject = (
    electionType,
    mapData,
    subtypeKey,
    mapObject,
    yearKey
  ) => {
    let newScrollTo
    switch (electionType) {
      case 'mayor': {
        const countyCode = mapObject.countyId
        if (countyCode) {
          const countyData = countyMappingData?.find(
            (countyData) => countyData.countyCode === countyCode
          )

          if (!(yearKey === 2022 && countyData.countyName === '嘉義市')) {
            newScrollTo = countyData.countyName
          }
        }
        break
      }

      case 'councilMember': {
        // try to get scrollTo, but ignore any error
        // ignore 原住民分類
        if (subtypeKey === 'normal') {
          try {
            const countyMapData = mapData[1][mapObject.countyId]
            const targetDistrict = countyMapData?.districts.find(
              (district) => district.county + district.town === mapObject.townId
            )
            if (targetDistrict) {
              newScrollTo = `第${targetDistrict.area}選區`
            }
          } catch (error) {
            console.log(error)
          }
        }
        break
      }
      case 'referendum': {
        // no need to handle
        break
      }
      default:
        break
    }
    return newScrollTo
  }

  const onEvcSelected = useCallback(
    (evcSelectedValue) => {
      const electionType = election.electionType
      switch (electionType) {
        case 'mayor': {
          // evcSelectedValue format '嘉義市'
          const countyData = countyMappingData?.find(
            (countyData) => countyData.countyName === evcSelectedValue
          )
          const target = document.querySelector(
            `#first-id-${countyData.countyCode}`
          )
          let event = new MouseEvent('click', { bubbles: true })
          target.dispatchEvent(event)

          break
        }

        case 'councilMember': {
          // evcSelectedValue format '第01選區'
          //find the fist town of the area from mapData
          // ignore 原住民分類
          if (subtype.key === 'normal') {
            const countyMapData = mapData[1][mapObject.countyId]
            const targetDistrict = countyMapData?.districts?.find(
              (district) => district.area === evcSelectedValue.slice(1, 3)
            )
            const townId = targetDistrict?.county + targetDistrict?.town
            const target = document.querySelector(`#first-id-${townId}`)
            if (target) {
              let event = new MouseEvent('click', { bubbles: true })
              target.dispatchEvent(event)
            }
          }

          break
        }
        case 'referendum': {
          // evcSelectedValue format '全國'
          const target = document.querySelector(`#first-id-background`)
          if (target) {
            let event = new MouseEvent('click', { bubbles: true })
            target.dispatchEvent(event)
          }

          break
        }
        default:
          break
      }
    },
    [election.electionType, mapData, subtype, mapObject.countyId]
  )

  const onSubtypeChange = (newSubtype) => {
    const { seatData } = getElectionData(
      electionsData,
      election.electionType,
      year?.key,
      subtype?.key,
      number?.key
    )
    const newElectionData = getElectionData(
      electionsData,
      election.electionType,
      year?.key,
      newSubtype?.key,
      number?.key
    )
    updateElectionsData(
      electionsData,
      (newElectionData.seatData = seatData),
      election.electionType,
      year?.key,
      subtype?.key,
      number?.key
    )
    setSubtype(newSubtype)
  }

  const onCompareInfoChange = useCallback(
    ({ compareMode, compareYearKey, compareNumber }) => {
      if (compareMode) {
        setCompareInfo(defaultCompareInfo)
      }
      console.log(
        'onCompareInfoChange',
        compareMode,
        compareYearKey,
        compareNumber,
        number
      )
      setCompareInfo({
        compareMode,
        filter: {
          year: compareYearKey
            ? election.years.find((year) => year.key === compareYearKey)
            : year,
          subtype,
          number: compareNumber || number,
        },
      })
    },
    [election.years, number, subtype, year]
  )

  const onNumberChange = useCallback(
    (newNumber) => {
      const year = election.years.find((year) => year.key === newNumber.year)
      setYear(year)
      setNumber(newNumber)
    },
    [election.years]
  )

  const onElectionChange = useCallback(
    (electionType) => {
      const newElection = elections.find(
        (election) => election.electionType === electionType
      )
      const newYear = newElection.years[0]
      const newNumber =
        newElection.years[0].numbers && newElection.years[0].numbers[0]
      const newSubtype = newElection.subtypes?.find(
        (subtype) => subtype.key === 'normal'
      )

      setElection(newElection)
      setYear(newYear)
      setNumber(newNumber)
      setSubtype(newSubtype)
      setElectionsData((electionsData) => {
        const electionData = getElectionData(
          electionsData,
          electionType,
          newYear?.key,
          newSubtype?.key,
          newNumber?.key
        )
        if (electionData.mapData.isRunning) {
          updateElectionsData(
            electionsData,
            deepCloneObj(defaultElectionData),
            electionType,
            newYear?.key,
            newSubtype?.key,
            newNumber?.key
          )
        } else {
          return electionsData
        }
      })
      setMapObject(defaultMapObject)
      setInfoboxData({})
      setEvcScrollTo(undefined)
      setCompareInfo(defaultCompareInfo)
      showLoading(true)
    },
    [showLoading]
  )

  const onMapObjectChange = async (newMapObject = defaultMapObject) => {
    // fetch data before map scales, useEffect will call prepareData again,
    // make sure to avoid fetch duplicate data
    showLoading(true)
    const { filter } = compareInfo
    console.log(
      'onMapObjectChange',
      compareElectionData,
      election,
      mapObject,
      filter?.year?.key,
      filter?.subtype?.key,
      filter?.number?.key,
      lastUpdate
    )
    const [
      { value: electionDataResult },
      { value: compareElectionDataResult },
    ] = await Promise.allSettled([
      prepareElectionData(
        electionData,
        election,
        newMapObject,
        year?.key,
        subtype?.key,
        number?.key,
        lastUpdate,
        compareInfo?.compareMode
      ),
      compareInfo.compareMode
        ? prepareElectionData(
            compareElectionData,
            election,
            mapObject,
            filter?.year?.key,
            filter?.subtype?.key,
            filter?.number?.key,
            lastUpdate,
            compareInfo?.compareMode
          )
        : Promise.resolve({}),
    ])

    let newElectionsData = electionsData
    if (electionDataResult.newElectionData) {
      const { newElectionData, newInfoboxData, newLastUpdate } =
        electionDataResult
      setInfoboxData(newInfoboxData)
      newElectionsData = updateElectionsData(
        newElectionsData,
        newElectionData,
        election.electionType,
        year?.key,
        subtype?.key,
        number?.key
      )

      if (!compareInfo.compareMode) {
        setEvcScrollTo(
          scrollEvcFromMapObject(
            election.electionType,
            newElectionData.mapData,
            subtype?.key,
            newMapObject,
            year?.key
          )
        )
      }
      if (year?.key === currentYear) {
        setLastUpdate(newLastUpdate)
      }
    }

    if (compareElectionDataResult.newElectionData) {
      const { newElectionData, newInfoboxData, newLastUpdate } =
        compareElectionDataResult
      setCompareInfoboxData(newInfoboxData)
      newElectionsData = updateElectionsData(
        newElectionsData,
        newElectionData,
        election.electionType,
        filter?.year?.key,
        filter?.subtype?.key,
        filter?.number?.key
      )
      if (filter?.key === currentYear) {
        setLastUpdate(newLastUpdate)
      }
    }

    setElectionsData(newElectionsData)
    setMapObject(newMapObject)
    showLoading(false)
  }

  const onTutorialEnd = () => {
    onElectionChange('mayor')
  }

  useEffect(() => {
    const prepareDataHandler = async () => {
      showLoading(true)
      const { filter } = compareInfo
      const [
        { value: mapGeoJsonsResult },
        { value: electionDataResult },
        { value: compareElectionDataResult },
      ] = await Promise.allSettled([
        mapGeoJsons ? Promise.resolve(false) : prepareGeojsons(),
        prepareElectionData(
          electionData,
          election,
          mapObject,
          year?.key,
          subtype?.key,
          number?.key,
          lastUpdate,
          compareInfo?.compareMode
        ),
        compareInfo.compareMode
          ? prepareElectionData(
              compareElectionData,
              election,
              mapObject,
              filter?.year?.key,
              filter?.subtype?.key,
              filter?.number?.key,
              lastUpdate,
              compareInfo?.compareMode
            )
          : Promise.resolve({}),
      ])
      if (mapGeoJsonsResult) {
        const newMapGeoJsons = mapGeoJsonsResult
        setMapGeoJsons(newMapGeoJsons)
      }

      let newElectionsData = electionsData
      if (electionDataResult.newElectionData) {
        const { newElectionData, newInfoboxData, newLastUpdate } =
          electionDataResult
        setInfoboxData(newInfoboxData)
        newElectionsData = updateElectionsData(
          newElectionsData,
          newElectionData,
          election.electionType,
          year?.key,
          subtype?.key,
          number?.key
        )
        if (!compareInfo.compareMode) {
          setEvcScrollTo(
            scrollEvcFromMapObject(
              election.electionType,
              newElectionData.mapData,
              subtype?.key,
              mapObject,
              year?.key
            )
          )
        }
        if (year?.key === currentYear) {
          setLastUpdate(newLastUpdate)
        }
      }
      if (compareElectionDataResult.newElectionData) {
        console.log('wtf', compareElectionDataResult)
        const { newElectionData, newInfoboxData, newLastUpdate } =
          compareElectionDataResult
        setCompareInfoboxData(newInfoboxData)
        newElectionsData = updateElectionsData(
          newElectionsData,
          newElectionData,
          election.electionType,
          filter?.year?.key,
          filter?.subtype?.key,
          filter?.number?.key
        )
        if (filter?.key === currentYear) {
          setLastUpdate(newLastUpdate)
        }
      }
      setElectionsData(newElectionsData)
      showLoading(false)
    }

    prepareDataHandler()
  }, [
    compareElectionData,
    compareInfo,
    election,
    electionData,
    electionsData,
    lastUpdate,
    mapGeoJsons,
    mapObject,
    number?.key,
    prepareElectionData,
    prepareGeojsons,
    showLoading,
    subtype?.key,
    year?.key,
  ])

  // create interval to periodically trigger refetch and let react lifecycle to handle the refetch
  useEffect(() => {
    const interval = setInterval(() => {
      setShouldRefetch(true)
    }, 100 * 60 * 1000)
    // }, 1 * 60 * 1000)
    // }, 10 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const refetchHandler = async () => {
      showLoading(true)

      const { filter } = compareInfo
      console.log('refetchHandler')
      const normalRefetch = refetch(
        deepCloneObj(defaultElectionData),
        election,
        mapObject,
        year?.key,
        subtype?.key,
        number?.key,
        lastUpdate,
        compareInfo?.compareMode
      )
      const compareRefetch = compareInfo.compareMode
        ? refetch(
            deepCloneObj(defaultElectionData),
            election,
            mapObject,
            filter.year?.key,
            filter.subtype?.key,
            filter.number?.key,
            lastUpdate,
            compareInfo?.compareMode
          )
        : Promise.resolve({})
      const [{ value: normalResult }, { value: compareResult }] =
        await Promise.allSettled([
          // mapData.isRunning ? normalRefetch : Promise.resolve({}),
          normalRefetch,
          // compareMapData.isRunning ? compareRefetch : Promise.resolve({}),
          compareRefetch,
        ])
      let newElectionsData = electionsData
      if (normalResult.newElectionData) {
        const { newElectionData, newLastUpdate } = normalResult

        newElectionsData = updateElectionsData(
          newElectionsData,
          newElectionData,
          election.electionType,
          year?.key,
          subtype?.key,
          number?.key
        )
        if (year?.key === currentYear && newElectionData) {
          setLastUpdate(newLastUpdate)
        }
      }
      if (compareResult.newElectionData) {
        const { newElectionData, newLastUpdate } = compareResult

        newElectionsData = updateElectionsData(
          newElectionsData,
          newElectionData,
          election.electionType,
          filter?.year?.key,
          filter?.subtype?.key,
          filter?.number?.key
        )
        if (filter.year?.key === currentYear && newElectionData) {
          setLastUpdate(newLastUpdate)
        }
      }

      setElectionsData(newElectionsData)

      setShouldRefetch(false)
      showLoading(false)
    }
    if (shouldRefetch) {
      refetchHandler()
    }
  }, [
    compareInfo,
    compareMapData?.isRunning,
    election,
    electionsData,
    lastUpdate,
    mapData.isRunning,
    mapObject,
    number?.key,
    refetch,
    shouldRefetch,
    showLoading,
    subtype?.key,
    year?.key,
  ])

  useEffect(() => {
    if (showTutorial) {
      onElectionChange('councilMember')
    }
  }, [showTutorial, onElectionChange])

  let outputEvcData
  if (election.electionType === 'councilMember') {
    outputEvcData = evcData[1][mapObject.countyId]
  } else {
    outputEvcData = evcData[0]
  }
  let outputSeatData
  if (election.electionType === 'councilMember') {
    outputSeatData = seatData[1][mapObject.countyId]
  }
  const subtypeInfo = subtype && {
    subtype,
    subtypes,
    onSubtypeChange,
  }
  const yearInfo = {
    year,
    years: election.years,
    onYearChange: setYear,
  }
  const numberInfo = {
    number,
    numbers,
    onNumberChange,
  }
  const outputCompareInfo = {
    ...compareInfo,
    onCompareInfoChange,
  }

  return {
    onElectionChange,
    election,
    mapData,
    compareMapData,
    mapObject,
    setMapObject: onMapObjectChange,
    infoboxData,
    compareInfoboxData,
    evcInfo: {
      evcData: outputEvcData,
      onEvcSelected,
      scrollTo: evcScrollTo,
    },
    seatData: outputSeatData,
    mapGeoJsons,
    onTutorialEnd,
    yearInfo,
    subtypeInfo,
    numberInfo,
    compareInfo: outputCompareInfo,
    lastUpdate,
  }
}
