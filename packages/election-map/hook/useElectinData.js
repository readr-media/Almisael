import { useCallback, useEffect, useState } from 'react'
import { getElectionData, defaultElectionData } from '../utils/electionsData'
import { currentYear } from '../consts/electionsConifg'
import { countyMappingData } from '../consts/electionsConifg'
import { deepCloneObj } from '../utils/deepClone'
import ReactGA from 'react-ga'
import { prepareElectionData } from '../utils/electionsData'
import { electionActions } from '../store/election-slice'
import { useAppSelector, useAppDispatch } from './useRedux'
import {
  fetchDistrictMappingData,
  fetchDistrictWithAreaMappingData,
} from '../utils/fetchElectionData'

/**
 * @typedef {import('../consts/electionsConifg').ElectionType} ElectionType
 */

/**
 * @typedef {function(boolean): void} BooleanCallback
 *
 * A fat hook handle all election related data (votes, mapGeoJson) fetching, refetching.
 * @param {BooleanCallback} showLoading - A callback to show loading spinner.
 * @param {boolean} showTutorial - A flag to indicate whether the tutorial is showing.
 * @returns
 */
export const useElectionData = (showLoading, showTutorial) => {
  const dispatch = useAppDispatch()
  const electionConfig = useAppSelector((state) => state.election.config)
  // Object to store all data for infobox, map, evc and seat chart, store by election, year, subtype and referendum number. Check type ElectionsData for more detail.
  const electionsData = useAppSelector(
    (state) => state.election.data.electionsData
  )
  const year = useAppSelector((state) => state.election.control.year)
  //for councilMember, legislator
  const subtype = useAppSelector((state) => state.election.control.subtype)
  //for referendum, referendumLocal
  const number = useAppSelector((state) => state.election.control.number)
  const levelControl = useAppSelector((state) => state.election.control.level)
  const [shouldRefetch, setShouldRefetch] = useState(false)
  const lastUpdate = useAppSelector((state) => state.election.data.lastUpdate)
  const compareInfo = useAppSelector((state) => state.election.compare.info)
  const districtMapping = useAppSelector(
    (state) => state.election.data.districtMapping
  )

  const electionData = getElectionData(
    electionsData,
    electionConfig.electionType,
    year?.key,
    subtype?.key,
    number?.key
  )

  const compareElectionData =
    compareInfo.compareMode &&
    getElectionData(
      electionsData,
      electionConfig.electionType,
      compareInfo.filter.year?.key,
      compareInfo.filter.subtype?.key,
      compareInfo.filter.number?.key
    )

  const { mapData, evcData, seatData } = electionData
  dispatch(electionActions.changeMapData(mapData))
  dispatch(electionActions.changeEvcData(evcData))
  dispatch(electionActions.changeSeatData(seatData))

  const { mapData: compareMapData } = compareElectionData || {}

  if (compareInfo.compareMode) {
    dispatch(electionActions.changeCompareMapData(compareMapData))
  }

  /**
   * Control the evc to scroll to the specific position.
   * @param {ElectionType} electionType
   * @param {import('../components/helper/electionData').ModuleData} mapData
   * @param {string} subtypeKey
   * @param {import('../store/election-slice').LevelControl} levelControl
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
            console.error(error)
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
      const electionType = electionConfig.electionType
      switch (electionType) {
        case 'mayor': {
          // evcSelectedValue format '嘉義市'
          const countyData = countyMappingData?.find(
            (countyData) => countyData.countyName === evcSelectedValue
          )
          const target = document.querySelector(
            `#first-id-${countyData.countyCode}`
          )
          if (target) {
            let event = new MouseEvent('click', { bubbles: true })
            target.dispatchEvent(event)
          }

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
    [electionConfig.electionType, mapData, subtype, levelControl.countyCode]
  )

  // Show the default election and the year after tutorial is finished.
  const onTutorialEnd = () => {
    dispatch(electionActions.changeElection('mayor'))
    dispatch(
      electionActions.changeYear(
        electionConfig.years[electionConfig.years.length - 1]
      )
    )
  }

  // Handle all fetching data logic for the first time.
  useEffect(() => {
    const prepareDataHandler = async () => {
      showLoading(true)
      console.warn('prepareDataHandler', number?.key)
      const { filter } = compareInfo
      const [
        { value: electionDataResult },
        { value: compareElectionDataResult },
      ] = await Promise.allSettled([
        prepareElectionData(
          electionData,
          electionConfig,
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
              electionConfig,
              levelControl,
              filter?.year?.key,
              filter?.subtype?.key,
              filter?.number?.key,
              lastUpdate,
              compareInfo?.compareMode
            )
          : Promise.resolve({}),
      ])

      if (electionDataResult.newElectionData) {
        const { newElectionData, newInfoboxData, newLastUpdate } =
          electionDataResult

        dispatch(electionActions.changeInfoboxData(newInfoboxData))
        dispatch(
          electionActions.changeElectionsData({
            newElectionData,
            electionType: electionConfig.electionType,
            yearKey: year?.key,
            subtypeKey: subtype?.key,
            numberKey: number?.key,
          })
        )

        if (!compareInfo.compareMode) {
          dispatch(
            electionActions.changeEvcScrollTo(
              scrollEvcFromLevelControl(
                electionConfig.electionType,
                newElectionData.mapData,
                subtype?.key,
                levelControl,
                year?.key
              )
            )
          )
        }
        if (year?.key === currentYear) {
          dispatch(electionActions.changeLastUpdate(newLastUpdate))
        }
      }

      if (compareElectionDataResult.newElectionData) {
        const { newElectionData, newInfoboxData, newLastUpdate } =
          compareElectionDataResult
        dispatch(electionActions.changeCompareInfoboxData(newInfoboxData))

        dispatch(
          electionActions.changeElectionsData({
            newElectionData,
            electionType: electionConfig.electionType,
            yearKey: filter?.year?.key,
            subtypeKey: filter?.subtype?.key,
            numberKey: filter?.number?.key,
          })
        )

        if (filter?.key === currentYear) {
          dispatch(electionActions.changeLastUpdate(newLastUpdate))
        }
      }
      showLoading(false)
    }

    prepareDataHandler()
  }, [
    // compareElectionData,
    compareInfo,
    electionConfig,
    // electionData,
    lastUpdate,
    levelControl,
    number?.key,
    showLoading,
    subtype?.key,
    year?.key,
    dispatch,
  ])

  // fetch district mapping data if needed
  useEffect(() => {
    const prepareDistrictMappingData = async () => {
      if (electionConfig.electionType === 'legislator') {
        if (!districtMapping.districtWithArea[year.key]) {
          const data = await fetchDistrictWithAreaMappingData({
            electionType: electionConfig.electionType,
            year: year.key,
          })
          dispatch(
            electionActions.changeDistrictWithAreaMappingData({
              year: year.key,
              data,
            })
          )
        }
      } else {
        if (!districtMapping.district) {
          const data = await fetchDistrictMappingData()
          dispatch(electionActions.changeDistrictMappingData(data))
        }
      }
    }

    prepareDistrictMappingData()
  }, [dispatch, districtMapping, electionConfig.electionType, year.key])

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
        electionConfig,
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
            electionConfig,
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

      if (normalResult.newElectionData) {
        const { newElectionData, newLastUpdate } = normalResult

        dispatch(
          electionActions.changeElectionsData({
            newElectionData,
            electionType: electionConfig.electionType,
            yearKey: year?.key,
            subtypeKey: subtype?.key,
            numberKey: number?.key,
          })
        )

        if (year?.key === currentYear && newElectionData) {
          dispatch(electionActions.changeLastUpdate(newLastUpdate))
        }
      }
      if (compareResult.newElectionData) {
        const { newElectionData, newLastUpdate } = compareResult

        dispatch(
          electionActions.changeElectionsData({
            newElectionData,
            electionType: electionConfig.electionType,
            yearKey: filter?.year?.key,
            subtypeKey: filter?.subtype?.key,
            numberKey: filter?.number?.key,
          })
        )

        if (filter.year?.key === currentYear && newElectionData) {
          dispatch(electionActions.changeLastUpdate(newLastUpdate))
        }
      }

      setShouldRefetch(false)
      showLoading(false)
    }
    if (shouldRefetch) {
      refetchHandler()
    }
  }, [
    compareInfo,
    compareMapData?.isRunning,
    electionConfig,
    lastUpdate,
    mapData?.isRunning,
    levelControl,
    number?.key,
    shouldRefetch,
    showLoading,
    subtype?.key,
    year?.key,
    dispatch,
  ])

  // Handle default election and year for tutorial state.
  useEffect(() => {
    if (showTutorial) {
      dispatch(electionActions.changeElection('councilMember'))
      dispatch(
        electionActions.changeYear(
          electionConfig.years[electionConfig.years.length - 2]
        )
      )
    }
  }, [showTutorial, electionConfig.years, dispatch])

  return {
    onEvcSelected,
    onTutorialEnd,
  }
}
