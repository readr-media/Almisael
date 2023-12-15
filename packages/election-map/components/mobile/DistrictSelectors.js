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
  align-items: center;
  justify-content: left;
  gap: 12px;
`

export default function DistrictSelectors({}) {
  const { districtMapping, hasDistrictMapping } = useDistrictMapping()
  const allCounty = districtMapping.sub
  const [currentDistrictType, setCurrentDistrictType] = useState('nation')

  const dispatch = useAppDispatch()
  const { changeLevelControl, resetLevelControl } = electionActions

  const [currentCountyCode, setCurrentCountyCode] = useState('')
  const [currentTownCode, setCurrentTownCode] = useState('')
  const [currentVillageCode, setCurrentVillageCode] = useState('')
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

  const allVillage = getAllVillage(currentTownCode)

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

    return allTown?.find((item) => item.code === code)?.sub ?? []
  }

  /**
   *
   * @param {DistrictType} type
   * @param {string} code
   */
  const handleOnClick = (
    type = districtMapping.type,
    code = districtMapping.code
  ) => {
    setCurrentDistrictType(type)
    switch (type) {
      case 'nation':
        setCurrentCountyCode('')
        setCurrentTownCode('')
        setCurrentVillageCode('')
        break
      case 'county':
        setCurrentCountyCode(code)
        setCurrentTownCode('')
        setCurrentVillageCode('')
        break
      case 'town':
        setCurrentTownCode(code)
        setCurrentVillageCode('')
        break
      case 'village':
        setCurrentVillageCode(code)
        break
      default:
        break
    }
  }

  const optionsForFirstDistrictSelector = useMemo(() => {
    switch (electionsType) {
      case 'mayor':
      case 'councilMember':
      case 'legislator':
        return [...districtMapping.sub]
      case 'referendum':
      case 'president':
        return [
          {
            type: districtMapping.type,
            code: districtMapping.code,
            name: districtMapping.name,
          },
          ...districtMapping.sub,
        ]

      default:
        break
    }
  }, [electionsType, districtMapping])
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
    if (currentTownCode) {
      return [{ type: 'town', code: currentTownCode, name: '-' }, ...allVillage]
    }
    return [...allVillage]
  }, [allVillage, currentTownCode])

  // //clean up
  // useEffect(() => {
  //   if (currentDistrictType === 'nation') {
  //     setCurrentCountyCode('')
  //     setCurrentTownCode('')
  //     // setCurrentConstituencyCode('')
  //     setCurrentVillageCode('')
  //   } else if (currentDistrictType === 'county') {
  //     setCurrentTownCode('')

  //     setCurrentVillageCode('')
  //   } else if (currentDistrictType === 'town') {
  //     setCurrentVillageCode('')
  //   }
  // }, [currentDistrictType, setCurrentCountyCode])
  useEffect(() => {
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
            constituencyCode: '',
            activeCode: currentCountyCode,
          })
        )
        break
      case 'town':
        level = 2
        dispatch(
          changeLevelControl({
            level,
            countyCode: currentCountyCode,
            townCode: currentTownCode,
            villageCode: '',
            constituencyCode: '',
            activeCode: currentTownCode,
          })
        )
        break
      // case 'constituency':
      //   level = 2
      //   dispatch(
      //     changeLevelControl({
      //       level,
      //       countyCode: currentCountyCode,
      //       townCode: '',
      //       villageCode: '',
      //       constituencyCode: currentConstituencyCode,
      //       activeCode: currentConstituencyCode,
      //     })
      //   )
      //   break
      case 'village':
        level = 3
        dispatch(
          changeLevelControl({
            level: 3,
            countyCode: currentCountyCode,
            townCode: currentTownCode,
            villageCode: currentVillageCode,
            constituencyCode: '',
            activeCode: currentVillageCode,
          })
        )
        break
      default:
        break
    }
  }, [
    dispatch,
    year,
    electionsType,
    currentElectionSubType,
    resetLevelControl,
    currentDistrictType,
    changeLevelControl,
    currentCountyCode,
    currentTownCode,
    currentVillageCode,
    isConstituency,
  ])
  useEffect(() => {
    if (!hasDistrictMapping) {
      return
    }

    switch (electionsType) {
      case 'mayor':
        if (!currentCountyCode) {
          setCurrentDistrictType('county')
          setCurrentCountyCode(allCounty?.[0]?.code)
        }
        break
      case 'councilMember':
        if (!currentCountyCode) {
          setCurrentDistrictType('county')
          setCurrentCountyCode(allCounty?.[0]?.code)
        }

        break
      //TODO: 中央選舉
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
  ])

  const test = () => {
    dispatch(
      changeLevelControl({
        level: 3,
        countyCode: currentCountyCode,
        townCode: currentTownCode,
        villageCode: currentVillageCode,
        constituencyCode: '',
        activeCode: currentVillageCode,
      })
    )
  }
  if (!hasDistrictMapping) {
    return <Wrapper>loading....</Wrapper>
  }
  return (
    <>
      <DistrictSelectorWrapper>
        <Selector
          options={optionsForFirstDistrictSelector}
          districtCode={currentCountyCode}
          onSelected={handleOnClick}
          placeholderValue="台灣"
        ></Selector>

        <Selector
          options={optionsForSecondDistrictSelector}
          districtCode={currentTownCode}
          onSelected={handleOnClick}
          placeholderValue="-"
        ></Selector>

        <Selector
          options={optionsForThirdDistrictSelector}
          districtCode={currentVillageCode}
          onSelected={handleOnClick}
          placeholderValue="-"
        ></Selector>
      </DistrictSelectorWrapper>

      <>
        <button onClick={test}>測試DistrictSelector</button>
        <div>currentDistrictType:{currentDistrictType}</div>
        <div>currentCountyCode:{currentCountyCode}</div>
        {/* <div>currentConstituencyCode:{currentConstituencyCode}</div> */}
        <div>currentTownCode:{currentTownCode}</div>
        <div>currentVillageCode:{currentVillageCode}</div>
      </>
    </>
  )
}
