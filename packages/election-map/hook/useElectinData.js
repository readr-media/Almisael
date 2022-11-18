import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import evc from '@readr-media/react-election-votes-comparison'
import { json } from 'd3'
import { feature } from 'topojson'
import {
  countyMappingData,
  defaultElectionType,
  elections,
  deepCloneObj,
  generateDefaultElectionMapData,
  getMapData,
  updateElectionMapData,
  currentYear,
  defaultMapData,
  getReferendumNumbers,
} from '../components/helper/electionHelper'

const DataLoader = evc.DataLoader

import { mockData as presidentCountry } from '../mock-datas/maps/presidents/2020_president_country'
import { mockData as presidentCounty } from '../mock-datas/maps/presidents/2020_president_county_63000'
import { mockData as presidentTown } from '../mock-datas/maps/presidents/2020_president_town_63000010'

import { mockData as legislatorCounty } from '../mock-datas/maps/legislators/2020_legislator_county_63000'
import { mockData as legislatorConstituency } from '../mock-datas/maps/legislators/2020_legislator_constituency_6300001'

const gcsBaseUrl = 'https://whoareyou-gcs.readr.tw/elections-dev'

const fetchSeatData = async ({ electionType, year, folderName, fileName }) => {
  const seatDataUrl = `${gcsBaseUrl}/${year}/${electionType}/seat/${folderName}/${fileName}.json`
  const { data } = await axios.get(seatDataUrl)
  return data
}

const fetchMayorEvcData = async ({ year }) => {
  const loader = new DataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
  const data = await loader.loadMayorData({
    year,
  })
  return data
}

const fetchReferendumEvcData = async ({ year }) => {
  const loader = new DataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
  const data = await loader.loadReferendumData({
    year,
  })
  return data
}

