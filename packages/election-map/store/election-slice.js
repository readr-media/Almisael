import { createSlice } from '@reduxjs/toolkit'
import {
  defaultElectionConfig,
  electionsConfig,
} from '../consts/electionsConfig'
import {
  defaultElectionData,
  defaultEvcData,
  defaultMapData,
  defaultSeatData,
  generateDefaultElectionsData,
  getElectionData,
  updateElectionsData,
} from '../utils/electionsData'

/**
 * @typedef {import('../consts/electionsConfig').ElectionType } ElectionType
 * @typedef {import('../consts/electionsConfig').ElectionSubtype} ElectionSubtype
 * @typedef {import('../consts/electionsConfig').Year} Year
 * @typedef {import('../consts/electionsConfig').ReferendumNumber} ReferendumNumber
 *
 * @typedef {Object} LevelControl
 * @property {0 | 1 | 2 | 3} level - The level of the map.
 * @property {string} countyCode - The id of the county.
 * @property {string} townCode - The id of the town.
 * @property {string} villageCode - The id of the village.
 * @property {string} areaCode - The id of the area.
 * @property {string} activeCode - The district id with lowest level use to decide which infobox data will be used.
 *
 * @typedef {Object} Control
 * @property {LevelControl} level - The level control object.
 * @property {Year} year - The year of the rendering election.
 * @property {ReferendumNumber} number - The displaying referendum number.
 * @property {ElectionSubtype} subtype - The displaying subtype of election.
 * @property {string} evcScrollTo - The string (some id) that evc will use to scroll.
 */

/**
 * Find the latest year that supports a specific subtype
 * @param {Year[]} years - Array of year configurations
 * @param {string} subtypeKey - The subtype key to search for
 * @returns {Year|null} Latest compatible year or null
 */
function findLatestYearForSubtype(years, subtypeKey) {
  if (!subtypeKey) return years[years.length - 1] // fallback to latest

  const compatibleYears = years.filter((year) =>
    year.subType?.includes(subtypeKey)
  )

  return compatibleYears.length > 0
    ? compatibleYears[compatibleYears.length - 1] // latest compatible
    : null
}

const defaultElectionsData = generateDefaultElectionsData()

/** @type {LevelControl} */
const defaultLevelControl = {
  level: 0,
  countyCode: '',
  townCode: '',
  villageCode: '',
  areaCode: '',
  activeCode: '',
}

/** @type {Control} */
const defaultControl = {
  level: defaultLevelControl,
  year: defaultElectionConfig.years[defaultElectionConfig.years.length - 1],
  number:
    defaultElectionConfig.years[defaultElectionConfig.years.length - 1]
      .numbers &&
    defaultElectionConfig.years[defaultElectionConfig.years.length - 1]
      .numbers[0],
  subtype: defaultElectionConfig.subtypes?.find(
    (subtype) => subtype.key === 'recall-july'
  ),
  evcScrollTo: '',
}

const defaultCompareInfo = {
  compareMode: false,
  filter: {
    year: null,
    subtype: null,
    number: null,
  },
}

/** @type {import('../utils/electionsData').InfoboxData} */
const defaultInfoboxData = {
  electionType: defaultElectionConfig.electionType,
  level: defaultControl.level.level,
  electionData: null,
  isRunning: false,
  isStarted: true,
}

const initialElectionState = {
  config: defaultElectionConfig,
  data: {
    electionsData: defaultElectionsData,
    infoboxData: defaultInfoboxData,
    mapData: defaultMapData,
    seatData: defaultSeatData,
    evcData: defaultEvcData,
    lastUpdate: '',
    districtMapping: {
      district: null,
      districtWithArea: {},
    },
    currentYearElectionState: {
      isRunning: false,
      isStarted: false,
    },
  },
  compare: {
    info: defaultCompareInfo,
    infoboxData: {},
    mapData: {},
  },
  control: defaultControl,
}

