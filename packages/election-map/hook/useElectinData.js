import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import widgets from '@readr-media/react-election-widgets'
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
import ReactGA from 'react-ga'

const DataLoader = widgets.VotesComparison.DataLoader

import { data as legislatorCounty } from '../mock-datas/maps/legislators/normal/county/63000'
import { data as legislatorConstituency } from '../mock-datas/maps/legislators/normal/constituency/63000010'
import { environment } from '../consts/config'

const gcsBaseUrl =
  environment === 'dev'
    ? 'https://whoareyou-gcs.readr.tw/elections-dev'
    : 'https://whoareyou-gcs.readr.tw/elections'

/**
 * @typedef {import('../components/helper/election').ElectionType} ElectionType
 *
 *
 * Represent the seats of a party.
 * @typedef {Object} Seat
 * @property {string} party - The party name of the seat info.
 * @property {number} seats - The number representing how many seats the party have.
 *
 * Represent seats of all parties in some range. (whole country or county). Used in seat chart.
 * @typedef {Object} SeatsData
 * @property {string} updatedAt - The update time of the seat data.
 * @property {Array<Seat>} parties
 *
 * Represent the base of a candidate's voting info. Used in map and infobox.
 * @typedef {Object} BaseMapCandidate
 * @property {string} candNo - The candidate index.
 * @property {string} name - The name of the candidate.
 * @property {string} party - The party of the candidate.
 * @property {number} tksRate - The vote rate won by candidate. Numbers are multiplied by 100 and rounded to the second decimal place.
 * @property {' ' | '*' } candVictor - The state to indicate if the candidate wins out in the whole game. '*' represents vicotry and ' ' represents failure.
 * @property {number} tks - The vote number of the candidate. Not used for now and not provided in every election.
 *
 * Represent the mayor candidate's voting info.
 * @typedef {Pick<BaseMapCandidate, 'candNo' | 'name' | 'party' | 'tksRate' | 'candVictor' | 'tks'>} MayorMapCandidate
 *
 * Represent the mayor voting info in a range.
 * @typedef {Object} MayorMapDistrict
 * @property {string} range - The name of the disctricts. Could be '臺北市' | '臺北市 松山區' | '臺北市 松山區 莊敬里' depend on the map level.
 * @property {string | null} county - The code of county (縣市). Could be null if the level have no related info.
 * @property {string | null} town - The code of town (鄉鎮市區). Could be null if the level have no related info.
 * @property {string | null} vill - The code of village (村里). Could be null if the level have no related info.
 * @property {number} profRate - The voting rate of the district. Numbers are multiplied by 100 and rounded to the second decimal place.
 * @property {Array<MayorMapCandidate>} candidates - The voting info of all candidates in the district.
 *
 * Represent the mayor voting info of any level (country, county, town)
 * @typedef {Object} MayorMapData
 * @property {string} updatedAt - The update time of the data.
 * @property {boolean} is_started - Flag to indicate if the election has started. True for all history data.
 * @property {boolean} is_running - Flag to indicate if the election is stlling running. False for all history data.
 * @property {Array<MayorMapDistrict>} districts - The voting infos of the area in sub level. Country level contains all its counties. County level contains all its towns. Town level contains all its villages.
 *
 * Represent the president candidate's voting info.
 * @typedef {Pick<BaseMapCandidate, 'candNo' | 'name' | 'party' | 'tksRate' | 'candVictor' >} PresidentMapCandidate
 *
 * Represent the president voting info in a range.
 * @typedef {Object} PresidentMapDistrict
 * @property {string} range - The name of the disctricts. Could be '全國' \ '臺北市' | '臺北市 松山區' | '臺北市 松山區 莊敬里' depend on the map level.
 * @property {string | null} county - The code of county (縣市). Could be null if the level have no related info.
 * @property {string | null} town - The code of town (鄉鎮市區). Could be null if the level have no related info.
 * @property {string | null} vill - The code of village (村里). Could be null if the level have no related info.
 * @property {number} profRate - The voting rate of the district. Numbers are multiplied by 100 and rounded to the second decimal place.
 * @property {Array<PresidentMapCandidate>} candidates - The voting info of all candidates in the district.
 *
 * Represent the president voting info of any level (country, county, town)
 * @typedef {Object} PresidentMapData
 * @property {string} updatedAt - The update time of the data.
 * @property {boolean} is_started - Flag to indicate if the election has started. True for all history data.
 * @property {boolean} is_running - Flag to indicate if the election is stlling running. False for all history data.
 * @property {PresidentMapDistrict} [summary] - The summary of the voting info in the level of the data. Only country level has it.
 * @property {Array<PresidentMapDistrict>} districts - The voting infos of the area in sub level. Country level contains all its counties. County level contains all its towns. Town level contains all its villages.
 *
 * Represent the referendum voting info in a range.
 * @typedef {Object} ReferendumMapDistrict
 * @property {string} range - The name of the disctricts. Could be '全國' \ '臺北市' | '臺北市 松山區' | '臺北市 松山區 莊敬里' depend on the map level.
 * @property {string | null} county - The code of county (縣市). Could be null if the level have no related info.
 * @property {string | null} town - The code of town (鄉鎮市區). Could be null if the level have no related info.
 * @property {string | null} vill - The code of village (村里). Could be null if the level have no related info.
 * @property {number} profRate - The voting rate of the district. Numbers are multiplied by 100 and rounded to the second decimal place.
 * @property {number} agreeRate - The agree rate of the district. Numbers are multiplied by 100 and rounded to the second decimal place.
 * @property {number} disagreeRate - The disagree rate of the district. Numbers are multiplied by 100 and rounded to the second decimal place.
 * @property {'Y' | 'N'} adptVictor - The global state to indicate if the referendum is passed or not in the whole game.
 *
 * Represent the referendum voting info of any level (country, county, town)
 * @typedef {Object} ReferendumMapData
 * @property {string} updatedAt - The update time of the data.
 * @property {boolean} is_started - Flag to indicate if the election has started. True for all history data.
 * @property {boolean} is_running - Flag to indicate if the election is stlling running. False for all history data.
 * @property {ReferendumMapDistrict} [summary] - The summary of the voting info in the level of the data. Only country level has it.
 * @property {Array<ReferendumMapDistrict>} districts - The voting infos of the area in sub level. Country level contains all its counties. County level contains all its towns. Town level contains all its villages.
 *
 * Represent the council member candidate's voting info.
 * @typedef {Pick<BaseMapCandidate, 'candNo' | 'name' | 'party' | 'tksRate' | 'candVictor' | 'tks' >} CouncilMemberMapCandidate
 *
 * Represent the council member voting info in a range.
 * @typedef {Object} CouncilMemberMapDistrict
 * @property {string} range - The name of the disctricts. Could be '臺北市' | '臺北市 第01選區'  | '臺北市 松山區' | '臺北市 松山區 莊敬里' depend on the map level.
 * @property {string | null} county - The code of county (縣市). Could be null if the level have no related info.
 * @property {string | null} area - The code of constituency (選區). Could be null if the level have no related info.
 * @property {string | null} town - The code of town (鄉鎮市區). Could be null if the level have no related info.
 * @property {string | null} vill - The code of village (村里). Could be null if the level have no related info.
 * @property {number} profRate - The voting rate of the district. Numbers are multiplied by 100 and rounded to the second decimal place.
 * @property {Array<CouncilMemberMapCandidate>} candidates - The voting info of all candidates in the district.
 *
 * Represent the council member voting info of any level (country, county, town)
 * @typedef {Object} CouncilMemberMapData
 * @property {string} updatedAt - The update time of the data.
 * @property {boolean} is_started - Flag to indicate if the election has started. True for all history data.
 * @property {boolean} is_running - Flag to indicate if the election is stlling running. False for all history data.
 * @property {CouncilMemberMapDistrict} [summary] - Only county level has it. The voting info summaried by every constituency. For the infobox to show info for each constituency.
 * @property {Array<CouncilMemberMapDistrict>} districts - The voting infos of the area in sub level. Country level contains all its counties. County level contains all its towns. Town level contains all its villages.
 *
 * Represent the legislator candidate's voting info.
 * @typedef {Pick<BaseMapCandidate, 'candNo' | 'name' | 'party' | 'tksRate' | 'candVictor' | 'tks' >} LegislatorMapCandidateHuman - for subtype 'normal', 'mountainIndigenous' and 'plainIndigenous'.
 * @typedef {Pick<BaseMapCandidate, 'candNo' | 'party' | 'tksRate' | 'candVictor' | 'tks' >} LegislatorMapCandidateParty - for subtype 'party'
 *
 * Represent the area legislator (subtype 'normal') voting info in a range.
 * @typedef {Object} AreaLegislatorMapDistrict
 * @property {string} range - The name of the disctricts. Could be '臺北市 第01選區(士林區、北投區)' | '臺北市 松山區 莊敬里' depend on the map level.
 * @property {string | null} county - The code of county (縣市). Could be null if the level have no related info.
 * @property {string | null} area - The code of constituency (選區). Could be null if the level have no related info.
 * @property {string | null} town - The code of town (鄉鎮市區). Could be null if the level have no related info.
 * @property {string | null} vill - The code of village (村里). Could be null if the level have no related info.
 * @property {'normal'} type - The subtype of area legislator.
 * @property {number} profRate - The voting rate of the district. Numbers are multiplied by 100 and rounded to the second decimal place.
 * @property {Array<LegislatorMapCandidateHuman>} candidates - The voting info of all candidates in the district.
 *
 * Represent the non-area legislator (subtype 'mountainIndigenous' | 'plainIndigenous' | 'party') voting info in a range.
 * @typedef {Object} NonAreaLegislatorMapDistrict
 * @property {string} range - The name of the disctricts. Could be '全國' \ '臺北市' | '臺北市 松山區' | '臺北市 松山區 莊敬里' depend on the map level.
 * @property {string | null} county - The code of county (縣市). Could be null if the level have no related info.
 * @property {string | null} town - The code of town (鄉鎮市區). Could be null if the level have no related info.
 * @property {string | null} vill - The code of village (村里). Could be null if the level have no related info.
 * @property {'mountainIndigenous' | 'plainIndigenous' | 'party'} type - The subtype of non-area legislator.
 * @property {number} profRate - The voting rate of the district. Numbers are multiplied by 100 and rounded to the second decimal place.
 * @property {Array<LegislatorMapCandidateHuman> | Array<LegislatorMapCandidateParty>} candidates - The voting info of all candidates in the district. Candidate could be human or party depend on the subtype.
 *
 * Represent the area legislator (subtype 'normal') voting info of any level (country, county, town)
 * @typedef {Object} AreaLegislatorMapData
 * @property {string} updatedAt - The update time of the data.
 * @property {boolean} is_started - Flag to indicate if the election has started. True for all history data.
 * @property {boolean} is_running - Flag to indicate if the election is stlling running. False for all history data.
 * @property {Array<AreaLegislatorMapDistrict>} districts - The voting infos of the area in sub level. County level contains all its towns. Town level contains all its villages.
 *
 * Represent the non-area legislator (subtype 'mountainIndigenous' | 'plainIndigenous' | 'party') voting info of any level (country, county, town)
 * @typedef {Object} NonAreaLegislatorMapData
 * @property {string} updatedAt - The update time of the data.
 * @property {boolean} is_started - Flag to indicate if the election has started. True for all history data.
 * @property {boolean} is_running - Flag to indicate if the election is stlling running. False for all history data.
 * @property {NonAreaLegislatorMapDistrict} [summary] - The summary of the voting info in the level of the data. Only country level has it.
 * @property {Array<NonAreaLegislatorMapDistrict>} districts - The voting infos of the area in sub level. Country level contains all its counties. County level contains all its towns. Town level contains all its villages.
 */

