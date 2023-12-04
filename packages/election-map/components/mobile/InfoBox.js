import styled from 'styled-components'
// import { data as mockData } from '../../mock-datas/maps/legislators/normal/county/63000.js'
import { useAppSelector } from '../../hook/useRedux'
/**
 * @typedef {import('../../utils/electionsData').InfoboxData} InfoboxData
 * @typedef {import('../../consts/electionsConifg').ElectionType} ElectionType
 * @typedef {import('../../consts/electionsConifg').ElectionSubtype} ElectionSubtype
 */

/**
 * currently use mock data 63000.js
 */

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
`
const CandidateInfo = styled.li`
  list-style: none;
  font-size: 15px;
  line-height: 21.72px;
  font-weight: 400;
  padding: 0 0 2px 0;
  border-bottom: 1px dashed #afafaf;

  .name {
    font-weight: 700;
    text-align: left;
  }
  .party-and-tks-rate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
  .tks-rate {
    font-weight: 700;
    margin-left: 4px;
  }
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

  const electionsType = useAppSelector(
    (state) => state.election.config.electionType
  )

  const hasElectionData = checkHasElectionData(electionsType, electionData)
  const getInfoboxItemJsx = (candidate) => {
    if (!candidate) {
      return null
    }
    return (
      <CandidateInfo key={candidate.canNo}>
        <div className="name">{candidate.name}</div>
        <div className="party-and-tks-rate">
          <span>{candidate.party}</span>
          <span className="tks-rate">{candidate.tksRate}%</span>
        </div>
      </CandidateInfo>
    )
  }
  // const profRate = formatProfRate()
  const getInfoboxJsx = () => {
    switch (electionsType) {
      //地方選舉
      case 'mayor':
        const candidates = electionData.candidates
        const orderedCandidates = sortCandidatesByTksRate(candidates)
        return (
          <Wrapper>
            <div className="prof-rate">投票率 {electionData?.profRate}%</div>
            <CandidatesInfoWrapper>
              {orderedCandidates.map((candidate) =>
                getInfoboxItemJsx(candidate)
              )}
            </CandidatesInfoWrapper>
          </Wrapper>
        )
      case 'councilMember':
        return electionData.map((election, index) => {
          if (!election) {
            return null
          }
          const orderedCandidates = sortCandidatesByTksRate(election.candidates)
          return (
            <Wrapper key={index}>
              <div className="prof-rate">投票率: {election?.profRate}%</div>
              <CandidatesInfoWrapper>
                {orderedCandidates.map((candidate) =>
                  getInfoboxItemJsx(candidate)
                )}
              </CandidatesInfoWrapper>
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
