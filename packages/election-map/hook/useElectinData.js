import { useState } from 'react'
import { defaultMapObject } from '../components/MapControl'

import { mockData as presidentMockData } from '../mock-datas/maps/presidents/2020_president_country'
import { mockData as mayorMockData } from '../mock-datas/maps/mayors/2022_mayor_country'
import { mockData as legislatorMockData } from '../mock-datas/maps/legislators/2020_legislator_county_63000'
import { mockData as councilmanMockData } from '../mock-datas/maps/councilmen/2018_councilmen_county_63000'

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
]
// const defaultLevel = 0
// const defaultElection = elections.mayor
// const year = defaultElection.years[0]
// const mappingData = defaultElection.levels[defaultLevel]

export const useElectionData = () => {
  const [election, setElection] = useState(elections[0])
  const [mapObject, setMapObject] = useState(defaultMapObject)

  let infoboxData
  switch (election.electionType) {
    case 'president':
      infoboxData = presidentMockData
      break
    case 'mayor':
      infoboxData = mayorMockData
      break
    case 'legislator':
      infoboxData = legislatorMockData
      break
    case 'councilman':
      infoboxData = councilmanMockData
      break
    case 'referenda':
      infoboxData = null
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
    infoboxData,
    mapObject,
    setMapObject,
  }
}