/**
 * Fetch seat data in specific level and code (fileName).
 * @param {Object} options - Options for fetching seat data.
 * @param {ElectionType} options.electionType - The type of election.
 * @param {number} options.yearKey - The key representing the year.
 * @param {string} options.folderName - The name of the folder.
 * @param {string} options.fileName - The name of the file.
 * @returns {Promise<SeatsData>} A promise that resolves to the fetched seat data.
 */
const fetchSeatData = async ({
  electionType,
  yearKey,
  folderName,
  fileName,
}) => {
  console.log(typeof yearKey, yearKey)
  const seatDataUrl = `${gcsBaseUrl}/${yearKey}/${electionType}/seat/${folderName}/${fileName}.json`
  const { data } = await axios.get(seatDataUrl)
  return data
}

/**
 * Fetch president election votes comparison data, need to import the return type from package '@readr-media/react-election-widgets'.
 * @param {Object} options - Options for fetching president evc data.
 * @param {number} options.yearKey - The key representing the year.
 * @returns {Promise<Object>}
 */
const fetchPresidentEvcData = async ({ yearKey }) => {
  const loader = new DataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
  const data = await loader.loadPresidentData({
    year: yearKey,
  })
  return data
}

/**
 * Fetch mayor election votes comparison data, need to import the return type from package '@readr-media/react-election-widgets'.
 * @param {Object} options - Options for fetching mayor evc data.
 * @param {number} options.yearKey - The key representing the year.
 * @returns {Promise<Object>}
 */
