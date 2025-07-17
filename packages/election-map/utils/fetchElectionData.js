import widgets from '@readr-media/react-election-widgets'
import axios from 'axios'

import { environment } from '../consts/config'

const gcsBaseUrl =
  environment === 'dev'
    ? 'https://whoareyou-gcs.readr.tw/elections-dev'
    : 'https://whoareyou-gcs.readr.tw/elections'

const EVCDataLoader = widgets.VotesComparison.DataLoader
const SCDataLoader = widgets.SeatChart.DataLoader

/**
 * @typedef {import("../consts/electionsConfig").ElectionType} ElectionType
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
 * @property {string | null} area - The code of area (選區). Could be null if the level have no related info.
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
 * @property {CouncilMemberMapDistrict} [summary] - Only county level has it. The voting info summaried by every area. For the infobox to show info for each area.
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
 * @property {string | null} area - The code of area (選區). Could be null if the level have no related info.
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
 *
 */

/**
 * Fetch seat data in specific level and code (fileName).
 * @param {Object} options - Options for fetching council member seat data.
 * @param {number} options.yearKey - The key representing the year.
 * @param {string} options.countyCode - The code of the county.
 * @returns {Promise<SeatsData>} A promise that resolves to the fetched seat data.
 */
export const fetchCouncilMemberSeatData = async ({ yearKey, countyCode }) => {
  const loader = new SCDataLoader({ apiUrl: gcsBaseUrl })
  const data = await loader.loadCouncilMemberData({ year: yearKey, countyCode })
  return data
}

/**
 * @param {Object} options - Options for fetching legislator seat data
 * @param {string} options.subtype - The subtype of the legislator.
 * @param {number} options.yearKey - The key representing the year.
 * @param {string} [options.countyCode] - The code of the county, only used for normal legislator.
 */
export const fetchLegislatorSeatData = async ({
  subtype,
  yearKey,
  countyCode,
}) => {
  const loader = new SCDataLoader({ apiUrl: gcsBaseUrl })
  let data
  switch (subtype) {
    case 'all':
      data = await loader.loadAllLegislatorData({ year: yearKey })
      break
    case 'normal':
    case 'recall-july':
      data = await loader.loadAreaLegislatorData({ year: yearKey, countyCode })
      break
    case 'mountainIndigenous':
      data = await loader.loadMountainIndigenousLegislatorData({
        year: yearKey,
      })
      break
    case 'plainIndigenous':
      data = await loader.loadPlainIndigenousLegislatorData({ year: yearKey })
      break
    case 'party':
      data = await loader.loadPartyLegislatorData({ year: yearKey })
      break
    default:
      console.error('fetchLegislatorSeatData without valid subtype', subtype)
      break
  }
  return data
}

/**
 * Fetch president election votes comparison data, need to import the return type from package '@readr-media/react-election-widgets'.
 * @param {Object} options - Options for fetching president evc data.
 * @param {number} options.yearKey - The key representing the year.
 * @returns {Promise<Object>}
 */