const fetchCouncilMemberEvcData = async ({ year, district, subtypeKey }) => {
  const loader = new DataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
  const data = await loader.loadCouncilMemberDataForElectionMapProject({
    year,
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
  numberKey,
}) => {
  const mapDataUrl = `${gcsBaseUrl}/${year}/${electionType}/map/${numberKey}/${folderName}/${fileName}.json`
  const { data } = await axios.get(mapDataUrl)
  return data
}

const fetchCouncilMemberMapData = async ({
  electionType,
  year,
  subtypeKey,
  folderName,
  fileName,
}) => {
  const mapDataUrl = `${gcsBaseUrl}/${year}/${electionType}/map/${folderName}/${subtypeKey}/${fileName}.json`
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

const defaultElectionMapData = generateDefaultElectionMapData()

const defaultEvcData = {
  // there is only one mayor evcData for all counties
  mayor: null,
  // there are lots councilMember evcData for each county
  councilMember: null,
  /*
  {
    [63000]: data
  }
  */
  // there is only one mayor evcData for the country
  referendum: null,
}

export const useElectionData = (showLoading, showTutorial) => {
  const [election, setElection] = useState(
    elections.find((election) => election.electionType === defaultElectionType)
  )
  const [mapGeoJsons, setMapGeoJsons] = useState()

  const [electionMapData, setElectionMapData] = useState(
    deepCloneObj(defaultElectionMapData)
  )
  const [evcData, setEvcData] = useState({ ...defaultEvcData })
  const [seatData, setSeatData] = useState()
  const [infoboxData, setInfoboxData] = useState({})

  const [mapObject, setMapObject] = useState(defaultMapObject)
  const [shouldRefetch, setShouldRefetch] = useState(false)

  const [subtype, setSubtype] = useState(
    election.subtypes?.find((subtype) => subtype.key === 'normal')
  )
  const [isRunning, setIsRunning] = useState(false)
  const [evcScrollTo, setEvcScrollTo] = useState()
  const [lastUpdate, setLastUpdate] = useState()
  const [year, setYear] = useState(election.years[0].year)
  //for referendum, referendumLocal
  const [number, setNumber] = useState(
    election.years[0].numbers && election.years[0].numbers[0]
  )

  const mapData = getMapData(
    electionMapData,
    election.electionType,
    year,
    subtype?.key,
    number?.key
  )
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
      election,
      mapObject,
      mapData,
      evcData,
      seatData,
      year,
      subtypeKey,
      numberKey,
      lastUpdate
    ) => {
      let newMapData = mapData
      let newEvcData = evcData
      let newSeatData = seatData
      let newLastUpdate = lastUpdate
      let newIsRunning = mapData.isRunning
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
            if (year === 2022 && countyId === '10020') {
              // 2022 chiayi city postpond the mayor election
              newInfoboxData.electionData = '10020'
              break
            }
            switch (level) {
              case 0:
                if (!newEvcData[electionType]) {
                  try {
                    const data = await fetchMayorEvcData({
                      year,
                    })
                    newEvcData[electionType] = data
                  } catch (error) {
                    console.error(error)
                  }
                }
                if (!newMapData[0]) {
                  try {
                    const data = await fetchMayorMapData({
                      electionType,
                      year,
                      folderName: election.meta.map.folderNames[level],
                      fileName: election.meta.map.fileNames[level],
                    })
                    newMapData = {
                      ...newMapData,
                      0: data,
                      isRunning: data.is_running,
                    }
                    newLastUpdate = data.updatedAt
                    newIsRunning = data.is_running
                  } catch (error) {
                    console.error(error)
                  }
                }
                break
              case 1:
                if (!newMapData[1][countyId]) {
                  try {
                    const data = await fetchMayorMapData({
                      electionType,
                      year,
                      folderName: election.meta.map.folderNames[level],
                      fileName: countyId,
                    })
                    newMapData = {
                      ...newMapData,
                      1: { ...newMapData[1], [countyId]: data },
                      isRunning: data.is_running,
                    }
                    newLastUpdate = data.updatedAt
                    newIsRunning = data.is_running
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[0]?.districts.find(
                  (district) => district.county === mapObject.activeId
                )
                break
              case 2:
                if (!newMapData[2][townId]) {
                  try {
                    const data = await fetchMayorMapData({
                      electionType,
                      year,
                      folderName: election.meta.map.folderNames[level],
                      fileName: townId,
                    })
                    newMapData = {
                      ...newMapData,
                      2: { ...newMapData[2], [townId]: data },
                      isRunning: data.is_running,
                    }
                    newLastUpdate = data.updatedAt
                    newIsRunning = data.is_running
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
                break
              case 3:
                newInfoboxData.electionData = newMapData[2][
                  townId
                ]?.districts.find(
                  (district) =>
                    district.county + district.town + district.vill ===
                    mapObject.activeId
                )
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
                if (
                  !newEvcData[electionType] ||
                  !newEvcData[electionType][countyId]
                ) {
                  try {
                    const data = await fetchCouncilMemberEvcData({
                      year,
                      district: countyMappingData.find(
                        (countyData) => countyData.countyCode === countyId
                      ).countyNameEng,
                      subtypeKey,
                    })
                    const countyEvcData = {
                      ...newEvcData[electionType],
                      [countyId]: data,
                    }
                    newEvcData[electionType] = countyEvcData
                  } catch (error) {
                    console.error(error)
                  }
                }

                if (!newSeatData || !newSeatData[countyId]) {
                  try {
                    const data = await fetchSeatData({
                      electionType,
                      year,
                      folderName: 'county',
                      fileName: countyId,
                    })
                    newSeatData = { ...newSeatData, [countyId]: data }
                  } catch (error) {
                    console.error(error)
                  }
                }

                if (!newMapData[1][countyId]) {
                  try {
                    const data = await fetchCouncilMemberMapData({
                      electionType,
                      year,
                      subtypeKey,
                      folderName: election.meta.map.folderNames[level],
                      fileName: countyId,
                    })
                    if (!'is_running' in data) {
                      console.error('CouncilMemberMapData without is_running')
                    }
                    newMapData = {
                      ...newMapData,
                      1: { ...newMapData[1], [countyId]: data },
                      isRunning: data.is_running,
                    }
                    newLastUpdate = data.updatedAt
                    newIsRunning = data.is_running
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[1][countyId]?.summary
                break
              case 2:
                if (!newMapData[2][townId]) {
                  try {
                    const data = await fetchCouncilMemberMapData({
                      electionType,
                      year,
                      subtypeKey,
                      folderName: election.meta.map.folderNames[level],
                      fileName: townId,
                    })
                    if (!'is_running' in data) {
                      console.error('CouncilMemberMapData without is_running')
                    }
                    const townData = { ...newMapData[2], [townId]: data }
                    newMapData = {
                      ...newMapData,
                      2: townData,
                      isRunning: data.is_running,
                    }
                    newLastUpdate = data.updatedAt
                    newIsRunning = data.is_running
                  } catch (error) {}
                }
                newInfoboxData.electionData = newMapData[1][
                  countyId
                ]?.districts.filter(
                  (district) =>
                    district.county + district.town === mapObject.activeId
                )
                break
              case 3:
                newInfoboxData.electionData = newMapData[2][
                  townId
                ]?.districts.filter(
                  (district) =>
                    district.county + district.town + district.vill ===
                    mapObject.activeId
                )
                break

              default:
                break
            }

            break
          case 'referendum':
            switch (level) {
              case 0:
                if (!newEvcData[electionType]) {
                  try {
                    const data = await fetchReferendumEvcData({
                      year,
                    })
                    newEvcData[electionType] = data
                  } catch (error) {
                    console.error(error)
                  }
                }
                if (!newMapData[0]) {
                  try {
                    const data = await fetchReferendumMapData({
                      electionType,
                      year,
                      folderName: election.meta.map.folderNames[level],
                      fileName: election.meta.map.fileNames[level],
                      numberKey,
                    })
                    newMapData = {
                      ...newMapData,
                      0: data,
                      isRunning: data.is_running,
                    }
                    newLastUpdate = data.updatedAt
                    newIsRunning = data.is_running
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[0]?.summary
                break
              case 1:
                if (!newMapData[1][countyId]) {
                  try {
                    const data = await fetchReferendumMapData({
                      electionType,
                      year,
                      folderName: election.meta.map.folderNames[level],
                      fileName: countyId,
                      numberKey,
                    })
                    const countyData = { ...newMapData[1], [countyId]: data }
                    newMapData = {
                      ...newMapData,
                      1: countyData,
                      isRunning: data.is_running,
                    }
                    newLastUpdate = data.updatedAt
                    newIsRunning = data.is_running
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[0]?.districts.find(
                  (district) => district.county === mapObject.activeId
                )
                break
              case 2:
                if (!newMapData[2][townId]) {
                  try {
                    const data = await fetchReferendumMapData({
                      electionType,
                      year,
                      folderName: election.meta.map.folderNames[level],
                      fileName: townId,
                      numberKey,
                    })
                    const townData = { ...newMapData[2], [townId]: data }
                    newMapData = {
                      ...newMapData,
                      2: townData,
                      isRunning: data.is_running,
                    }
                    newLastUpdate = data.updatedAt
                    newIsRunning = data.is_running
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

                break
              case 3:
                newInfoboxData.electionData = newMapData[2][
                  townId
                ]?.districts.find(
                  (district) =>
                    district.county + district.town + district.vill ===
                    mapObject.activeId
                )
                break

              default:
                break
            }
            break

          default:
            break
        }
      }

      showLoading(false)
      return {
        newInfoboxData,
        newMapData,
        newEvcData,
        newSeatData,
        newLastUpdate,
        newIsRunning,
      }
    },
    [showLoading]
  )

  const scrollEvcFromMapObject = (
    electionType,
    mapData,
    subtype,
    mapObject,
    year
  ) => {
    let newScrollTo
    switch (electionType) {
      case 'mayor': {
        const countyCode = mapObject.countyId
        if (countyCode) {
          const countyData = countyMappingData.find(
            (countyData) => countyData.countyCode === countyCode
          )

          if (!(year === 2022 && countyData.countyName === '嘉義市')) {
            newScrollTo = countyData.countyName
          }
        }
        break
      }

      case 'councilMember': {
        // try to get scrollTo, but ignore any error
        // ignore 原住民分類
        if (subtype.key === 'normal') {
          try {
            const countyMapData = mapData[1][mapObject.countyId]
            const targetDistrict = countyMapData.districts.find(
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
          const countyData = countyMappingData.find(
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
            const targetDistrict = countyMapData.districts.find(
              (district) => district.area === evcSelectedValue.slice(1, 3)
            )
            const townId = targetDistrict.county + targetDistrict.town
            const target = document.querySelector(`#first-id-${townId}`)
            let event = new MouseEvent('click', { bubbles: true })
            target.dispatchEvent(event)
          }

          break
        }
        case 'referendum': {
          // evcSelectedValue format '全國'
          const target = document.querySelector(`#first-id-background`)
          let event = new MouseEvent('click', { bubbles: true })
          target.dispatchEvent(event)
          break
        }
        default:
          break
      }
    },
    [election.electionType, mapData, subtype, mapObject.countyId]
  )

  const onSubtypeChange = (newSubtype) => {
    setSubtype(newSubtype)
    setEvcData({ ...defaultEvcData })
    setEvcScrollTo(undefined)
    showLoading(true)
  }

  const onElectionChange = useCallback(
    (electionType) => {
      const newElection = elections.find(
        (election) => election.electionType === electionType
      )
      const newYear = newElection.years[0].year
      const newNumber =
        newElection.years[0].numbers && newElection.years[0].numbers[0]
      const newSubtype = newElection.subtypes?.find(
        (subtype) => subtype.key === 'normal'
      )

      setElection(newElection)
      setYear(newYear)
      setNumber(newNumber)
      setSubtype(newSubtype)
      setElectionMapData((electionMapData) => {
        const mapData = getMapData(
          electionMapData,
          electionType,
          newYear,
          newSubtype?.key,
          newNumber?.key
        )
        if (mapData.isRunning) {
          return updateElectionMapData(
            electionMapData,
            deepCloneObj(defaultMapData),
            electionType,
            newYear,
            newSubtype?.key,
            newNumber?.key
          )
        } else {
          return electionMapData
        }
      })
      setMapObject(defaultMapObject)
      setInfoboxData({})
      setEvcData({ ...defaultEvcData })
      setEvcScrollTo(undefined)
      setSeatData()
      showLoading(true)
    },
    [showLoading]
  )

  const onMapObjectChange = async (newMapObject = defaultMapObject) => {
    // fetch data before map scales, useEffect will called prepareData again,
    // make sure to avoid fetch duplicate data
    showLoading(true)
    const {
      newInfoboxData,
      newMapData,
      newEvcData,
      newSeatData,
      newLastUpdate,
      newIsRunning,
    } = await prepareElectionData(
      election,
      newMapObject,
      mapData,
      evcData,
      seatData,
      year,
      subtype?.key,
      number?.key,
      lastUpdate
    )
    setInfoboxData(newInfoboxData)
    setElectionMapData((oldData) =>
      updateElectionMapData(
        oldData,
        newMapData,
        election.electionType,
        year,
        subtype?.key,
        number?.key
      )
    )
    setEvcData(newEvcData)
    setSeatData(newSeatData)
    setMapObject(newMapObject)
    setEvcScrollTo(
      scrollEvcFromMapObject(
        election.electionType,
        newMapData,
        subtype,
        newMapObject,
        year
      )
    )
    if (year === currentYear) {
      setIsRunning(newIsRunning)
      setLastUpdate(newLastUpdate)
    }
    showLoading(false)
  }

  const onTutorialEnd = () => {
    onElectionChange('mayor')
  }

  useEffect(() => {
    showLoading(true)
    Promise.allSettled([
      prepareElectionData(
        election,
        mapObject,
        mapData,
        evcData,
        seatData,
        year,
        subtype?.key,
        number?.key,
        lastUpdate
      ),
      mapGeoJsons ? undefined : prepareGeojsons(),
    ]).then((results) => {
      if (results[0]?.value) {
        const {
          newInfoboxData,
          newMapData,
          newEvcData,
          newSeatData,
          newLastUpdate,
          newIsRunning,
        } = results[0].value
        setInfoboxData(newInfoboxData)
        setElectionMapData((oldData) =>
          updateElectionMapData(
            oldData,
            newMapData,
            election.electionType,
            year,
            subtype?.key,
            number?.key
          )
        )
        setEvcData(newEvcData)
        setSeatData(newSeatData)
        if (year === currentYear) {
          setIsRunning(newIsRunning)
          setLastUpdate(newLastUpdate)
        }
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
    seatData,
    subtype,
    lastUpdate,
    number,
  ])

  // create interval to periodically trigger refetch and let react lifecycle to handle the refetch
  useEffect(() => {
    const interval = setInterval(() => {
      setShouldRefetch(true)
    }, 100 * 60 * 1000)
    // }, 1 * 60 * 1000)
    // }, 5 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const refetch = async () => {
      console.log('refetch data..')
      const { level: currentLevel, townId, countyId } = mapObject
      const { electionType } = election
      let newMapData = deepCloneObj(defaultMapData)
      const newEvcData = { ...defaultEvcData }
      let newLastUpdate = lastUpdate
      let newSeatData
      let newIsRunning
      showLoading(true)
      for (let level = 0; level <= currentLevel; level++) {
        switch (electionType) {
          case 'mayor': {
            switch (level) {
              case 0:
                try {
                  const data = await fetchMayorEvcData({
                    year,
                  })
                  newEvcData[electionType] = data
                } catch (error) {
                  console.error(error)
                }

                try {
                  const data = await fetchMayorMapData({
                    electionType,
                    year,
                    folderName: election.meta.map.folderNames[level],
                    fileName: 'country',
                  })
                  newMapData = {
                    ...newMapData,
                    0: data,
                    isRunning: data.is_running,
                  }
                  newLastUpdate = data.updatedAt
                  newIsRunning = data.is_running
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
                    year,
                    folderName: election.meta.map.folderNames[level],
                    fileName: countyId,
                  })
                  newMapData = {
                    ...newMapData,
                    1: { [countyId]: data },
                    isRunning: data.is_running,
                  }

                  newLastUpdate = data.updatedAt
                  newIsRunning = data.is_running
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
                    year,
                    folderName: election.meta.map.folderNames[level],
                    fileName: townId,
                  })
                  newMapData = {
                    ...newMapData,
                    2: { [townId]: data },
                    isRunning: data.is_running,
                  }

                  newLastUpdate = data.updatedAt
                  newIsRunning = data.is_running
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
                try {
                  const data = await fetchCouncilMemberEvcData({
                    year,
                    district: countyMappingData.find(
                      (countyData) => countyData.countyCode === countyId
                    ).countyNameEng,
                    subtypeKey: subtype.key,
                  })
                  const countyEvcData = { [countyId]: data }
                  newEvcData[electionType] = countyEvcData
                } catch (error) {
                  console.error(error)
                }
                try {
                  const data = await fetchSeatData({
                    electionType,
                    year,
                    folderName: 'county',
                    fileName: countyId,
                  })
                  newSeatData = { [countyId]: data }
                } catch (error) {
                  console.error(error)
                }
                try {
                  const data = await fetchCouncilMemberMapData({
                    electionType,
                    year,
                    subtype,
                    folderName: election.meta.map.folderNames[level],
                    fileName: countyId,
                  })
                  if (!'is_running' in data) {
                    console.error('CouncilMemberMapData without is_running')
                  }
                  newMapData = {
                    ...newMapData,
                    1: { [countyId]: data },
                    isRunning: data.is_running,
                  }

                  newLastUpdate = data.updatedAt
                  newIsRunning = data.is_running
                } catch (error) {
                  console.error(error)
                }
                break
              case 2:
                try {
                  const data = await fetchCouncilMemberMapData({
                    electionType,
                    year,
                    subtype,
                    folderName: election.meta.map.folderNames[level],
                    fileName: townId,
                  })
                  if (!'is_running' in data) {
                    console.error('CouncilMemberMapData without is_running')
                  }
                  newMapData = {
                    ...newMapData,
                    2: { [townId]: data },
                    isRunning: data.is_running,
                  }

                  newLastUpdate = data.updatedAt
                  newIsRunning = data.is_running
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
                try {
                  const data = await fetchReferendumEvcData({
                    year,
                  })
                  newEvcData[electionType] = data
                } catch (error) {
                  console.error(error)
                }

                try {
                  const data = await fetchReferendumMapData({
                    electionType,
                    year,
                    folderName: election.meta.map.folderNames[level],
                    fileName: election.meta.map.fileNames[level],
                    numberKey: number.key,
                  })
                  newMapData = {
                    ...newMapData,
                    0: data,
                    isRunning: data.is_running,
                  }

                  newLastUpdate = data.updateAt
                  newIsRunning = data.is_running
                } catch (error) {
                  console.error(error)
                }
                break
              case 1:
                try {
                  const data = await fetchReferendumMapData({
                    electionType,
                    year,
                    folderName: election.meta.map.folderNames[level],
                    fileName: countyId,
                    numberKey: number.key,
                  })
                  newMapData = {
                    ...newMapData,
                    1: { [countyId]: data },
                    isRunning: data.is_running,
                  }

                  newLastUpdate = data.updatedAt
                  newIsRunning = data.is_running
                } catch (error) {
                  console.error(error)
                }
                break
              case 2:
                try {
                  const data = await fetchReferendumMapData({
                    electionType,
                    year,
                    folderName: election.meta.map.folderNames[level],
                    fileName: townId,
                    numberKey: number.key,
                  })
                  newMapData = {
                    ...newMapData,
                    2: { [townId]: data },
                    isRunning: data.is_running,
                  }

                  newLastUpdate = data.updatedAt
                  newIsRunning = data.is_running
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
      setElectionMapData(() =>
        updateElectionMapData(
          electionMapData,
          newMapData,
          election.electionType,
          year,
          subtype?.key,
          number?.key
        )
      )
      setEvcData(newEvcData)
      setEvcScrollTo(
        scrollEvcFromMapObject(
          election.electionType,
          newMapData,
          subtype,
          mapObject,
          year
        )
      )
      setSeatData(newSeatData)
      setShouldRefetch(false)
      if (year === currentYear) {
        setLastUpdate(newLastUpdate)
        setIsRunning(newIsRunning)
      }
      showLoading(false)
    }

    if (shouldRefetch) {
      if (!mapData.isRunning) {
        console.log('no need to refetch final data')
        setShouldRefetch(false)
        return
      } else {
        refetch()
      }
    }
  }, [
    election,
    electionMapData,
    lastUpdate,
    mapData,
    mapObject,
    number,
    shouldRefetch,
    showLoading,
    subtype,
    year,
  ])

  useEffect(() => {
    if (showTutorial) {
      onElectionChange('councilMember')
    }
  }, [showTutorial, onElectionChange])

  let outputEvcData
  if (election.electionType === 'councilMember') {
    outputEvcData =
      evcData[election.electionType] &&
      evcData[election.electionType][mapObject.countyId]
  } else {
    outputEvcData = evcData[election.electionType]
  }
  let outputSeatData
  if (election.electionType === 'councilMember') {
    outputSeatData = seatData && seatData[mapObject.countyId]
  }
  const subtypeInfo = subtype && {
    subtype,
    subtypes,
    onSubtypeChange,
  }
  const yearInfo = {
    year,
    setYear,
    years: election.years,
  }

  return {
    electionNamePairs: elections.map(({ electionType, electionName }) => ({
      electionType,
      electionName,
    })),
    onElectionChange,
    election,
    mapData,
    infoboxData,
    evcInfo: {
      evcData: outputEvcData,
      onEvcSelected,
      scrollTo: evcScrollTo,
    },
    seatData: outputSeatData,
    mapObject,
    setMapObject: onMapObjectChange,
    mapGeoJsons,
    yearInfo,
    onTutorialEnd,
    subtypeInfo,
    isRunning,
    lastUpdate,
    number,
    numbers,
  }
}