const fetchMayorEvcData = async ({ yearKey }) => {
  const loader = new DataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
  const data = await loader.loadMayorData({
    year: yearKey,
  })
  return data
}

/**
 * Fetch councilMember election votes comparison data, need to import the return type from package '@readr-media/react-election-widgets'.
 * @param {Object} options - Options for fetching councilMember evc data.
 * @param {number} options.yearKey - The key representing the year.
 * @param {string} options.district - The name of the district (county).
 * @param {'normal' | 'indigenous'} options.subtypeKey - The key of the subtype of the election.
 * @returns {Promise<Object>}
 */
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

/**
 * Fetch referendum election votes comparison data, need to import the return type from package '@readr-media/react-election-widgets'.
 * @param {Object} options - Options for fetching referendum evc data.
 * @param {number} options.yearKey - The key representing the year.
 * @returns {Promise<Object>}
 */
const fetchReferendumEvcData = async ({ yearKey }) => {
  const loader = new DataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
  const data = await loader.loadReferendumData({
    year: yearKey,
  })
  return data
}

/**
 * Fetch president map data in the specific level (folderName) and code (fileName).
 * @param {Object} options
 * @param {ElectionType} options.electionType - The type of election.
 * @param {number} options.yearKey - The key representing the year.
 * @param {'' | 'county' | 'town'} options.folderName - The name of the folder. Naming by its level. Empty string is the country level (no aditional folder).
 * @param {string} options.fileName - The name of the file. Naming by its level-specific code like countyCode '63000', townCode '63000010' or 'country'
 * @returns {Promise<MayorMapData>}
 */
