import { useState, useEffect, useMemo } from 'react'

import styled from 'styled-components'
import Selector from './Selector'

import { useDistrictMapping } from '../../hook/useDistrictMapping'

import { useAppSelector } from '../../hook/useRedux'
import { useAppDispatch } from '../../hook/useRedux'
import { electionActions } from '../../store/election-slice'
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

  const isConstituency =
    electionsType === 'legislator' && currentElectionSubType.key === 'normal'

  const allTown = getAllTown(currentCountyCode)
  const allVillage = getAllVillage(currentAreaCode)

  function getAllTown(code) {
    if (currentDistrictType === 'nation') {
      return []
    }
    if (!code) {
      return []
    }

    return allCounty?.find((item) => item.code === code)?.sub ?? []
  }

  function getAllVillage(code) {
    if (
      !code ||
      currentDistrictType === 'nation' ||
      currentDistrictType === 'county'
    ) {
      return []
    }

    return allTown?.find((item) => item.code === code)?.sub
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
    return allCounty
  }, [allCounty])
  const optionsForSecondDistrictSelector = useMemo(() => {
    if (currentCountyCode) {
      return [
        { type: 'county', code: currentCountyCode, name: '-' },
        ...allTown,
      ]
    }
    return [...allTown]
  }, [allTown, currentCountyCode])
  const optionsForThirdDistrictSelector = useMemo(() => {
    if (currentAreaCode) {
      return [
        { type: 'constituency', code: currentAreaCode, name: '-' },
        ...allVillage,
      ]
    }
    return [...allVillage]
  }, [allVillage, currentAreaCode])

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
