import { useState, useEffect, useMemo } from 'react'

import styled from 'styled-components'
import Selector from './Selector'

import { useDistrictMapping } from '../../hook/useDistrictMapping'

import { useAppSelector } from '../../hook/useRedux'
import { useAppDispatch } from '../../hook/useRedux'
import { electionActions } from '../../store/election-slice'
import { isRecallSubtype } from '../../utils/recallValidator'
/**
 * @typedef {Object} NationData
 * @property {string} name
 * @property {string} code
 * @property {'nation'} type
 * @property {CountyData[]} sub
 */

/**
 * @typedef {Object} CountyData
 * @property {string} name
 * @property {string} code
 * @property {'county'} type
 * @property {TownData[]} sub
 */
/**
 * @typedef {Object} TownData
 * @property {string} name
 * @property {string} code
 * @property {'town'} type
 * @property {VillageData[]} sub
 */
/**
 * @typedef {Object} VillageData
 * @property {string} name
 * @property {string} code
 * @property {'village'} type
 * @property {null} sub
 * @property {string} [nickName]
 */

/**
 * @typedef {'nation' | 'county' | 'town' | 'village' | 'constituency'} DistrictType
 */

/**
 * District selector component that provides cascading dropdown functionality for location selection.
 * For recall election subtypes, the dropdowns are filtered to show only districts with actual voting data.
 *
 * The component supports three levels of selection:
 * 1. County/City level (optionsForFirstDistrictSelector) - Shows counties with voting data for recall elections
 * 2. Town/Area level (optionsForSecondDistrictSelector) - Shows towns with voting data for recall elections
 * 3. Village level (optionsForThirdDistrictSelector) - Shows villages with voting data for recall elections
 *
 * For non-recall election subtypes, all available options are shown without filtering.
 *
 * @component
 * @param {Object} props - Component props
 * @returns {JSX.Element} District selector component with three cascading dropdowns
 */

const Wrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  text-align: center;
  padding: 12px 16px;
  min-height: 100vh;
  background-color: ${
    /**
     * @param {Object} props
     * @param {boolean} [props.isCompareMode]
     */
    ({ isCompareMode }) => (isCompareMode ? '#E9E9E9' : 'transparent')
  };
`

const DistrictSelectorWrapper = styled.div`
  display: flex;
  margin: 8px auto 4px;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: start;
  justify-content: left;
  gap: 12px;