const fetchPresidentMapData = async ({
  electionType,
  yearKey,
  folderName,
  fileName,
}) => {
  const mapDataUrl = `${gcsBaseUrl}/${yearKey}/${electionType}/map/${folderName}/${fileName}.json`
  const { data } = await axios.get(mapDataUrl)
  return data
}

/**
 * Fetch mayor map data in the specific level (folderName) and code (fileName).
 * @param {Object} options
 * @param {ElectionType} options.electionType - The type of election.
 * @param {number} options.yearKey - The key representing the year.
 * @param {'' | 'county' | 'town'} options.folderName - The name of the folder. Naming by its level. Empty string is the country level (no aditional folder).
 * @param {string} options.fileName - The name of the file. Naming by its level-specific code like countyCode '63000', townCode '63000010' or 'country'
 * @returns {Promise<PresidentMapData>}
 */
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

/**
 * Fetch the specific referendum (numberKey) map data in the specific level (folderName) and code (fileName).
 * @param {Object} options
 * @param {ElectionType} options.electionType - The type of election.
 * @param {number} options.yearKey - The key representing the year.
 * @param {'' | 'county' | 'town'} options.folderName - The name of the folder. Naming by its level. Empty string is the country level (no aditional folder).
 * @param {string} options.fileName - The name of the file. Naming by its level-specific code like countyCode '63000', townCode '63000010' or 'country'
 * @param {string} options.numberKey - The key of the referendum number.
 * @returns {Promise<ReferendumMapData>}
 */
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

/**
 * Fetch the spcific councilMember subtype map data in the specific level (folderName) and code (fileName).
 * @param {Object} options
 * @param {ElectionType} options.electionType - The type of election.
 * @param {number} options.yearKey - The key representing the year.
 * @param {'normal' | 'indigenous'} options.subtypeKey - The key of subtype of the election.
 * @param {'county' | 'town'} options.folderName - The name of the folder. Naming by its level like 'county' and 'town'.
 * @param {string} options.fileName - The name of the file. Naming by its level-specific code like countyCode '63000' and townCode '63000010'.
 * @returns {Promise<CouncilMemberMapData>}
 */
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

/**
 * Fetch the specific legislator subtype map data in the specific level (folderName) and code (fileName).
 * @param {Object} options
 * @param {ElectionType} options.electionType - The type of election.
 * @param {number} options.yearKey - The key representing the year.
 * @param {'normal' | 'mountainIndigenous' | 'plainIndigenous' | 'party'} options.subtypeKey - The key of subtype of the election.
 * @param {'county' | 'town'} options.folderName - The name of the folder. Naming by its level like 'county' and 'town'.
 * @param {string} options.fileName - The name of the file. Naming by its level-specific code like countyCode '63000' and townCode '63000010'.
 * @returns {Promise<AreaLegislatorMapData | NonAreaLegislatorMapData>}
 */
