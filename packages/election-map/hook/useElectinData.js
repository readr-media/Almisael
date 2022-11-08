import { useState } from 'react'
import { defaultMapObject } from '../components/MapControl'

import { mockData as mayorCountry } from '../mock-datas/maps/mayors/2022_mayor_country'
import { mockData as mayorCounty } from '../mock-datas/maps/mayors/2022_mayor_county_63000'
import { mockData as mayorTown } from '../mock-datas/maps/mayors/2022_mayor_town_63000010'

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

export const useElectionData = () => {
  const [election, setElection] = useState(elections[0])
  const [mapObject, setMapObject] = useState(defaultMapObject)

  let mapData
  const infoboxData = {
    electionType: election.electionType,
    level: mapObject.level,
  }
  switch (election.electionType) {
    case 'president':
      mapData = { 0: presidentCountry, 1: presidentCounty, 2: presidentTown }

      switch (mapObject.level) {
        case 0:
          infoboxData.electionData = mapData[0].summary
          break
        case 1:
          infoboxData.electionData = mapData[0].districts.find(
            (district) => district.county === mapObject.activeId
          )
          // dev
          if (!infoboxData.electionData) {
            infoboxData.electionData = mapData[0].districts[0]
          }
          break
        case 2:
          infoboxData.electionData = mapData[1].districts.find(
            (district) => district.county + district.town === mapObject.activeId
          )
          // dev
          if (!infoboxData.electionData) {
            infoboxData.electionData = mapData[1].districts[0]
          }
          break
        case 3:
          infoboxData.electionData = mapData[2].districts.find(
            (district) =>
              district.county + district.town + district.vill ===
              mapObject.activeId
          )
          // dev
          if (!infoboxData.electionData) {
            infoboxData.electionData = mapData[2].districts[0]
          }
          break

        default:
          break
      }
      break
    case 'mayor':
      mapData = { 0: mayorCountry, 1: mayorCounty, 2: mayorTown }

      switch (mapObject.level) {
        case 0:
          break
        case 1:
          infoboxData.electionData = mapData[0].districts.find(
            (district) => district.county === mapObject.activeId
          )
          // dev
          if (!infoboxData.electionData) {
            infoboxData.electionData = mapData[0].districts[0]
          }
          break
        case 2:
          infoboxData.electionData = mapData[1].districts.find(
            (district) => district.county + district.town === mapObject.activeId
          )
          // dev
          if (!infoboxData.electionData) {
            infoboxData.electionData = mapData[1].districts[0]
          }
          break
        case 3:
          infoboxData.electionData = mapData[2].districts.find(
            (district) =>
              district.county + district.town + district.vill ===
              mapObject.activeId
          )
          // dev
          if (!infoboxData.electionData) {
            infoboxData.electionData = mapData[2].districts[0]
          }
          break

        default:
          break
      }
      break
    case 'legislator':
      mapData = { 0: null, 1: legislatorCounty, 2: legislatorConstituency }

      switch (mapObject.level) {
        case 0:
          break
        case 1:
          infoboxData.electionData = mapData[1]
          break
        case 2:
          infoboxData.electionData = mapData[1].districts.find(
            (district) =>
              district.county + district.area + '0' === mapObject.activeId
          )
          // dev
          if (!infoboxData.electionData) {
            infoboxData.electionData = mapData[1].districts[0]
          }
          break
        case 3:
          infoboxData.electionData = mapData[2].districts.find(
            (district) =>
              district.county + district.area + '0' + district.vill ===
              mapObject.activeId
          )
          // dev
          if (!infoboxData.electionData) {
            infoboxData.electionData = mapData[2].districts[0]
          }
          break

        default:
          break
      }

      break
    case 'councilman':
      mapData = { 0: null, 1: councilmanCounty, 2: CouncilmanConstituency }

      switch (mapObject.level) {
        case 0:
          break
        case 1:
          infoboxData.electionData = mapData[1]
          break
        case 2:
          infoboxData.electionData = mapData[1].districts.find(
            (district) =>
              district.county + district.area + '0' === mapObject.activeId
          )
          // dev
          if (!infoboxData.electionData) {
            infoboxData.electionData = mapData[1].districts[0]
          }
          break
        case 3:
          infoboxData.electionData = mapData[2].districts.find(
            (district) =>
              district.county + district.area + '0' + district.vill ===
              mapObject.activeId
          )
          // dev
          if (!infoboxData.electionData) {
            infoboxData.electionData = mapData[2].districts[0]
          }
          break

        default:
          break
      }

      break
    case 'referenda':
      mapData = { 0: referendaCountry, 1: referendaCounty, 2: referendaTown }

      switch (mapObject.level) {
        case 0:
          infoboxData.electionData = mapData[0].summary
          break
        case 1:
          infoboxData.electionData = mapData[0].districts.find(
            (district) => district.county === mapObject.activeId
          )
          // dev
          if (!infoboxData.electionData) {
            infoboxData.electionData = mapData[0].districts[0]
          }
          break
        case 2:
          infoboxData.electionData = mapData[1].districts.find(
            (district) => district.county + district.town === mapObject.activeId
          )
          // dev
          if (!infoboxData.electionData) {
            infoboxData.electionData = mapData[1].districts[0]
          }
          break
        case 3:
          infoboxData.electionData = mapData[2].districts.find(
            (district) =>
              district.county + district.town + district.vill ===
              mapObject.activeId
          )
          // dev
          if (!infoboxData.electionData) {
            infoboxData.electionData = mapData[2].districts[0]
          }
          break

        default:
          break
      }
      break

    default:
      break
  }

  const onElectionChange = (e) => {
    const electionType = e.target.value
    setElection(
      elections.find((election) => election.electionType === electionType)
    )
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
    mapObject,
    setMapObject,
  }
}
