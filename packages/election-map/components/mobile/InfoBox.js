import styled from 'styled-components'
// import { data as mockData } from '../../mock-datas/maps/legislators/normal/county/63000.js'
import { useAppSelector } from '../../hook/useRedux'
import { useState } from 'react'
/**
 * @typedef {import('../../utils/electionsData').InfoboxData} InfoboxData
 * @typedef {import('../../consts/electionsConifg').ElectionType} ElectionType
 * @typedef {import('../../consts/electionsConifg').ElectionSubtype} ElectionSubtype
 */

/**
 * currently use mock data 63000.js
 */

const calculateMaxHeightOfInfoBox = (
  candidatesAmount,
  shouldShowExpandButton,
  shouldInfoBoxExpand
) => {
  if (!shouldShowExpandButton) {
    return '100%'
  }
  if (shouldInfoBoxExpand) {
    return '500vh'
  } else {
    return '210px'
  }
}

const electedSvg = (
  <svg
    className="elected"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 8C15 8.91925 14.8189 9.8295 14.4672 10.6788C14.1154 11.5281 13.5998 12.2997 12.9497 12.9497C12.2997 13.5998 11.5281 14.1154 10.6788 14.4672C9.8295 14.8189 8.91925 15 8 15C7.08075 15 6.1705 14.8189 5.32122 14.4672C4.47194 14.1154 3.70026 13.5998 3.05025 12.9497C2.40024 12.2997 1.88463 11.5281 1.53285 10.6788C1.18106 9.8295 1 8.91925 1 8C1 7.08075 1.18106 6.1705 1.53285 5.32122C1.88463 4.47194 2.40024 3.70026 3.05025 3.05025C3.70026 2.40024 4.47194 1.88463 5.32122 1.53284C6.1705 1.18106 7.08075 1 8 1C8.91925 1 9.8295 1.18106 10.6788 1.53284C11.5281 1.88463 12.2997 2.40024 12.9497 3.05025C13.5998 3.70026 14.1154 4.47194 14.4672 5.32122C14.8189 6.17049 15 7.08075 15 8Z"
      stroke="#DB4C65"
      stroke-width="2"
    />
    <line
      x1="8.19995"
      y1="0.799988"
      x2="8.19995"
      y2="15.2"
      stroke="#DB4C65"
      stroke-width="2"
    />
    <line
      x1="8.40062"
      y1="8.03659"
      x2="2.54783"
      y2="11.8693"
      stroke="#DB4C65"
      stroke-width="2"
    />
  </svg>
)

const Wrapper = styled.section`
  border-top: 1px solid #000;
  .prof-rate {
    font-size: 16px;
    line-height: 23.17px;
    text-align: end;
    color: #666666;
    font-weight: 700;
    padding: 4px;
    border-bottom: 1px solid black;
  }
`

const CandidatesInfoWrapper = styled.ul`
  list-style-type: none;
  margin: 4px auto 0;
  padding: 0;
  max-height: ${
    /**
     * @param {Object} props
     * @param {string} props.maxHeight
     */
    ({ maxHeight }) => maxHeight && maxHeight
  };
  min-height: 100%;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
`
const CandidateInfo = styled.li`
  list-style: none;

  overflow: hidden;
  width: 100%;

  font-size: 15px;
  line-height: 21.72px;
  font-weight: 400;
  padding: 0 0 2px 0;
  border-bottom: 1px dashed #afafaf;
  position: relative;
  z-index: 0;
  color: ${
    /**
     * @param {Object} props
     * @param {boolean} props.isVictor
     */
    ({ isVictor }) => (isVictor ? '#db4c65' : 'black')
  };
  .name {
    font-weight: 700;
    text-align: left;
  }
  .party-and-tks-rate {
    display: flex;
    justify-content: space-between;
    align-items: start;
    text-align: left;
  }

  .tks-rate {
    font-weight: 700;
    margin-left: 4px;
  }
  .elected {
    display: ${({ isVictor }) => (isVictor ? 'block' : 'none')};
    position: absolute;
    left: -20px;
    top: 4px;
    width: 16px;
    height: 16px;
  }
`
const ExpendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 4px;
  gap: 6px;
  .triangle {
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 8px 4px 0 4px;
    border-color: #000 transparent transparent transparent;
    transform: ${
      /**
       * @param {Object} props
       * @param {boolean} props.shouldInfoBoxExpand
       */
      ({ shouldInfoBoxExpand }) =>
        shouldInfoBoxExpand ? 'rotate(180deg)' : 'rotate(0deg)'
    };
    transition: transform 0.1s ease-in-out;
  }
`
const Divider = styled.div`
  height: 3px;
  margin-top: 5px;
  background-color: #000;
