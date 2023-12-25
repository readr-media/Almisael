import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { electionNamePairs } from '../../utils/election'
import ElectionSelector from './ElectionSelector'
import ReferendumSelector from './ReferendumSelector'
import DistrictSelectors from './DistrictSelectors'
import DistrictWithAreaSelectors from './DistrictWithAreaSelectors'
import { useDistrictMapping } from '../../hook/useDistrictMapping'
import useDetectScrollDirection from '../../hook/useDetectScrollDirection'
import { useAppSelector } from '../../hook/useRedux'
import { useInView } from 'react-intersection-observer'
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
const ElectionSelectorWrapper = styled(DistrictSelectorWrapper)`
  justify-content: left;
  gap: 12px;
  margin: 40px auto 0;
`

const FixedWrapper = styled.div`
  position: sticky;
  top: 0px;
  z-index: 1;
  padding: 40px 24px 0;

  visibility: ${
    /**
     * @param {Object} props
     * @param {boolean} props.shouldShow
     */
    ({ shouldShow }) => (shouldShow ? 'visible' : 'hidden')
  };
  opacity: ${({ shouldShow }) => (shouldShow ? '1' : '0')};
  transition: all 0.2s linear;
`
/**
 * For detecting should activate hook `useDetectScrollDirection`.
 * If this component is in view, then not activate hook, vice versa.
 */
const Detecter = styled.div`
  width: 100%;
  height: 1px;
  background-color: transparent;
  transform: translateY(-70px);
`
/**
 * TODO:
 * 1. Need refactor corresponding business logic of districts in different election type.
 * 2. Rewrite state to make it more clear and clean, remove unneeded useEffect if need.
 */
export default function SelectorsContainer({ className = '' }) {
  const { hasDistrictMapping } = useDistrictMapping()
  const [shouldActivate, setShouldActivate] = useState(false)
  const { scrollDirection } = useDetectScrollDirection(20, shouldActivate)
  const [ref, inView] = useInView()
  const electionsType = useAppSelector(
    (state) => state.election.config.electionType
  )
  const electionSubTypes = useAppSelector(
    (state) => state.election.config.subtypes
  )
  const currentElectionSubtype = useAppSelector(
    (state) => state.election.control.subtype
  )
  const compareInfo = useAppSelector((state) => state.election.compare.info)
  const { compareMode } = compareInfo
  const shouldShowDistrictWithAreaSelectors =
    electionsType === 'legislator' && currentElectionSubtype.key === 'normal'
  useEffect(() => {
    setShouldActivate(!inView)
  }, [inView])

  if (!hasDistrictMapping) {
    return <Wrapper>loading....</Wrapper>
  }

  return (
    <>
      <FixedWrapper
        className={className}
        shouldShow={scrollDirection === 'up' || scrollDirection === 'stale'}
      >
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
        {shouldShowDistrictWithAreaSelectors ? (
          <DistrictWithAreaSelectors key="DistrictWithAreaSelectors"></DistrictWithAreaSelectors>
        ) : (
          <DistrictSelectors key="DistrictSelectors"></DistrictSelectors>
        )}
      </FixedWrapper>

      <Detecter ref={ref} />
    </>
  )
}