const electionsSlice = createSlice({
  name: 'elections',
  initialState: initialElectionState,
  reducers: {
    changeElection(state, action) {
      /** @type {ElectionType} */
      const newElectionType = action.payload
      const newElectionConfig = electionsConfig.find(
        (electionsConfig) => electionsConfig.electionType === newElectionType
      )
      // NOTE: Smart default subtype selection
      const newSubtype =
        newElectionConfig.subtypes?.find(
          (subtype) => subtype.key === 'normal'
        ) || newElectionConfig.subtypes?.[0] // fallback to first subtype

      // NOTE: Find latest year that supports the selected subtype
      const newYear = findLatestYearForSubtype(
        newElectionConfig.years,
        newSubtype?.key
      )
      const newNumber = newYear?.numbers && newYear.numbers[0]
      // Preview the new election data,
      // if the election is running then reset the data to trigger refetch.
      const newElectionData = getElectionData(
        state.data.electionsData,
        newElectionType,
        newYear?.key,
        newSubtype?.key,
        newNumber?.key
      )
      if (newElectionData.mapData.isRunning) {
        state.data.electionsData = updateElectionsData(
          state.data.electionsData,
          defaultElectionData,
          newElectionType,
          newYear?.key,
          newSubtype?.key,
          newNumber?.key
        )
      }

      state.config = newElectionConfig
      state.control = {
        ...defaultControl,
        year: newYear,
        number: newNumber,
        subtype: newSubtype,
      }
      state.data.infoboxData = defaultInfoboxData
      state.compare = {
        info: defaultCompareInfo,
        infoboxData: {},
        mapData: {},
      }
    },
    changeElectionsData(state, action) {
      const { newElectionData, electionType, yearKey, subtypeKey, numberKey } =
        action.payload
      switch (electionType) {
        case 'president':
        case 'mayor': {
          state.data.electionsData[electionType][yearKey] = newElectionData
          break
        }

        case 'legislator':
        case 'councilMember': {
          console.warn(
            newElectionData,
            electionType,
            yearKey,
            subtypeKey,
            numberKey
          )
          state.data.electionsData[electionType][yearKey][subtypeKey] =
            newElectionData
          break
        }

        case 'referendum': {
          state.data.electionsData[electionType][yearKey][numberKey] =
            newElectionData
          break
        }
        default:
          break
      }
    },
    changeYear(state, action) {
      const newYear = action.payload
      state.control.year = newYear
    },
    changeSubtype(state, action) {
      /** @type {ElectionSubtype} */
      const newSubtype = action.payload

      // NOTE: Auto-adjust year for recall-july
      if (newSubtype.key === 'recall-july') {
        const recallYear = state.config.years.find((year) =>
          year.subType?.includes('recall-july')
        )
        if (recallYear) {
          state.control.year = recallYear // Auto-set to 2025
        }
      } else {
        // NOTE: Ensure current year is valid for new subtype
        const currentYear = state.control.year
        const isYearValidForSubtype = currentYear?.subType?.includes(
          newSubtype.key
        )

        if (!isYearValidForSubtype) {
          // Find latest compatible year
          const compatibleYear = findLatestYearForSubtype(
            state.config.years,
            newSubtype.key
          )
          if (compatibleYear) {
            state.control.year = compatibleYear
          }
        }
      }

      // CouncilMember share the same seat data between subtypes.
      if (state.config.electionType === 'councilMember') {
        const oldElectionData = getElectionData(
          state.data.electionsData,
          state.config.electionType,
          state.control.year?.key,
          state.control.subtype?.key,
          state.control.number?.key
        )
        const newElectionData = getElectionData(
          state.data.electionsData,
          state.config.electionType,
          state.control.year?.key,
          newSubtype?.key,
          state.control.number?.key
        )
        // [to-do] check if the seat data is sync to the state.data.electionsData
        newElectionData.seatData = oldElectionData.seatData
      } else if (state.config.electionType === 'legislator') {
        const oldElectionData = getElectionData(
          state.data.electionsData,
          state.config.electionType,
          state.control.year?.key,
          state.control.subtype?.key,
          state.control.number?.key
        )
        const newElectionData = getElectionData(
          state.data.electionsData,
          state.config.electionType,
          state.control.year?.key,
          newSubtype?.key,
          state.control.number?.key
        )
        newElectionData.seatData.all = oldElectionData.seatData.all
        state.control.level = defaultLevelControl
      }
      if (state.compare.info.compareMode) {
        state.compare.info.filter.subtype = newSubtype
      }
      state.data.infoboxData = defaultInfoboxData
      state.control.subtype = newSubtype
    },
    changeNumber(state, action) {
      /** @type {ReferendumNumber} */
      const newNumber = action.payload
      const newYear = state.config.years.find(
        (year) => year.key === newNumber.year
      )

      state.control.year = newYear
      state.control.number = newNumber
    },
    changeInfoboxData(state, action) {
      state.data.infoboxData = action.payload
    },
    changeLastUpdate(state, action) {
      state.data.lastUpdate = action.payload
    },
    changeEvcScrollTo(state, action) {
      state.control.evcScrollTo = action.payload
    },
    changeLevelControl(state, action) {
      state.control.level = action.payload
    },
    resetLevelControl(state) {
      state.control.level = defaultLevelControl
    },
    startCompare(state, action) {
      const { compareYearKey, compareNumber, compareSubtype } = action.payload
      const { year, number, subtype } = state.control
      state.compare.info.compareMode = true
      state.compare.info.filter = {
        year: compareYearKey
          ? state.config.years.find((year) => year.key === compareYearKey)
          : year,
        subtype: compareSubtype || subtype,
        number: compareNumber || number,
      }
    },
    stopCompare(state) {
      state.compare = initialElectionState.compare
    },
    changeCompareInfoboxData(state, action) {
      state.compare.infoboxData = action.payload
    },
    changeCompareMapData(state, action) {
      state.compare.mapData = action.payload
    },
    changeMapData(state, action) {
      state.data.mapData = action.payload
    },
    changeEvcData(state, action) {
      state.data.evcData = action.payload
    },
    changeSeatData(state, action) {
      state.data.seatData = action.payload
    },
    changeDistrictMappingData(state, action) {
      state.data.districtMapping.district = action.payload
    },
    changeDistrictWithAreaMappingData(state, action) {
      const { year, data } = action.payload
      state.data.districtMapping.districtWithArea[year] = data
    },
    changeCurrentYearElectionState(state, action) {
      state.data.currentYearElectionState = action.payload
    },
  },
})

export const electionActions = electionsSlice.actions
export default electionsSlice.reducer