`

export default function DistrictWithAreaSelectors({}) {
  const { districtMapping, hasDistrictMapping } = useDistrictMapping()
  const allCounty = districtMapping.sub
  const [currentCountyCode, setCurrentCountyCode] = useState('')
  const [currentDistrictType, setCurrentDistrictType] = useState('nation')

  const dispatch = useAppDispatch()
  const { changeLevelControl, resetLevelControl } = electionActions

  const [currentAreaCode, setCurrentAreaCode] = useState('')
  const [currentConstituencyVillageCode, setCurrentConstituencyVillageCode] =
    useState('')
  const electionsType = useAppSelector(
    (state) => state.election.config.electionType
  )
  const currentElectionSubType = useAppSelector(
    (state) => state.election.control.subtype
  )
  const year = useAppSelector((state) => state.election.control.year)

  const electionData = useAppSelector((state) => state.election.data.mapData)
  console.log({ electionData })
  const isConstituency =
    electionsType === 'legislator' &&
    (currentElectionSubType.key === 'normal' ||
      isRecallSubtype(currentElectionSubType.key))

  const allTown = getAllTown(currentCountyCode)
  const allVillage = getAllVillage(currentAreaCode)

  function getAllTown(code) {
    if (currentDistrictType === 'nation') {
      return []
    }
    if (!code) {
      return []
    }
    const availableTownCode = electionData[1][
      currentCountyCode
    ]?.districts?.map((item) => `${item.county}${item.area}`)

    return (
      allCounty
        ?.find((item) => item?.code === code)
        ?.sub.filter((sub) => availableTownCode?.includes(sub.code)) ?? []
    )
  }

  function getAllVillage(code) {
    if (
      !code ||
      currentDistrictType === 'nation' ||
      currentDistrictType === 'county'
    ) {
      return []
    }

    return allTown?.find((item) => item?.code === code)?.sub ?? []
  }

  /**
   *
   * @param {DistrictType} type
   * @param {string} code
   */
  const handleOnClick = (type, code) => {
    setCurrentDistrictType(type)
    switch (type) {
      case 'nation':
        setCurrentCountyCode('')
        setCurrentAreaCode('')
        setCurrentConstituencyVillageCode('')
        break
      case 'county':
        setCurrentCountyCode(code)
        setCurrentAreaCode('')
        setCurrentConstituencyVillageCode('')
        break
      case 'constituency':
        setCurrentAreaCode(code)
        setCurrentConstituencyVillageCode('')
        break
      case 'village':
        setCurrentConstituencyVillageCode(code)
        break
      default:
        break
    }
  }

  const optionsForFirstDistrictSelector = useMemo(() => {
    if (isRecallSubtype(currentElectionSubType.key)) {
      const recallCountyCodes = electionData[0]?.districts
        .filter(
          (district) =>
            district &&
            district.candidates &&
            Array.isArray(district.candidates) &&
            district.candidates.length > 0
        )
        .map((district) => district.county)
      return allCounty.filter((county) => {
        return recallCountyCodes?.includes(county?.code)
      })
    }
    return allCounty
  }, [allCounty, currentElectionSubType.key, electionData])
  /**
   * Generates options for the second district selector (town/area level).
   * For recall election subtypes, filters to show only towns with actual voting data.
   *
   * Data source: electionData[0].districts (country level election data)
   * Filtering criteria: district.county === currentCountyCode && district.area exists
   *
   * @type {Array<{type: string, code: string, name: string}>}
   */
  const optionsForSecondDistrictSelector = useMemo(() => {
    if (currentCountyCode) {
      let filteredTowns = allTown
      if (isRecallSubtype(currentElectionSubType.key)) {
        try {
          // Validate election data exists and has proper structure
          if (
            !electionData ||
            !Array.isArray(electionData) ||
            !electionData[0]?.districts
          ) {
            console.warn(
              'DistrictWithAreaSelectors: Missing or invalid election data for second district filtering'
            )
            return [
              { type: 'county', code: currentCountyCode, name: '-' },
              ...allTown,
            ]
          }

          const recallAreaCodes = electionData[0].districts
            .filter(
              (district) =>
                district &&
                district.county === currentCountyCode &&
                district.area &&
                district.candidates &&
                Array.isArray(district.candidates) &&
                district.candidates.length > 0
            )
            .map((district) => district.area)
            .filter(Boolean) // Remove any undefined/null values

          if (recallAreaCodes && recallAreaCodes.length > 0) {
            filteredTowns = allTown.filter(
              (town) => town?.code && recallAreaCodes.includes(town.code)
            )
          } else {
            console.warn(
              `DistrictWithAreaSelectors: No recall area codes found for county ${currentCountyCode}`
            )
          }
        } catch (error) {
          console.error(
            'DistrictWithAreaSelectors: Error filtering second district options:',
            error
          )
          // Fallback to showing all towns on error
          filteredTowns = allTown
        }
      }

      return [
        { type: 'county', code: currentCountyCode, name: '-' },
        ...filteredTowns,
      ]
    }
    return [...allTown]
  }, [allTown, currentCountyCode, currentElectionSubType.key, electionData])
  /**
   * Generates options for the third district selector (village level).
   * For recall election subtypes, filters to show only villages with actual voting data.
   *
   * Data source: electionData[2][currentAreaCode].districts (constituency level election data)
   * Filtering criteria: district.county === currentCountyCode && district.area === currentAreaCode && district.vill exists
   *
   * @type {Array<{type: string, code: string, name: string}>}
   */
  const optionsForThirdDistrictSelector = useMemo(() => {
    if (currentAreaCode) {
      let filteredVillages = allVillage

      if (isRecallSubtype(currentElectionSubType.key)) {
        try {
          // Validate election data exists and has proper structure for village level
          if (
            !electionData ||
            !electionData[2] ||
            !electionData[2][currentAreaCode]?.districts
          ) {
            console.warn(
              'DistrictWithAreaSelectors: Missing or invalid election data for third district filtering'
            )
            return [
              { type: 'constituency', code: currentAreaCode, name: '-' },
              ...allVillage,
            ]
          }

          const recallVillageCodes = electionData[2][currentAreaCode].districts
            .filter(
              (district) =>
                district &&
                district.county === currentCountyCode &&
                district.area === currentAreaCode &&
                district.vill &&
                district.candidates &&
                Array.isArray(district.candidates) &&
                district.candidates.length > 0
            )
            .map((district) => district.vill)
            .filter(Boolean) // Remove any undefined/null values

          if (recallVillageCodes && recallVillageCodes.length > 0) {
            filteredVillages = allVillage.filter(
              (village) =>
                village?.code && recallVillageCodes.includes(village.code)
            )
          } else {
            console.warn(
              `DistrictWithAreaSelectors: No recall village codes found for area ${currentAreaCode}`
            )
          }
        } catch (error) {
          console.error(
            'DistrictWithAreaSelectors: Error filtering third district options:',
            error
          )
          // Fallback to showing all villages on error
          filteredVillages = allVillage
        }
      }

      return [
        { type: 'constituency', code: currentAreaCode, name: '-' },
        ...filteredVillages,
      ]
    }
    return [...allVillage]
  }, [
    allVillage,
    currentAreaCode,
    currentCountyCode,
    currentElectionSubType.key,
    electionData,
  ])

  useEffect(() => {
    if (!hasDistrictMapping) {
      return
    }
    // 為什麼需要將不相關的state `year`與 `electionType` 加入dependency?
    // 因為會希望當年份或選制改變時，也能夠觸發dispatch `changeLevelControl`，避免infobox無法出現。
    // 這個workaround違反了useEffect對dependency的設計原則，日後有時間需要調整。
    let level = 0
    switch (currentDistrictType) {
      case 'nation':
        dispatch(resetLevelControl())
        return
      case 'county':
        level = 1
        dispatch(
          changeLevelControl({
            level,
            countyCode: currentCountyCode,
            townCode: '',
            villageCode: '',
            areaCode: '',
            activeCode: currentCountyCode,
          })
        )
        break

      case 'constituency':
        level = 2
        dispatch(
          changeLevelControl({
            level,
            countyCode: currentCountyCode,
            townCode: '',
            villageCode: '',
            areaCode: currentAreaCode,
            activeCode: currentAreaCode,
          })
        )
        break
      case 'village':
        level = 3
        dispatch(
          changeLevelControl({
            level,
            countyCode: currentCountyCode,
            townCode: '',
            villageCode: currentConstituencyVillageCode,
            areaCode: currentAreaCode,
            activeCode: currentConstituencyVillageCode,
          })
        )
        break

      default:
        break
    }
  }, [
    dispatch,
    resetLevelControl,
    electionsType,
    year,
    currentDistrictType,
    currentElectionSubType,
    changeLevelControl,
    currentCountyCode,
    currentAreaCode,
    currentConstituencyVillageCode,
    hasDistrictMapping,
  ])
  useEffect(() => {
    if (isRecallSubtype(currentElectionSubType.key)) {
      setCurrentDistrictType('county')
      setCurrentCountyCode('65000')
    }
  }, [])
  useEffect(() => {
    if (!hasDistrictMapping) {
      return
    }

    switch (electionsType) {
      case 'mayor':
        break
      case 'councilMember':
        break

      case 'president':
        break
      case 'legislator':
        if (!currentCountyCode) {
          setCurrentDistrictType('county')
          setCurrentCountyCode(allCounty?.[0]?.code)
        }
        break
      //todo: 公投
      case 'referendum':
        break
      default:
        break
    }
  }, [
    hasDistrictMapping,
    electionsType,
    allCounty,
    allTown,
    currentCountyCode,
    setCurrentCountyCode,
    setCurrentDistrictType,
    currentAreaCode,
    isConstituency,
  ])

  if (!hasDistrictMapping) {
    return <Wrapper>loading....</Wrapper>
  }

  return (
    <DistrictSelectorWrapper>
      <Selector
        options={optionsForFirstDistrictSelector}
        districtCode={currentCountyCode}
        onSelected={handleOnClick}
        placeholderValue="台灣"
      ></Selector>

      <Selector
        options={optionsForSecondDistrictSelector}
        districtCode={currentAreaCode}
        onSelected={handleOnClick}
        placeholderValue="-"
      ></Selector>
      <Selector
        shouldShowNickName={true}
        options={optionsForThirdDistrictSelector}
        districtCode={currentConstituencyVillageCode}
        onSelected={handleOnClick}
        placeholderValue="-"
      ></Selector>
    </DistrictSelectorWrapper>
  )
}
