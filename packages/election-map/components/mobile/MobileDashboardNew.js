import { useState, useEffect, Fragment } from 'react'
import { electionNamePairs } from '../../utils/election'
import Selector from './Selector'
import ElectionSelector from './ElectionSelector'
import styled from 'styled-components'
import InfoBox from './InfoBox'
import YearComparisonMenuBar from './YearComparisonMenuBar'
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
const SelectorWrapper = styled.div`
  padding: 0 16px;
`
const DistrictSelectorWrapper = styled.div`
  display: flex;
  margin: 8px auto 0;
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
`
const YearWrapper = styled(TopButton)`
  width: fit-content;
  margin: 17px 0 6px;
`

/**
 * Dashboard for new election map, created in 2023.11.20
 */
export const MobileDashboardNew = () => {
  const { districtMapping, hasDistrictMapping } = useDistrictMapping()
  // const [currentElection, setCurrentElection] = useState(ELECTION_TYPE[0])
  const dispatch = useAppDispatch()
  const {
    stopCompare,
    changeLevelControl,
    changeYear,
    resetLevelControl,
    changeElection,
    changeSubtype,
  } = electionActions
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
  const [currentOpenSelector, setCurrentOpenSelector] = useState('')

  /** @type {CountyData[]} */
  const allCounty = districtMapping.sub

  /** @type {TownData[]} */
  const allTown = getAllTown(currentCountyCode)

  /** @type {VillageData[]} */
  const allVillage = getAllVillage(currentTownCode)

  const currentDistrictCode = getCurrentDistrictCode()

  function getCurrentDistrictCode() {
    switch (currentDistrictType) {
      case 'nation':
        return districtMapping.code
      case 'county':
        return currentCountyCode
      case 'town':
        return currentTownCode
      case 'village':
        return currentVillageCode

      default:
        return districtMapping.code
    }
  }

  function getAllTown(code) {
    if (currentDistrictType === 'nation') {
      return null
    }
    if (!code) {
      return null
    }

    return allCounty.find((item) => item.code === code).sub
  }
  function getAllVillage(code) {
    if (currentDistrictType === 'nation' || currentDistrictType === 'county') {
      return null
    }
    if (!code) {
      return null
    }
    return allTown?.find((item) => item.code === code).sub
  }
  const nationAndAllCounty = [
    {
      type: districtMapping.type,
      code: districtMapping.code,
      name: districtMapping.name,
    },
    ...districtMapping.sub,
  ]
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
  const infoboxData = useAppSelector((state) => state.election.data.infoboxData)
  const currentElectionSubType = useAppSelector(
    (state) => state.election.control.subtype
  )
  const compareInfo = useAppSelector((state) => state.election.compare.info)
  const { compareMode } = compareInfo

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
    dispatch(changeElection(electionsType))
    if (currentElectionSubType) {
      dispatch(changeSubtype(currentElectionSubType))
    }
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
    changeElection,
    changeSubtype,
    currentElectionSubType,
    electionsType,
    resetLevelControl,
    currentDistrictType,
    changeLevelControl,
    currentCountyCode,
    currentTownCode,
    currentVillageCode,
  ])

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
        <SelectorWrapper>
          <ElectionSelectorWrapper>
            <ElectionSelector
              options={electionNamePairs}
              selectorType="electionType"
              handleOpenSelector={setCurrentOpenSelector}
              currentOpenSelector={currentOpenSelector}
            />
            {electionSubTypes && (
              <ElectionSelector
                selectorType="electionSubType"
                options={electionSubTypes}
                handleOpenSelector={setCurrentOpenSelector}
                currentOpenSelector={currentOpenSelector}
              />
            )}
          </ElectionSelectorWrapper>
          <DistrictSelectorWrapper>
            <Selector
              selectorType="districtNationAndCounty"
              options={nationAndAllCounty}
              districtCode={currentCountyCode}
              onSelected={handleOnClick}
              currentOpenSelector={currentOpenSelector}
              handleOpenSelector={setCurrentOpenSelector}
              placeholderValue="全國"
            ></Selector>

            <Selector
              selectorType="districtTown"
              options={allTown}
              districtCode={currentTownCode}
              onSelected={handleOnClick}
              currentOpenSelector={currentOpenSelector}
              handleOpenSelector={setCurrentOpenSelector}
              placeholderValue="-"
            ></Selector>

            <Selector
              selectorType="districtVillage"
              options={allVillage}
              districtCode={currentVillageCode}
              onSelected={handleOnClick}
              currentOpenSelector={currentOpenSelector}
              handleOpenSelector={setCurrentOpenSelector}
              placeholderValue="-"
            ></Selector>
          </DistrictSelectorWrapper>
          {/* todo: add select mode */}
          {currentDistrictType !== 'referendum' && (
            <Fragment key={year.key}>
              {compareMode && <YearWrapper as="div">{year.key}</YearWrapper>}
              <InfoBox infoboxData={infoboxData}></InfoBox>
            </Fragment>
          )}
        </SelectorWrapper>
        {/* <div>electionTypeYears: {JSON.stringify(electionTypeYears)}</div> */}
        {/* <div>selectedYears: {JSON.stringify(selectedYears)}</div> */}
        {/* <div>currentElectionType: {currentElection.electionType}</div> */}
        {/* <div>
          currentElectionSubType: {JSON.stringify(currentElectionSubType)}
        </div> */}
        <button
          onClick={() => {
            dispatch(
              changeLevelControl({
                level: 2,
                countyCode: currentCountyCode,
                townCode: currentTownCode,
                villageCode: currentVillageCode,
                constituencyCode: '',
                activeCode: currentTownCode,
              })
            )
          }}
        >
          測試
        </button>
        <div>electionsType: {electionsType}</div>
        <div>currentDistrictType: {currentDistrictType}</div>
        <div>currentCountyCode: {currentCountyCode}</div>
        <div>currentTownCode: {currentTownCode}</div>
        <div>currentVillageCode: {currentVillageCode}</div>
        <div>currentDistrictCode: {currentDistrictCode}</div>
        <div>infobox result: </div>
        {/* <div>{JSON.stringify(infoboxData)}</div> */}
      </Wrapper>
    </>
  )
}