`
/**
 *
 * @param {ElectionType} electionsType
 * @param {InfoboxData['electionData']} electionData
 */
const checkHasElectionData = (electionsType, electionData) => {
  if (!electionData) {
    return false
  }
  switch (electionsType) {
    //地方選舉
    case 'mayor':
      return Boolean(electionData?.candidates)
    case 'councilMember':
      return Array.isArray(electionData) && electionData.length

    //中央選舉
    case 'legislator':
      return false
    case 'president':
      return false
    case 'referendum':
      return false
    default:
      return false
  }
}

/**
 *
 * @param {Array} candidates
 */
const sortCandidatesByTksRate = (candidates) => {
  if (!candidates || !Array.isArray(candidates) || !candidates.length) {
    return []
  }
  return [...candidates].sort((cand1, cand2) => {
    if (cand1.tksRate === cand2.tksRate) {
      return 0
    }
    return cand1.tksRate < cand2.tksRate ? 1 : -1
  })
}

/**
 *
 * @param {Object} props
 * @param {InfoboxData | Object} props.infoboxData
 * @returns
 */
export default function InfoBox({ infoboxData }) {
  const { electionData } = infoboxData
  const [shouldInfoBoxExpand, setShouldInfoBoxExpand] = useState(false)
  const electionsType = useAppSelector(
    (state) => state.election.config.electionType
  )
  const handleExpand = () => {
    setShouldInfoBoxExpand((pre) => !pre)
  }
  const hasElectionData = checkHasElectionData(electionsType, electionData)
  const getInfoboxItemJsx = (candidate) => {
    if (!candidate) {
      return null
    }
    const isVictor = candidate.candVictor === '*'
    return (
      <CandidateInfo isVictor={isVictor} key={candidate.canNo}>
        {electedSvg}
        <div className="name">{candidate.name}</div>
        <div className="party-and-tks-rate">
          <span className="party">{candidate.party}</span>
          <span className="tks-rate">{candidate.tksRate}%</span>
        </div>
      </CandidateInfo>
    )
  }
  /**
   * @param {boolean} shouldShowExpandButton
   */
  const getExpendButtonJsx = (shouldShowExpandButton) => {
    if (!shouldShowExpandButton) {
      return null
    }
    return (
      <ExpendButton
        shouldInfoBoxExpand={shouldInfoBoxExpand}
        onClick={handleExpand}
      >
        {shouldInfoBoxExpand ? '收合' : '展開'}
        <i className="triangle" />
      </ExpendButton>
    )
  }
  const getInfoboxJsx = () => {
    switch (electionsType) {
      //地方選舉
      case 'mayor':
        const candidates = electionData.candidates
        const orderedCandidates = sortCandidatesByTksRate(candidates)
        const candidatesAmount = orderedCandidates.length
        const shouldShowExpandButton = candidatesAmount > 5
        const maxHeight = calculateMaxHeightOfInfoBox(
          candidatesAmount,
          shouldShowExpandButton,
          shouldInfoBoxExpand
        )
        const expendButtonJsx = getExpendButtonJsx(shouldShowExpandButton)
        return (
          <Wrapper>
            {expendButtonJsx}
            {shouldShowExpandButton && <Divider />}
            <div className="prof-rate">投票率 {electionData?.profRate}%</div>

            <CandidatesInfoWrapper maxHeight={maxHeight}>
              {orderedCandidates.map((candidate) =>
                getInfoboxItemJsx(candidate)
              )}
            </CandidatesInfoWrapper>
            {shouldShowExpandButton && <Divider />}
          </Wrapper>
        )
      case 'councilMember':
        return electionData.map((election, index) => {
          if (!election) {
            return null
          }

          const orderedCandidates = sortCandidatesByTksRate(election.candidates)

          const candidatesAmount = orderedCandidates.length
          const shouldShowExpandButton = candidatesAmount > 5
          const maxHeight = calculateMaxHeightOfInfoBox(
            candidatesAmount,
            shouldShowExpandButton,
            shouldInfoBoxExpand
          )
          const expendButtonJsx = getExpendButtonJsx(shouldShowExpandButton)

          return (
            <Wrapper key={index}>
              {expendButtonJsx}
              {shouldShowExpandButton && <Divider />}

              <div className="prof-rate">投票率: {election?.profRate}%</div>
              <CandidatesInfoWrapper maxHeight={maxHeight}>
                {orderedCandidates.map((candidate) =>
                  getInfoboxItemJsx(candidate)
                )}
              </CandidatesInfoWrapper>
              {shouldShowExpandButton && <Divider />}
            </Wrapper>
          )
        })
      //TODO: 公投
      case 'referendum':
        return null
      //TODO: 中央選舉
      case 'legislator':
        return null
      case 'president':
        return null

      default:
        return null
    }
  }
  const infoboxJsx = hasElectionData ? getInfoboxJsx() : null

  return <>{infoboxJsx}</>
}
