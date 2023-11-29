import { useCallback, useEffect, useState } from 'react'
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
import { prepareElectionData } from '../utils/electionsData'

/**
 * @typedef {import('../consts/electionsConifg').ElectionType} ElectionType
 */

/**
 * @typedef {Object} LevelControl
 * @property {0 | 1 | 2 | 3} level - The level of the map.
 * @property {string} countyCode - The id of the county.
 * @property {string} townCode - The id of the town.
 * @property {string} villageCode - The id of the village.
 * @property {string} constituencyCode - The id of the constituency.
 * @property {string} activeCode - The district id with lowest level use to decide which infobox data will be used.
 */
/** @type {LevelControl} */
const defaultLevelControl = {
  level: 0,
  countyCode: '',
  townCode: '',
  villageCode: '',
  constituencyCode: '',
  activeCode: '',
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
 * @returns
 */
export const useElectionData = (showLoading, showTutorial) => {
  const [election, setElection] = useState(
    elections.find((election) => election.electionType === defaultElectionType)
  )
  // Object to store all data for infobox, map, evc and seat chart, store by election, year, subtype and referendum number. Check type ElectionsData for more detail.
  const [electionsData, setElectionsData] = useState(
    deepCloneObj(defaultElectionsData)
  )
  const [infoboxData, setInfoboxData] = useState({})

  const [levelControl, setLevelControl] = useState(defaultLevelControl)
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
  const [evcScrollTo, setEvcScrollTo] = useState('')
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
   * Control the evc to scroll to the specific position.
   * @param {ElectionType} electionType
   * @param {import('../components/helper/electionData').ModuleData} mapData
   * @param {string} subtypeKey
   * @param {LevelControl} levelControl
   * @param {number} yearKey
   * @returns
   */
  const scrollEvcFromLevelControl = (
    electionType,
    mapData,
    subtypeKey,
    levelControl,
    yearKey
  ) => {
    let newScrollTo
    switch (electionType) {
      case 'mayor': {
        const countyCode = levelControl.countyCode
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
            const countyMapData = mapData[1][levelControl.countyCode]
            const targetDistrict = countyMapData?.districts.find(
              (district) =>
                district.county + district.town === levelControl.townCode
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
            const countyMapData = mapData[1][levelControl.countyCode]
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
            (countyData) => countyData.countyCode === levelControl.countyCode
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
    [election.electionType, mapData, subtype, levelControl.countyCode]
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
      setLevelControl(defaultLevelControl)
      setInfoboxData({})
      setEvcScrollTo('')
      setCompareInfo(defaultCompareInfo)
    },
    []
  )

  /**
   * Handle states change when map change level or district.
   * @param {LevelControl} newLevelControl
   */
  const onLevelControlChange = async (
    newLevelControl = defaultLevelControl
  ) => {
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
        newLevelControl,
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
            newLevelControl,
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
          scrollEvcFromLevelControl(
            election.electionType,
            newElectionData.mapData,
            subtype?.key,
            newLevelControl,
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
    setLevelControl(newLevelControl)
    if (newLevelControl?.level === 1) {
      const countyName = countyMappingData.find(
        (countyData) => countyData.countyCode === newLevelControl.countyCode
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
        { value: electionDataResult },
        { value: compareElectionDataResult },
      ] = await Promise.allSettled([
        prepareElectionData(
          electionData,
          election,
          levelControl,
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
              levelControl,
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
            scrollEvcFromLevelControl(
              election.electionType,
              newElectionData.mapData,
              subtype?.key,
              levelControl,
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
    levelControl,
    number?.key,
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
      const normalRefetch = prepareElectionData(
        deepCloneObj(defaultElectionData),
        election,
        levelControl,
        year?.key,
        subtype?.key,
        number?.key,
        lastUpdate,
        compareInfo?.compareMode,
        true
      )
      const compareRefetch = compareInfo.compareMode
        ? prepareElectionData(
            deepCloneObj(defaultElectionData),
            election,
            levelControl,
            filter.year?.key,
            filter.subtype?.key,
            filter.number?.key,
            lastUpdate,
            compareInfo?.compareMode,
            true
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
    levelControl,
    number?.key,
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
    outputEvcData = evcData[1][levelControl.countyCode]
  } else {
    outputEvcData = evcData[0]
  }
  let outputSeatData
  if (election.electionType === 'councilMember') {
    outputSeatData = seatData[1][levelControl.countyCode]
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
    levelControl,
    setLevelControl: onLevelControlChange,
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