export const fetchPresidentEvcData = async ({ yearKey }) => {
  const loader = new EVCDataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
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
export const fetchMayorEvcData = async ({ yearKey }) => {
  const loader = new EVCDataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
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
 * @param {string} options.subtypeKey - The key of the subtype of the election.
 * @returns {Promise<Object>}
 */
export const fetchCouncilMemberEvcData = async ({
  yearKey,
  district,
  subtypeKey,
}) => {
  const loader = new EVCDataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
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
export const fetchReferendumEvcData = async ({ yearKey }) => {
  const loader = new EVCDataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
  const data = await loader.loadReferendumData({
    year: yearKey,
  })
  return data
}

/**
 * Fetch legislator election votes comparison data, need to import the return type from package '@readr-media/react-election-widgets'.
 * @param {Object} options - Options for fetching legislator evc data.
 * @param {number} options.yearKey - The key representing the year.
 * @param {string} [options.district] - The name of the district (county).
 * @param {string} options.subtypeKey - The key of the subtype of the election.
 * @returns {Promise<Object>}
 */
export const fetchLegislatorEvcData = async ({
  yearKey,
  subtypeKey,
  district = '',
}) => {
  if (subtypeKey === 'recall-july') {
    const loader = new EVCDataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
    const data = await loader.loadRecallData({
      year: yearKey,
      recallType: 'recall',
      district,
    })
    return data
  }
  let subtype =
    subtypeKey === 'normal' || subtypeKey === 'recall-july'
      ? 'district'
      : subtypeKey
  const loader = new EVCDataLoader({ version: 'v2', apiUrl: gcsBaseUrl })
  const data = await loader.loadLegislatorData({
    year: yearKey,
    subtype,
    district,
  })

  return data
}

/**
 * Fetch president map data in the specific level (folderName) and code (fileName).
 * @param {Object} options
 * @param {ElectionType} options.electionType - The type of election.
 * @param {number} options.yearKey - The key representing the year.
 * @param {string} options.folderName - The name of the folder. Naming by its level. Empty string is the country level (no aditional folder).
 * @param {string} options.fileName - The name of the file. Naming by its level-specific code like countyCode '63000', townCode '63000010' or 'country'
 * @returns {Promise<MayorMapData>}
 */
export const fetchPresidentMapData = async ({
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
 * @param {string} options.folderName - The name of the folder. Naming by its level. Empty string is the country level (no aditional folder).
 * @param {string} options.fileName - The name of the file. Naming by its level-specific code like countyCode '63000', townCode '63000010' or 'country'
 * @returns {Promise<PresidentMapData>}
 */
export const fetchMayorMapData = async ({
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
 * @param {string} options.folderName - The name of the folder. Naming by its level. Empty string is the country level (no aditional folder).
 * @param {string} options.fileName - The name of the file. Naming by its level-specific code like countyCode '63000', townCode '63000010' or 'country'
 * @param {string} options.numberKey - The key of the referendum number.
 * @returns {Promise<ReferendumMapData>}
 */
export const fetchReferendumMapData = async ({
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
 * @param {string} options.subtypeKey - The key of subtype of the election.
 * @param {string} options.folderName - The name of the folder. Naming by its level like 'county' and 'town'.
 * @param {string} options.fileName - The name of the file. Naming by its level-specific code like countyCode '63000' and townCode '63000010'.
 * @returns {Promise<CouncilMemberMapData>}
 */
export const fetchCouncilMemberMapData = async ({
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
 * @param {string} options.subtypeKey - The key of subtype of the election.
 * @param {string} options.folderName - The name of the folder. Naming by its level like 'county' and 'town'.
 * @param {string} options.fileName - The name of the file. Naming by its level-specific code like countyCode '63000' and townCode '63000010'.
 * @returns {Promise<AreaLegislatorMapData | NonAreaLegislatorMapData>}
 */
export const fetchLegislatorMapData = async ({
  electionType,
  yearKey,
  subtypeKey,
  folderName,
  fileName,
}) => {
  let transformedSubtype
  switch (subtypeKey) {
    case 'normal':
      transformedSubtype = 'normal'
      break
    case 'recall-july':
      // NOTE: switch for running or finish GCS resources
      transformedSubtype = 'recall-july'
      // transformedSubtype = 'recall-july-dev'
      break
    case 'mountainIndigenous':
      transformedSubtype = 'mountain-indigenous'
      break
    case 'plainIndigenous':
      transformedSubtype = 'plain-indigenous'
      break
    case 'party':
      transformedSubtype = 'party'
      break

    default:
      break
  }
  const mapDataUrl = `${gcsBaseUrl}/${yearKey}/${electionType}/map/${folderName}/${transformedSubtype}/${fileName}.json`
  const { data } = await axios.get(mapDataUrl)
  return data
}

/**
 * Fetch the district mapping data (counties - towns - villages)
 */
export const fetchDistrictMappingData = async () => {
  let mappingDataUrl = `${gcsBaseUrl}/district-mapping/district/mapping.json`
  const { data } = await axios.get(mappingDataUrl)
  return data
}

/**
 * Fetch the district with area mapping data (counties - areas - villages)
 * @param {Object} options
 * @param {ElectionType} options.electionType
 * @param {number} options.year
 */
export const fetchDistrictWithAreaMappingData = async ({
  electionType,
  year,
}) => {
  let mappingDataUrl = `${gcsBaseUrl}/district-mapping/district-with-area/${electionType}/${year}/mapping.json`

  const { data } = await axios.get(mappingDataUrl)
  return data
}