// const fetchLegislatorMapData = async ({
//   electionType,
//   yearKey,
//   subtypeKey,
//   folderName,
//   fileName,
// }) => {
//   const mapDataUrl = `${gcsBaseUrl}/${yearKey}/${electionType}/map/${folderName}/${subtypeKey}/${fileName}.json`
//   const { data } = await axios.get(mapDataUrl)
//   return data
// }

/**
 * @typedef {Object} MapObject
 * @property {0 | 1 | 2 | 3} level - The level of the map.
 * @property {null | any} currentFeature - The current feature on the map.
 * @property {string} countyId - The ID of the county.
 * @property {string} countyName - The name of the county.
 * @property {string} townId - The ID of the town.
 * @property {string} townName - The name of the town.
 * @property {string} villageId - The ID of the village.
 * @property {string} villageName - The name of the village.
 * @property {string} constituencyId - The ID of the constituency.
 * @property {string} constituencyName - The name of the constituency.
 * @property {string} activeId - The active ID.
 * @property {string} upperLevelId - The ID of the upper level, 'background', countyId, townId.
 */
/** @type {MapObject} */
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

/**
 * @typedef {function(boolean): void} BooleanCallback
 *
 * A fat hook handle all election related data (votes, mapGeoJson) fetching, refetching.
 * @param {BooleanCallback} showLoading - A callback to show loading spinner.
 * @param {boolean} showTutorial - A flag to indicate whether the tutorial is showing.
 * @param {number} width - Representing window width.
 * @returns
 */
