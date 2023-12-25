import { useState } from 'react'
import styled from 'styled-components'

import ElectionVoteComparisonPanel from '../ElectionVoteComparisonPanel'
import { SeatsPanel } from '../SeatsPanel'
import YearComparisonMenuBar from './YearComparisonMenuBar'
import InfoboxContainer from './InfoboxContainer'
import { useAppSelector } from '../../hook/useRedux'
import { useAppDispatch } from '../../hook/useRedux'
import { electionActions } from '../../store/election-slice'
import SelectorContainer from './SeletorsContainer'

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

const TopButtonsWrapper = styled.div`
  display: flex;
  position: absolute;
  z-index: 10;
  right: 16px;
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
const StyledSelectorContainer = styled(SelectorContainer)`
  background-color: ${
    /**
     * @param {Object} props
     * @param {boolean} props.isCompareMode

     */
    ({ isCompareMode }) => (isCompareMode ? '#E9E9E9' : '#fff1db')
  };
`
/**
 * Dashboard for new election map, created in 2023.11.20
 * TODO:
 * 1. Need refactor corresponding business logic of districts in different election type.
 * 2. Rewrite state to make it more clear and clean, remove unneeded useEffect if need.
 */
export const MobileDashboardNew = ({ onEvcSelected }) => {
  const dispatch = useAppDispatch()
  const { stopCompare, changeYear } = electionActions

  const [shouldOpenYearComparisonMenuBar, setShouldOpenYearComparisonMenuBar] =
    useState(false)
  const electionsType = useAppSelector(
    (state) => state.election.config.electionType
  )

  const year = useAppSelector((state) => state.election.control.year)
  const years = useAppSelector((state) => state.election.config.years)

  const compareInfo = useAppSelector((state) => state.election.compare.info)
  const { compareMode } = compareInfo

  const handleCloseCompareMode = () => {
    setShouldOpenYearComparisonMenuBar(false)
    dispatch(stopCompare())
  }

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

        <StyledSelectorContainer isCompareMode={compareMode} />

        <ContentWrapper>
          <InfoboxContainer />
          {!compareMode && (
            <>
              <SeatsPanel isMobile={true} />
              <ElectionVoteComparisonPanel
                onEvcSelected={onEvcSelected}
                isMobile={true}
              />
            </>
          )}
        </ContentWrapper>
      </Wrapper>
    </>
  )
}
