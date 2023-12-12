import { useState, useEffect, useMemo } from 'react'
import { electionNamePairs } from '../../utils/election'
import styled from 'styled-components'
import Selector from './Selector'
import ElectionSelector from './ElectionSelector'
import ReferendumSelector from './ReferendumSelector'
import ElectionVoteComparisonPanel from '../ElectionVoteComparisonPanel'

import YearComparisonMenuBar from './YearComparisonMenuBar'
import { useDistrictMapping } from '../../hook/useDistrictMapping'
import InfoboxContainer from './InfoboxContainer'
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
 * @typedef {'nation' | 'county' | 'town' | 'village'} DistrictType
 */

const TopButtonsWrapper = styled.div`
  display: flex;
  justify-content: end;
  gap: 8px;
  flex-wrap: wrap;
  margin-left: 40px;
`
const TopButton = styled.button`
  display: block;
  border-radius: 8px;
  border: 1px solid black;
  padding: 4px 7px;
  background-color: ${
    /**
     *
     * @param {Object} props
     * @param {boolean} [props.isSelected]
     */
    ({ isSelected }) => (isSelected ? '#ff8585' : '#fff')
  };
  font-size: 14px;
  line-height: 20.27px;
  font-weight: 500;
`
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
const ContentWrapper = styled.div`
  padding: 0 24px;
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
const ElectionSelectorWrapper = styled(DistrictSelectorWrapper)`
  justify-content: left;
  gap: 12px;
  margin: 40px auto 0;
`

/**
 * Dashboard for new election map, created in 2023.11.20
 */
export const MobileDashboardNew = ({ onEvcSelected }) => {
  const { districtMapping, hasDistrictMapping } = useDistrictMapping()
  // const [currentElection, setCurrentElection] = useState(ELECTION_TYPE[0])
  const dispatch = useAppDispatch()
  const { stopCompare, changeLevelControl, changeYear, resetLevelControl } =
    electionActions
  // const [currentElectionSubType, setCurrentElectionSubType] = useState(
  //   ELECTION_TYPE[3]?.subtypes[0]
  // )

  // const electionTypeYears = currentElection.years
  // const defaultYears = currentElection.years[currentElection.years.length - 1]
  // const [selectedYears, setSelectedYears] = useState([defaultYears])

  const [shouldOpenYearComparisonMenuBar, setShouldOpenYearComparisonMenuBar] =
    useState(false)

  const [currentDistrictType, setCurrentDistrictType] = useState('nation')
  const [currentCountyCode, setCurrentCountyCode] = useState('')
  const [currentTownCode, setCurrentTownCode] = useState('')
  const [currentVillageCode, setCurrentVillageCode] = useState('')

  /** @type {CountyData[]} */
  const allCounty = districtMapping.sub

  /** @type {TownData[]} */
  const allTown = getAllTown(currentCountyCode)

  /** @type {VillageData[]} */
  const allVillage = getAllVillage(currentTownCode)

  function getAllTown(code) {
    if (currentDistrictType === 'nation') {
      return []
    }
    if (!code) {
      return []
    }

    return allCounty?.find((item) => item.code === code)?.sub
  }

  function getAllVillage(code) {
    if (currentDistrictType === 'nation' || currentDistrictType === 'county') {
      return []
    }
    if (!code) {
      return []
    }
    return allTown?.find((item) => item.code === code).sub
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
        break
      case 'county':
        setCurrentCountyCode(code)
        break
      case 'town':
        setCurrentTownCode(code)
        break
      case 'village':
        setCurrentVillageCode(code)
        break
      default:
        break
    }
  }

  const handleCloseCompareMode = () => {
    setShouldOpenYearComparisonMenuBar(false)
    dispatch(stopCompare())
  }
  const electionsType = useAppSelector(
    (state) => state.election.config.electionType
  )
  const electionSubTypes = useAppSelector(
    (state) => state.election.config.subtypes
  )

  const year = useAppSelector((state) => state.election.control.year)
  const years = useAppSelector((state) => state.election.config.years)

  const compareInfo = useAppSelector((state) => state.election.compare.info)
  const { compareMode } = compareInfo

  const optionsForFirstDistrictSelector = useMemo(() => {
    switch (electionsType) {
      case 'mayor':
      case 'councilMember':
        return [...districtMapping.sub]
      case 'referendum':
      case 'president':
      case 'legislator':
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
  useEffect(() => {
    if (currentDistrictType === 'nation') {
      setCurrentCountyCode('')
      setCurrentTownCode('')
      setCurrentVillageCode('')
    } else if (currentDistrictType === 'county') {
      setCurrentTownCode('')
      setCurrentVillageCode('')
    } else if (currentDistrictType === 'town') {
      setCurrentVillageCode('')
    }
  }, [currentDistrictType])
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
      case 'village':
        level = 3
        dispatch(
          changeLevelControl({
            level,
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
    resetLevelControl,
    currentDistrictType,
    changeLevelControl,
    currentCountyCode,
    currentTownCode,
    currentVillageCode,
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
      case 'legislator':
        break
      //todo: 公投
      case 'referendum':
        break
      default:
        break
    }
  }, [hasDistrictMapping, electionsType, allCounty, allTown, currentCountyCode])
  const topButtonJsx = compareMode ? (
    <TopButton onClick={handleCloseCompareMode}>離開</TopButton>
  ) : (
    <>
      {electionsType !== 'referendum' &&
        years.map((y) => (
          <TopButton
            isSelected={year.key === y.key}
            key={y.key}
            onClick={() => {
              dispatch(changeYear(y))
            }}
          >
            {y.key}
          </TopButton>
        ))}
      <TopButton onClick={() => setShouldOpenYearComparisonMenuBar(true)}>
        比較
      </TopButton>
    </>
  )

  if (!hasDistrictMapping) {
    return <Wrapper>loading....</Wrapper>
  }
  return (
    <>
      {shouldOpenYearComparisonMenuBar && (
        <YearComparisonMenuBar
          setShouldOpenYearComparisonMenuBar={
            setShouldOpenYearComparisonMenuBar
          }
        />
      )}
      <Wrapper isCompareMode={compareMode}>
        <TopButtonsWrapper>{topButtonJsx}</TopButtonsWrapper>
        <ContentWrapper>
          <ElectionSelectorWrapper>
            <ElectionSelector
              options={electionNamePairs}
              selectorType="electionType"
            />
            {electionSubTypes && (
              <ElectionSelector
                selectorType="electionSubType"
                options={electionSubTypes}
              />
            )}
            {electionsType === 'referendum' && !compareMode ? (
              <ReferendumSelector></ReferendumSelector>
            ) : null}
          </ElectionSelectorWrapper>
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
          <InfoboxContainer />
        </ContentWrapper>
        {!compareMode && (
          <ElectionVoteComparisonPanel
            onEvcSelected={onEvcSelected}
            isMobile={true}
          />
        )}
      </Wrapper>
    </>
  )
}