export const useElectionData = (showLoading, showTutorial, width) => {
  const [election, setElection] = useState(
    elections.find((election) => election.electionType === defaultElectionType)
  )
  // Object to store all data for infobox, map, evc and seat chart, store by election, year, subtype and referendum number. Check type ElectionsData for more detail.
  const [electionsData, setElectionsData] = useState(
    deepCloneObj(defaultElectionsData)
  )
  const [infoboxData, setInfoboxData] = useState({})

  const [mapObject, setMapObject] = useState(defaultMapObject)
  const [shouldRefetch, setShouldRefetch] = useState(false)

  const [year, setYear] = useState(election.years[election.years.length - 1])
  //for councilMember, legislator
  const [subtype, setSubtype] = useState(
    election.subtypes?.find((subtype) => subtype.key === 'normal')
  )
  //for referendum, referendumLocal
  const [number, setNumber] = useState(
    election.years[election.years.length - 1].numbers &&
      election.years[election.years.length - 1].numbers[0]
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

  const { mapData, evcData, seatData } = electionData
  const { mapData: compareMapData } = compareElectionData || {}

  const subtypes = election.subtypes
  const numbers = getReferendumNumbers(election)

  /**
   * @typedef {Object} InfoboxData
   * @property {ElectionType} electionType
   * @property {0 | 1 | 2 | 3} level
   * @property {Object} electionData
   * @property {boolean} isRunning
   * @property {boolean} isStarted
   */

  /**
   * Prepare election related data for each election. Election-related data including evc data, map data(map, infobox), seat data.
   * Since the function is wrapped by the useCallback, the function input and output types are written inside the function.
   */
  const prepareElectionData = useCallback(
    async (
      /** @type {import('../components/helper/electionData').ElectionData} */ electionData,
      /** @type {import('../components/helper/election').Election} */ election,
      /** @type {MapObject} */ mapObject,
      /** @type {number} */ yearKey,
      /** @type {string} */ subtypeKey,
      /** @type {string} */ numberKey,
      /** @type {string} */ lastUpdate,
      /** @type {boolean} */ compareMode
    ) => {
      /** @type {import('../components/helper/electionData').ElectionData} */
      let newElectionData = electionData
      let {
        mapData: newMapData,
        evcData: newEvcData,
        seatData: newSeatData,
      } = newElectionData
      /** @type {string} */
      let newLastUpdate = lastUpdate
      const { level: currentLevel, townId, countyId } = mapObject
      const { electionType } = election
      /** @type {InfoboxData} */
      const newInfoboxData = {
        electionType,
        level: currentLevel,
        electionData: {},
        isRunning: false,
        isStarted: true,
      }

      for (let level = 0; level <= currentLevel; level++) {
        switch (electionType) {
          case 'president':
            switch (level) {
              case 0:
                if (!newEvcData[level] && !compareMode) {
                  try {
                    const data = await fetchPresidentEvcData({
                      yearKey,
                    })
                    newEvcData[level] = data
                  } catch (error) {
                    console.error(error)
                  }
                }
                if (!newMapData[level]) {
                  try {
                    const data = await fetchPresidentMapData({
                      electionType,
                      yearKey,
                      folderName: election.meta.map.folderNames[level],
                      fileName: election.meta.map.fileNames[level],
                    })
                    newMapData[level] = data
                    newMapData.isRunning = data.is_running
                    newMapData.isStarted = data.is_started
                    newLastUpdate = data.updatedAt
                  } catch (error) {
                    console.error(error)
                  }
                }
                newInfoboxData.electionData = newMapData[level]?.summary
                newInfoboxData.isRunning = newMapData.isRunning
                newInfoboxData.isStarted = newMapData.isStarted
                break
              case 1:
                if (!newMapData[level][countyId]) {
                  try {
                    const data = await fetchPresidentMapData({
                      electionType,
                      yearKey,
                      folderName: election.meta.map.folderNames[level],
                      fileName: countyId,
                    })
                    newMapData[level][countyId] = data
                    newMapData.isRunning = data.is_running
                    newMapData.isStarted = data.is_started
                    newLastUpdate = data.updatedAt
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[0]?.districts.find(
                  (district) => district.county === mapObject.activeId
                )
                newInfoboxData.isRunning = newMapData.isRunning
                newInfoboxData.isStarted = newMapData.isStarted
                break
              case 2:
                if (!newMapData[level][townId]) {
                  try {
                    const data = await fetchPresidentMapData({
                      electionType,
                      yearKey,
                      folderName: election.meta.map.folderNames[level],
                      fileName: townId,
                    })
                    newMapData[level][townId] = data
                    newMapData.isRunning = data.is_running
                    newMapData.isStarted = data.is_started
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
                newInfoboxData.isStarted = newMapData.isStarted
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
                newInfoboxData.isStarted = newMapData.isStarted
                break

              default:
                break
            }
            break
          case 'mayor':
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
                    newMapData.isStarted = data.is_started
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
                    newMapData.isStarted = data.is_started
                    newLastUpdate = data.updatedAt
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[0]?.districts.find(
                  (district) => district.county === mapObject.activeId
                )
                if (
                  !newInfoboxData.electionData &&
                  yearKey === 2022 &&
                  countyId === '10020'
                ) {
                  // 2022 chiayi city postpond the mayor election
                  newInfoboxData.electionData = '10020'
                }

                newInfoboxData.isRunning = newMapData.isRunning
                newInfoboxData.isStarted = newMapData.isStarted
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
                    newMapData.isStarted = data.is_started
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
                if (
                  !newInfoboxData.electionData &&
                  yearKey === 2022 &&
                  countyId === '10020'
                ) {
                  // 2022 chiayi city postpond the mayor election
                  newInfoboxData.electionData = '10020'
                  break
                }

                newInfoboxData.isRunning = newMapData.isRunning
                newInfoboxData.isStarted = newMapData.isStarted

                break
              case 3:
                newInfoboxData.electionData = newMapData[2][
                  townId
                ]?.districts.find(
                  (district) =>
                    district.county + district.town + district.vill ===
                    mapObject.activeId
                )
                if (
                  !newInfoboxData.electionData &&
                  yearKey === 2022 &&
                  countyId === '10020'
                ) {
                  // 2022 chiayi city postpond the mayor election
                  newInfoboxData.electionData = '10020'
                  break
                }

                newInfoboxData.isRunning = newMapData.isRunning
                newInfoboxData.isStarted = newMapData.isStarted

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
                    newMapData.isStarted = data.is_started
                    newLastUpdate = data.updatedAt
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[1][countyId]?.summary
                newInfoboxData.isRunning = newMapData.isRunning
                newInfoboxData.isStarted = newMapData.isStarted

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
                    newMapData.isStarted = data.is_started
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
                newInfoboxData.isStarted = newMapData.isStarted

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
                newInfoboxData.isStarted = newMapData.isStarted

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
                    newMapData.isStarted = data.is_started
                    newLastUpdate = data.updatedAt
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[0]?.summary
                newInfoboxData.isRunning = newMapData.isRunning
                newInfoboxData.isStarted = newMapData.isStarted

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
                    newMapData.isStarted = data.is_started
                    newLastUpdate = data.updatedAt
                  } catch (error) {
                    console.error(error)
                  }
                }

                newInfoboxData.electionData = newMapData[0]?.districts.find(
                  (district) => district.county === mapObject.activeId
                )
                newInfoboxData.isRunning = newMapData.isRunning
                newInfoboxData.isStarted = newMapData.isStarted

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
                    newMapData.isStarted = data.is_started
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
                newInfoboxData.isStarted = newMapData.isStarted

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
                newInfoboxData.isStarted = newMapData.isStarted

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

  // refetch election data, acts like `prepareElectionData`
  const refetch = useCallback(
    async (
      /** @type {import('../components/helper/electionData').ElectionData} */ newElectionData,
      /** @type {import('../components/helper/election').Election} */ election,
      /** @type {MapObject} */ mapObject,
      /** @type {number} */ yearKey,
      /** @type {string} */ subtypeKey,
      /** @type {string} */ numberKey,
      /** @type {string} */ newLastUpdate,
      /** @type {boolean} */ compareMode
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
          case 'president': {
            switch (level) {
              case 0:
                if (!compareMode) {
                  try {
                    const data = await fetchPresidentEvcData({
                      yearKey,
                    })
                    newEvcData[level] = data
                  } catch (error) {
                    console.error(error)
                  }
                }

                try {
                  const data = await fetchPresidentMapData({
                    electionType,
                    yearKey,
                    folderName: election.meta.map.folderNames[level],
                    fileName: 'country',
                  })
                  newMapData[level] = data
                  newMapData.isRunning = data.is_running
                  newMapData.isStarted = data.is_started
                  newLastUpdate = data.updatedAt
                } catch (error) {
                  console.error(error)
                }
                break
              case 1:
                try {
                  const data = await fetchPresidentMapData({
                    electionType,
                    yearKey,
                    folderName: election.meta.map.folderNames[level],
                    fileName: countyId,
                  })
                  newMapData[level][countyId] = data
                  newMapData.isRunning = data.is_running
                  newMapData.isStarted = data.is_started
                  newLastUpdate = data.updatedAt
                } catch (error) {
                  console.error(error)
                }
                break
              case 2:
                try {
                  const data = await fetchPresidentMapData({
                    electionType,
                    yearKey,
                    folderName: election.meta.map.folderNames[level],
                    fileName: townId,
                  })
                  newMapData[level][townId] = data
                  newMapData.isRunning = data.is_running
                  newMapData.isStarted = data.is_started
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
                  newMapData.isStarted = data.is_started
                  newLastUpdate = data.updatedAt
                } catch (error) {
                  console.error(error)
                }
                break
              case 1:
                try {
                  const data = await fetchMayorMapData({
                    electionType,
                    yearKey,
                    folderName: election.meta.map.folderNames[level],
                    fileName: countyId,
                  })
                  newMapData[level][countyId] = data
                  newMapData.isRunning = data.is_running
                  newMapData.isStarted = data.is_started
                  newLastUpdate = data.updatedAt
                } catch (error) {
                  console.error(error)
                }
                break
              case 2:
                try {
                  const data = await fetchMayorMapData({
                    electionType,
                    yearKey,
                    folderName: election.meta.map.folderNames[level],
                    fileName: townId,
                  })
                  newMapData[level][townId] = data
                  newMapData.isRunning = data.is_running
                  newMapData.isStarted = data.is_started
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
                  newMapData.isStarted = data.is_started
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
                  newMapData.isStarted = data.is_started
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
                  newMapData.isStarted = data.is_started
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
                  newMapData.isStarted = data.is_started
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
                  newMapData.isStarted = data.is_started
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

  /**
   * Control the evc to scroll to the specific position.
   * @param {ElectionType} electionType
   * @param {import('../components/helper/electionData').ModuleData} mapData
   * @param {string} subtypeKey
   * @param {MapObject} mapObject
   * @param {number} yearKey
   * @returns
   */
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

  // Programmatically move the map to the corresponding level and district by the evc selected value.
  const onEvcSelected = useCallback(
    (/** @type {string} */ evcSelectedValue) => {
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

          ReactGA.event({
            category: 'Projects',
            action: 'Click',
            label: `票數比較篩選器：縣市長 / ${evcSelectedValue}`,
          })

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

          const countyName = countyMappingData.find(
            (countyData) => countyData.countyCode === mapObject.countyId
          ).countyName
          ReactGA.event({
            category: 'Projects',
            action: 'Click',
            label: `票數比較篩選器：縣市議員 / ${subtype.name} / ${countyName} / ${evcSelectedValue}`,
          })

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

  /**
   * Handle states when subtype changes.
   * @param {import('../components/helper/election').ElectionSubtype} newSubtype
   */
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
    if (compareInfo.compareMode) {
      onCompareInfoChange({
        compareMode: compareInfo.compareMode,
        compareYearKey: compareInfo.filter.year.key,
        compareNumber: compareInfo.filter.number,
        compareSubtype: newSubtype,
      })
    }
    newElectionData.seatData = seatData
    setSubtype(newSubtype)
    const device = width > 1024 ? '桌機' : '手機平板'
    ReactGA.event({
      category: 'Projects',
      action: 'Click',
      label: `縣市議員切換： ${newSubtype.name} / ${device}`,
    })
  }

  const onCompareInfoChange = useCallback(
    ({ compareMode, compareYearKey, compareNumber, compareSubtype }) => {
      if (compareMode) {
        setCompareInfo(defaultCompareInfo)
      }
      setCompareInfo({
        compareMode,
        filter: {
          year: compareYearKey
            ? election.years.find((year) => year.key === compareYearKey)
            : year,
          subtype: compareSubtype || subtype,
          number: compareNumber || number,
        },
      })
    },
    [election.years, number, subtype, year]
  )

  // Handle states when referendum number changes.
  const onNumberChange = useCallback(
    (
      /** @type {import('../components/helper/election').ReferendumNumber} */ newNumber
    ) => {
      const year = election.years.find((year) => year.key === newNumber.year)
      setYear(year)
      setNumber(newNumber)
    },
    [election.years]
  )

  // Handle state change when election type is changed.
  const onElectionChange = useCallback(
    (/** @type {ElectionType} */ electionType) => {
      const newElection = elections.find(
        (election) => election.electionType === electionType
      )
      const newYear = newElection.years[newElection.years.length - 1]
      const newNumber =
        newElection.years[newElection.years.length - 1].numbers &&
        newElection.years[newElection.years.length - 1].numbers[0]
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
          return updateElectionsData(
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
    },
    []
  )

  /**
   * Handle states change when map change level or district.
   * @param {MapObject} newMapObject
   */
  const onMapObjectChange = async (newMapObject = defaultMapObject) => {
    // fetch data before map scales, useEffect will call prepareData again,
    // make sure to avoid fetch duplicate data
    showLoading(true)
    const { filter } = compareInfo
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
    if (newMapObject?.level === 1) {
      const countyName = countyMappingData.find(
        (countyData) => countyData.countyCode === newMapObject.countyId
      ).countyName
      ReactGA.event({
        category: 'Projects',
        action: 'Click',
        label: `地圖點擊 / ${election.electionName} / ${countyName}`,
      })
    }
    showLoading(false)
  }

  // Show the default election and the year after tutorial is finished.
  const onTutorialEnd = () => {
    onElectionChange('mayor')
    setYear(election.years[election.years.length - 1])
  }

  // Handle all fetching data logic for the first time.
  useEffect(() => {
    const prepareDataHandler = async () => {
      showLoading(true)
      const { filter } = compareInfo
      const [
        // @ts-ignore
        { value: electionDataResult },
        // @ts-ignore
        { value: compareElectionDataResult },
      ] = await Promise.allSettled([
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
    mapObject,
    number?.key,
    prepareElectionData,
    showLoading,
    subtype?.key,
    year?.key,
  ])

  // create interval to periodically trigger refetch and let react lifecycle to handle the refetch
  useEffect(() => {
    const interval = window.setInterval(() => {
      setShouldRefetch(true)
      // }, 100 * 60 * 1000)
    }, 1 * 60 * 1000)
    // }, 10 * 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  // Handle refetch logic to keep data sync.
  useEffect(() => {
    const refetchHandler = async () => {
      showLoading(true)

      const { filter } = compareInfo
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
          mapData.isRunning ? normalRefetch : Promise.resolve({}),
          compareMapData?.isRunning ? compareRefetch : Promise.resolve({}),
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
    mapData?.isRunning,
    mapObject,
    number?.key,
    refetch,
    shouldRefetch,
    showLoading,
    subtype?.key,
    year?.key,
  ])

  // Handle default election and year for tutorial state.
  useEffect(() => {
    if (showTutorial) {
      onElectionChange('councilMember')
      setYear(election.years[election.years.length - 2])
    }
  }, [showTutorial, onElectionChange, election.years])

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
    onTutorialEnd,
    yearInfo,
    subtypeInfo,
    numberInfo,
    compareInfo: outputCompareInfo,
    lastUpdate,
  }
}
