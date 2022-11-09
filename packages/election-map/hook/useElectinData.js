import { useCallback, useEffect, useState } from 'react'
import { defaultMapObject } from '../components/MapControl'
import axios from 'axios'

import { mockData as presidentCountry } from '../mock-datas/maps/presidents/2020_president_country'
import { mockData as presidentCounty } from '../mock-datas/maps/presidents/2020_president_county_63000'
import { mockData as presidentTown } from '../mock-datas/maps/presidents/2020_president_town_63000010'

import { mockData as councilmanCounty } from '../mock-datas/maps/councilmen/2018_councilmen_county_63000'
import { mockData as CouncilmanConstituency } from '../mock-datas/maps/councilmen/2018_councilmen_constituency_6300001'

import { mockData as legislatorCounty } from '../mock-datas/maps/legislators/2020_legislator_county_63000'
import { mockData as legislatorConstituency } from '../mock-datas/maps/legislators/2020_legislator_constituency_6300001'

import { mockData as referendaCountry } from '../mock-datas/maps/referenda/2020_referenda_01_country'
import { mockData as referendaCounty } from '../mock-datas/maps/referenda/2020_referenda_01_county_63000'
import { mockData as referendaTown } from '../mock-datas/maps/referenda/2020_referenda_01_town_63000010'

const gcsBaseUrl = 'https://whoareyou-gcs.readr.tw/elections/2022'
const elections = [
  {
    electionType: 'mayor',
    electionName: '縣市首長',
    years: [2022, 2018, 2014, 2010, 2006, 2002],
    levels: [
      {
        //level 0 country
        mapJson: 'tw_country.topojson',
        electionDatas: 'mayor_country.json',
      },
      {
        //level 1 county
        mapJson: 'tw_county_63000.topojson',
        electionDatas: 'mayor_county_63000.json',
      },
      {
        //level 2 town
        mapJson: 'tw_town_63000010.topojson',
        electionDatas: 'mayor_town_63000010.json',
      },
      {
        //level 3 village
        mapJson: 'tw_vill_63000010010.topojson',
        electionDatas: null,
      },
    ],
  },
  {
    electionType: 'councilman',
    electionName: '縣市議員',
    years: [2022, 2018, 2014, 2010, 2006, 2002],
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
    electionType: 'president',
    electionName: '總統',
    years: [2020, 2016, 2012, 2008, 2004, 2000],
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
    electionType: 'legislator',
    electionName: '立法委員',
    years: [2020, 2016, 2012, 2008, 2004, 2000],
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
    electionType: 'referenda',
    electionName: '全國性公民投票',
    years: [2020, 2016, 2012, 2008, 2004, 2000],
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
// const defaultLevel = 0
// const defaultElection = elections.mayor
// const year = defaultElection.years[0]
// const mappingData = defaultElection.levels[defaultLevel]

const defaultMapData = { 0: null, 1: null, 2: null }
export const useElectionData = (showLoading) => {
  const [election, setElection] = useState(elections[0])
  const [mapObject, setMapObject] = useState(defaultMapObject)
  const [mapData, setMapData] = useState(defaultMapData)
  const [infoboxData, setInfoboxData] = useState({})
  const [shouldRefetch, setShouldRefetch] = useState(false)

  const prepareData = useCallback(async (election, mapObject, mapData) => {
    let newMapData = mapData
    const newInfoboxData = {
      electionType: election.electionType,
      level: mapObject.level,
    }
    switch (election.electionType) {
      case 'president':
        _mapData = {
          0: presidentCountry,
          1: presidentCounty,
          2: presidentTown,
        }

        switch (mapObject.level) {
          case 0:
            newInfoboxData.electionData = _mapData[0].summary
            break
          case 1:
            newInfoboxData.electionData = _mapData[0].districts.find(
              (district) => district.county === mapObject.activeId
            )
            // dev
            if (!newInfoboxData.electionData) {
              newInfoboxData.electionData = _mapData[0].districts[0]
            }
            break
          case 2:
            newInfoboxData.electionData = _mapData[1].districts.find(
              (district) =>
                district.county + district.town === mapObject.activeId
            )
            // dev
            if (!newInfoboxData.electionData) {
              newInfoboxData.electionData = _mapData[1].districts[0]
            }
            break
          case 3:
            newInfoboxData.electionData = _mapData[2].districts.find(
              (district) =>
                district.county + district.town + district.vill ===
                mapObject.activeId
            )
            // dev
            if (!newInfoboxData.electionData) {
              newInfoboxData.electionData = _mapData[2].districts[0]
            }
            break

          default:
            break
        }
        break
      case 'mayor':
        switch (mapObject.level) {
          case 0: {
            if (!newMapData[0]) {
              console.log('fetching country data')
              const url =
                gcsBaseUrl +
                '/' +
                election.electionType +
                '/map/' +
                'country.json'
              try {
                const { data } = await axios.get(url)
                newMapData = { ...newMapData, 0: data }
              } catch (error) {
                console.error(error)
              }
            } else {
              console.log('no need to fetch country data')
            }
            break
          }
          case 1: {
            const { countyId } = mapObject
            if (!newMapData[1] || !newMapData[1][countyId]) {
              console.log('fetching county data')
              const url =
                gcsBaseUrl +
                '/' +
                election.electionType +
                '/map/county/' +
                `${countyId}.json`
              try {
                const { data } = await axios.get(url)
                const countyData = { ...newMapData[1], [countyId]: data }
                newMapData = { ...newMapData, 1: countyData }
              } catch (error) {
                console.error(error)
              }
            } else {
              console.log('no need to fetch county data')
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
              const url =
                gcsBaseUrl +
                '/' +
                election.electionType +
                '/map/town/' +
                `${townId}.json`

              try {
                const { data } = await axios.get(url)
                const townData = { ...newMapData[2], [townId]: data }
                newMapData = { ...newMapData, 2: townData }
              } catch (error) {
                console.error(error)
              }
            } else {
              console.log('no need to fetch town data')
            }
            newInfoboxData.electionData = newMapData[1][
              countyId
            ].districts.find(
              (district) =>
                district.county + district.town === mapObject.activeId
            )
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
        _mapData = { 0: null, 1: legislatorCounty, 2: legislatorConstituency }

        switch (mapObject.level) {
          case 0:
            break
          case 1:
            newInfoboxData.electionData = _mapData[1]
            break
          case 2:
            newInfoboxData.electionData = _mapData[1].districts.find(
              (district) =>
                district.county + district.area + '0' === mapObject.activeId
            )
            // dev
            if (!newInfoboxData.electionData) {
              newInfoboxData.electionData = _mapData[1].districts[0]
            }
            break
          case 3:
            newInfoboxData.electionData = _mapData[2].districts.find(
              (district) =>
                district.county + district.area + '0' + district.vill ===
                mapObject.activeId
            )
            // dev
            if (!newInfoboxData.electionData) {
              newInfoboxData.electionData = _mapData[2].districts[0]
            }
            break

          default:
            break
        }

        break
      case 'councilman':
        _mapData = { 0: null, 1: councilmanCounty, 2: CouncilmanConstituency }

        switch (mapObject.level) {
          case 0:
            break
          case 1:
            newInfoboxData.electionData = _mapData[1]
            break
          case 2:
            newInfoboxData.electionData = _mapData[1].districts.find(
              (district) =>
                district.county + district.area + '0' === mapObject.activeId
            )
            // dev
            if (!newInfoboxData.electionData) {
              newInfoboxData.electionData = _mapData[1].districts[0]
            }
            break
          case 3:
            newInfoboxData.electionData = _mapData[2].districts.find(
              (district) =>
                district.county + district.area + '0' + district.vill ===
                mapObject.activeId
            )
            // dev
            if (!newInfoboxData.electionData) {
              newInfoboxData.electionData = _mapData[2].districts[0]
            }
            break

          default:
            break
        }

        break
      case 'referenda':
        _mapData = {
          0: referendaCountry,
          1: referendaCounty,
          2: referendaTown,
        }

        switch (mapObject.level) {
          case 0:
            newInfoboxData.electionData = _mapData[0].summary
            break
          case 1:
            newInfoboxData.electionData = _mapData[0].districts.find(
              (district) => district.county === mapObject.activeId
            )
            // dev
            if (!newInfoboxData.electionData) {
              newInfoboxData.electionData = _mapData[0].districts[0]
            }
            break
          case 2:
            newInfoboxData.electionData = _mapData[1].districts.find(
              (district) =>
                district.county + district.town === mapObject.activeId
            )
            // dev
            if (!newInfoboxData.electionData) {
              newInfoboxData.electionData = _mapData[1].districts[0]
            }
            break
          case 3:
            newInfoboxData.electionData = _mapData[2].districts.find(
              (district) =>
                district.county + district.town + district.vill ===
                mapObject.activeId
            )
            // dev
            if (!newInfoboxData.electionData) {
              newInfoboxData.electionData = _mapData[2].districts[0]
            }
            break

          default:
            break
        }
        break

      default:
        break
    }

    return { newInfoboxData, newMapData }
  }, [])

  const onElectionChange = (e) => {
    const electionType = e.target.value
    setElection(
      elections.find((election) => election.electionType === electionType)
    )
  }

  const onMapObjectChange = async (newMapObject) => {
    // fetch data before map scales, useEffect will called prepareData again,
    // make sure to avoid fetch duplicate data
    const { newInfoboxData, newMapData } = await prepareData(
      election,
      newMapObject,
      mapData
    )
    setInfoboxData(newInfoboxData)
    setMapData(newMapData)
    setMapObject(newMapObject)
  }

  useEffect(() => {
    prepareData(election, mapObject, mapData).then(
      ({ newInfoboxData, newMapData }) => {
        setInfoboxData(newInfoboxData)
        setMapData(newMapData)
      }
    )
  }, [election, mapData, mapObject, prepareData])

  // create interval to periodically trigger refetch and let react lifecycle to handle the refetch
  useEffect(() => {
    const interval = setInterval(() => {
      setShouldRefetch(true)
    }, 100000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const refetch = async () => {
      console.log('refetch data.. hold on')
      showLoading(true)
      const { level, activeId } = mapObject
      const newMapData = defaultMapData
      for (let index = 0; index <= level; index++) {
        switch (index) {
          case 0: {
            const url =
              gcsBaseUrl +
              '/' +
              election.electionType +
              '/map/' +
              'country.json'
            try {
              const { data } = await axios.get(url)
              newMapData[0] = data
            } catch (error) {
              console.error(error)
            }
            break
          }
          case 1: {
            const countyId = activeId.slice(0, 5)
            const url =
              gcsBaseUrl +
              '/' +
              election.electionType +
              '/map/county/' +
              `${countyId}.json`
            try {
              const { data } = await axios.get(url)
              const countyData = { [countyId]: data }
              newMapData[1] = countyData
            } catch (error) {
              console.error(error)
            }
            break
          }
          case 2: {
            const townId = activeId.slice(0, 8)
            const url =
              gcsBaseUrl +
              '/' +
              election.electionType +
              '/map/town/' +
              `${townId}.json`

            try {
              const { data } = await axios.get(url)
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
      }
      setMapData(newMapData)
      setShouldRefetch(false)
      showLoading(false)
    }
    if (shouldRefetch) {
      refetch()
    }
  }, [shouldRefetch, mapObject, election.electionType, showLoading])

  return {
    electionNamePairs: elections.map(({ electionType, electionName }) => ({
      electionType,
      electionName,
    })),
    onElectionChange,
    election,
    mapData,
    infoboxData,
    mapObject,
    setMapObject: onMapObjectChange,
  }
}
