import styled from 'styled-components'
// import { data as mockData } from '../../mock-datas/maps/legislators/normal/county/63000.js'
import { useAppSelector } from '../../hook/useRedux'
import { useState } from 'react'
import { getInfoBoxData } from '../../utils/infoboxData'
import gtag from '../../utils/gtag'
/**
 * @typedef {import('../../utils/electionsData').InfoboxData} InfoboxData
 * @typedef {import('../../consts/electionsConfig').ElectionType} ElectionType
 * @typedef {import('../../consts/electionsConfig').ElectionSubtype} ElectionSubtype
 */

/**
 *  Inside infobox data, a summary object or district object may have a note object
 *  which is special description to the current infobox data.
 *  The note object only exists when needed and the text must exist to describe the situation.
 *  The note.displayVotes flag is used for infobox component to decide if the infobox data should still be displayed.
 * @typedef {Object} InfoboxNote
 * @property {string} text - note content to add additional description to the current infobox data
 * @property {boolean} displayVotes - a flag to indicate whether the following infobox data should display or not
 */

const HEIGHT = '46.44px'
const calculateMaxHeightOfInfoBox = (
  candidatesAmount,
  shouldShowExpandButton,
  shouldInfoBoxExpand,
  closedHeight = '232px'
) => {
  if (!shouldShowExpandButton) {
    return '100%'
  }
  if (shouldInfoBoxExpand) {
    return `calc(${candidatesAmount} * ${HEIGHT} + 100vh)`
  } else {
    return closedHeight
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
    &--text-align-start {
      text-align: start;
    }
    .range {
      font-size: 14px;
      line-height: 20.27px;
      color: #000;
    }
    .range-note {
      font-size: 12px;
      line-height: 21.6px;
      color: #000;
    }
  }
`
const ReferendumWrapper = styled(Wrapper)`
  .prof-rate {
    margin-bottom: 4px;
  }
  .result {
    font-size: 15px;
    line-height: 21.72px;
    font-weight: 700;
    color: #000;
    border-bottom: 1px dashed #afafaf;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.pass-result {
      color: #1c8450;
    }
    &.no-pass-result {
      color: #ff8585;
    }
    .rate {
      margin-left: auto;
    }
    .pass-or-no-pass {
      display: block;
      width: 50px;
      text-align: end;
    }
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
  transition: max-height 1s 0s ease-in-out;
  overflow: hidden;
`
const CandidateInfo = styled.li`
  list-style: none;
  &:last-child {
    border: none;
  }
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
    align-items: center;
    text-align: left;
  }

  .tks-rate {
    font-weight: 700;
    margin-left: 4px;
    width: 56px;
    text-align: end;
  }
  .elected {
    display: ${({ isVictor }) => (isVictor ? 'block' : 'none')};
    margin-left: auto;
    min-width: 16px;
    min-height: 16px;
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

const WrapperForCouncilMemberFirstLevel = styled.div`
  min-height: 100%;
  max-height: ${
    /**
     * @param {Object} props
     * @param {string} props.maxHeight
     */
    ({ maxHeight }) => maxHeight && maxHeight
  };
  overflow: hidden;
  transition: max-height 1s ease-in-out;
`

const InfoboxWrapper = styled.div``
const InfoNote = styled.p`
  font-size: 15px;
  line-height: 21.72px;
  font-weight: 400;
  padding: 6px 0 10px;
  border-bottom: 1px solid black;
  text-align: start;
  margin-bottom: 4px;
  &.no-border-margin {
    margin-bottom: 0px;
    border: none;
  }
`

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
 * @param {number} props.year
 */
export default function InfoBox({ infoboxData, year }) {
  const { level, electionData, isStarted, isRunning } = infoboxData
  const [shouldInfoBoxExpand, setShouldInfoBoxExpand] = useState(false)
  const electionsType = useAppSelector(
    (state) => state.election.config.electionType
  )
  const currentElectionSubType = useAppSelector(
    (state) => state.election.control.subtype
  )
  const handleExpand = () => {
    setShouldInfoBoxExpand((pre) => !pre)
    gtag.sendGAEvent('Click', {
      project: `infobox 展開 / 收合`,
    })
  }
  const getInfoboxDataOnCertainElectionType = getInfoBoxData(
    electionsType,
    'mobile'
  )

  const getInfoboxItemJsx = (candidate) => {
    if (!candidate) {
      return null
    }
    const isVictor = candidate.candVictor === '*'
    return (
      <CandidateInfo isVictor={isVictor} key={candidate.canNo}>
        <div className="name">{candidate.name}</div>
        <div className="party-and-tks-rate">
          <span className="party">{candidate.party}</span>
          {electedSvg}
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
      case 'mayor': {
        const infoboxData = getInfoboxDataOnCertainElectionType(
          electionData,
          level,
          year,
          isStarted,
          isRunning
        )
        /** @type {InfoboxNote | undefined} */
        const note = infoboxData?.note
        if (typeof infoboxData === 'string') {
          return <div>{infoboxData}</div>
        }
        if (note?.text && !note?.displayVotes) {
          return (
            <Wrapper>
              <InfoNote>{note?.text}</InfoNote>
            </Wrapper>
          )
        }
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
            {!!note?.text && <InfoNote>{note?.text}</InfoNote>}

            <CandidatesInfoWrapper maxHeight={maxHeight}>
              {orderedCandidates.map((candidate) =>
                getInfoboxItemJsx(candidate)
              )}
            </CandidatesInfoWrapper>
            {shouldShowExpandButton && <Divider />}
          </Wrapper>
        )
      }
      case 'councilMember': {
        const infoboxData = getInfoboxDataOnCertainElectionType(
          electionData,
          level,
          year,
          isStarted,
          isRunning
        )
        if (typeof infoboxData === 'string') {
          return <div>{infoboxData}</div>
        }
        let districtName = ''
        if (level === 1) {
          /** @type {InfoboxNote | undefined} */
          const note = infoboxData?.note
          if (note?.text && !note?.displayVotes) {
            return (
              <Wrapper>
                <InfoNote>{note.text}</InfoNote>
              </Wrapper>
            )
          }

          const districtsAmount = infoboxData.districts.map((district) => {
            return district?.candidates?.length ?? 0
          })

          const candidatesAmount = districtsAmount.reduce(
            (accumulator, currentValue) => accumulator + currentValue
          )
          const shouldShowExpandButton = candidatesAmount > 5
          const expendButtonJsx = getExpendButtonJsx(shouldShowExpandButton)
          const maxHeight = calculateMaxHeightOfInfoBox(
            candidatesAmount,
            shouldShowExpandButton,
            shouldInfoBoxExpand,
            '310px'
          )
          return (
            <div style={{ borderTop: 'solid 1px #000' }}>
              {expendButtonJsx}
              {shouldShowExpandButton && <Divider />}
              {note?.text && (
                <InfoNote className="no-border-margin">{note.text}</InfoNote>
              )}

              <WrapperForCouncilMemberFirstLevel maxHeight={maxHeight}>
                {infoboxData.districts.map((district, index) => {
                  if (
                    !district?.candidates ||
                    !Array.isArray(district.candidates) ||
                    !district.candidates.length
                  ) {
                    return null
                  }

                  const orderedCandidates = sortCandidatesByTksRate(
                    district.candidates
                  )

                  if (district?.type === 'plainIndigenous') {
                    districtName = '平地原住民'
                  } else if (district?.type === 'mountainIndigenous') {
                    districtName = '山地原住民'
                  } else {
                    districtName = district?.range ?? ''
                  }
                  return (
                    <Wrapper key={index}>
                      <div className="prof-rate prof-rate--text-align-start">
                        <div className="range">{districtName}</div>
                        <div>投票率: {district?.profRate}%</div>
                      </div>
                      <CandidatesInfoWrapper maxHeight={'100%'}>
                        {orderedCandidates.map((candidate) =>
                          getInfoboxItemJsx(candidate)
                        )}
                      </CandidatesInfoWrapper>
                    </Wrapper>
                  )
                })}
              </WrapperForCouncilMemberFirstLevel>
              {shouldShowExpandButton && <Divider />}
            </div>
          )
        }

        // check the type of InfoboxNote for the business logic of the note
        // use one of the note
        /** @type {InfoboxNote | undefined} */
        const note = infoboxData.find((data) => !!data.note?.text)?.note
        if (note?.text && !note?.displayVotes) {
          return (
            <Wrapper>
              <InfoNote>{note.text}</InfoNote>
            </Wrapper>
          )
        }
        return infoboxData.map((election, index) => {
          if (!election) {
            return null
          }
          if (election?.type === 'plainIndigenous') {
            districtName = '平地原住民'
          } else if (election?.type === 'mountainIndigenous') {
            districtName = '山地原住民'
          } else {
            districtName = ''
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
          const profRateClassName = districtName
            ? 'prof-rate prof-rate--text-align-start'
            : 'prof-rate'
          return (
            <Wrapper key={index}>
              {expendButtonJsx}
              {shouldShowExpandButton && <Divider />}

              <div className={profRateClassName}>
                {districtName ? (
                  <div className="range">{districtName}</div>
                ) : null}
                <div>投票率: {election?.profRate}%</div>
              </div>
              {!!note?.text && <InfoNote>{note.text}</InfoNote>}

              <CandidatesInfoWrapper maxHeight={maxHeight}>
                {orderedCandidates.map((candidate) =>
                  getInfoboxItemJsx(candidate)
                )}
              </CandidatesInfoWrapper>
              {shouldShowExpandButton && <Divider />}
            </Wrapper>
          )
        })
      }
      case 'referendum': {
        const infoboxData = getInfoboxDataOnCertainElectionType(
          electionData,
          level,
          year,
          isStarted,
          isRunning
        )

        if (typeof infoboxData === 'string') {
          return <div>{infoboxData}</div>
        }
        /** @type {InfoboxNote | undefined} */
        const note = infoboxData.note

        // check the type of InfoboxNote for the business logic of the note
        if (note?.text && !note?.displayVotes) {
          return (
            <Wrapper>
              <InfoNote>{note.text}</InfoNote>
            </Wrapper>
          )
        }

        const { profRate, agreeRate, disagreeRate, adptVictor } = infoboxData
        const hasResult = adptVictor === 'Y' || adptVictor === 'N'
        const isPass = hasResult && adptVictor === 'Y'
        const isNoPass = hasResult && adptVictor === 'N'
        return (
          <>
            <ReferendumWrapper>
              <div className="prof-rate">投票率 {profRate}%</div>
              {!!note?.text && <InfoNote>{note.text}</InfoNote>}
              <div className={isPass ? 'result pass-result' : 'result'}>
                <span>同意</span>
                <span className="rate">{agreeRate}%</span>
                <span className="pass-or-no-pass">{isPass ? '通過' : ''}</span>
              </div>
              <div className={isNoPass ? 'result no-pass-result' : 'result'}>
                <span>不同意</span>
                <span className="rate">{disagreeRate}%</span>
                <span className="pass-or-no-pass">
                  {isNoPass ? '不通過' : ''}
                </span>
              </div>
            </ReferendumWrapper>
          </>
        )
      }
      case 'legislator': {
        const infoboxData = getInfoboxDataOnCertainElectionType(
          electionData,
          level,
          year,
          isStarted,
          isRunning,
          currentElectionSubType
        )

        if (typeof infoboxData === 'string') {
          return <div>{infoboxData}</div>
        }
        let districtName = ''
        const currentSubtypeKey = currentElectionSubType.key

        const isIndigenous =
          currentSubtypeKey === 'plainIndigenous' ||
          currentSubtypeKey === 'mountainIndigenous'
        const isParty = currentSubtypeKey === 'party'
        const isAll = currentSubtypeKey === 'all'
        if (isAll) {
          return null
        }
        if (level === 0) {
          // check the type of InfoboxNote for the business logic of the note
          // use one of the note
          /** @type {InfoboxNote | undefined} */
          const note = infoboxData?.note
          if (note?.text && !note?.displayVotes) {
            return (
              <Wrapper>
                <InfoNote>{note.text}</InfoNote>
              </Wrapper>
            )
          }
          const candidates = infoboxData?.candidates
          const orderedCandidates = sortCandidatesByTksRate(candidates)
          const candidatesAmount = orderedCandidates.length
          const shouldShowExpandButton = candidatesAmount > 5
          const maxHeight = calculateMaxHeightOfInfoBox(
            candidatesAmount,
            shouldShowExpandButton,
            shouldInfoBoxExpand
          )
          const expendButtonJsx = getExpendButtonJsx(shouldShowExpandButton)
          districtName = infoboxData?.area_nickname
          return (
            <Wrapper>
              {expendButtonJsx}
              {shouldShowExpandButton && <Divider />}
              <div className="prof-rate prof-rate--text-align-start">
                <div className="range">{districtName}</div>
                <div>投票率 {infoboxData?.profRate}%</div>
              </div>
              {!!note?.text && <InfoNote>{note.text}</InfoNote>}

              <CandidatesInfoWrapper maxHeight={maxHeight}>
                {orderedCandidates.map((candidate) =>
                  getInfoboxItemJsx(candidate)
                )}
              </CandidatesInfoWrapper>
              {shouldShowExpandButton && <Divider />}
            </Wrapper>
          )
        } else if (level === 1) {
          // check the type of InfoboxNote for the business logic of the note
          // use one of the note
          /** @type {InfoboxNote | undefined} */
          const note = infoboxData?.find((data) => !!data.note?.text)?.note

          if (isIndigenous || isParty) {
            const candidates = infoboxData?.[0]?.candidates ?? []
            const orderedCandidates = sortCandidatesByTksRate(candidates)
            const candidatesAmount = orderedCandidates?.length ?? 0
            const shouldShowExpandButton = candidatesAmount > 5
            const expendButtonJsx = getExpendButtonJsx(shouldShowExpandButton)
            const maxHeight = calculateMaxHeightOfInfoBox(
              candidatesAmount,
              shouldShowExpandButton,
              shouldInfoBoxExpand
            )
            return (
              <Wrapper>
                {expendButtonJsx}
                {shouldShowExpandButton && <Divider />}
                <div className="prof-rate">
                  投票率 {infoboxData?.[0]?.profRate}%
                </div>
                {!!note?.text && <InfoNote>{note.text}</InfoNote>}
                <CandidatesInfoWrapper maxHeight={maxHeight}>
                  {orderedCandidates.map((candidate) =>
                    getInfoboxItemJsx(candidate)
                  )}
                </CandidatesInfoWrapper>
                {shouldShowExpandButton && <Divider />}
              </Wrapper>
            )
          }
          const districtsAmount = infoboxData.map((district) => {
            return district?.candidates?.length ?? 0
          })
          const candidatesAmount = districtsAmount.reduce(
            (accumulator, currentValue) => accumulator + currentValue
          )
          const shouldShowExpandButton = candidatesAmount > 5
          const expendButtonJsx = getExpendButtonJsx(shouldShowExpandButton)
          const maxHeight = calculateMaxHeightOfInfoBox(
            candidatesAmount,
            shouldShowExpandButton,
            shouldInfoBoxExpand,
            '272px'
          )

          return (
            <div style={{ borderTop: 'solid 1px #000' }}>
              {expendButtonJsx}
              {shouldShowExpandButton && <Divider />}
              {!!note?.text && (
                <InfoNote className="no-border-margin">{note.text}</InfoNote>
              )}
              <WrapperForCouncilMemberFirstLevel maxHeight={maxHeight}>
                {infoboxData.map((district, index) => {
                  if (
                    !district?.candidates ||
                    !Array.isArray(district.candidates) ||
                    !district.candidates.length
                  ) {
                    return null
                  }
                  districtName = district?.range
                  const orderedCandidates = sortCandidatesByTksRate(
                    district.candidates
                  )
                  return (
                    <Wrapper key={index}>
                      <div className="prof-rate prof-rate--text-align-start">
                        <div className="range">{districtName}</div>
                        <div>投票率: {district?.profRate}%</div>
                      </div>
                      <CandidatesInfoWrapper maxHeight={'100%'}>
                        {orderedCandidates.map((candidate) =>
                          getInfoboxItemJsx(candidate)
                        )}
                      </CandidatesInfoWrapper>
                    </Wrapper>
                  )
                })}
              </WrapperForCouncilMemberFirstLevel>
              {shouldShowExpandButton && <Divider />}
            </div>
          )
        }
        /** @type {InfoboxNote | undefined} */
        const note = infoboxData?.[0]?.note

        // check the type of InfoboxNote for the business logic of the note
        if (note?.text && !note?.displayVotes) {
          return (
            <Wrapper>
              <InfoNote>{note.text}</InfoNote>
            </Wrapper>
          )
        }

        const candidates = infoboxData?.[0]?.candidates
        const orderedCandidates = sortCandidatesByTksRate(candidates)
        const candidatesAmount = orderedCandidates.length
        const shouldShowExpandButton = candidatesAmount > 5
        const maxHeight = calculateMaxHeightOfInfoBox(
          candidatesAmount,
          shouldShowExpandButton,
          shouldInfoBoxExpand
        )
        const expendButtonJsx = getExpendButtonJsx(shouldShowExpandButton)

        districtName = infoboxData?.[0]?.area_nickname

        const districtNote =
          level === 2 && districtName && districtName?.includes('*')
            ? '* 表示該行政區僅有部分村里在此選區'
            : null
        return (
          <Wrapper>
            {expendButtonJsx}
            {shouldShowExpandButton && <Divider />}
            {!!note?.text && <InfoNote>{note.text}</InfoNote>}
            <div className="prof-rate prof-rate--text-align-start">
              {level === 2 && <div className="range">{districtName}</div>}
              {districtNote && <div className="range-note">{districtNote}</div>}
              <div>投票率 {infoboxData?.[0]?.profRate}%</div>
            </div>
            <CandidatesInfoWrapper maxHeight={maxHeight}>
              {orderedCandidates.map((candidate) =>
                getInfoboxItemJsx(candidate)
              )}
            </CandidatesInfoWrapper>
            {shouldShowExpandButton && <Divider />}
          </Wrapper>
        )
      }
      case 'president': {
        const infoboxData = getInfoboxDataOnCertainElectionType(
          electionData,
          level,
          year,
          isStarted,
          isRunning
        )

        if (typeof infoboxData === 'string') {
          return <div>{infoboxData}</div>
        }
        /** @type {InfoboxNote | undefined} */
        const note = infoboxData?.note
        if (note?.text && !note?.displayVotes) {
          return (
            <Wrapper>
              <InfoNote>{note?.text}</InfoNote>
            </Wrapper>
          )
        }
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
            {!!note?.text && <InfoNote>{note?.text}</InfoNote>}
            <CandidatesInfoWrapper maxHeight={maxHeight}>
              {orderedCandidates.map((candidate) =>
                getInfoboxItemJsx(candidate)
              )}
            </CandidatesInfoWrapper>
            {shouldShowExpandButton && <Divider />}
          </Wrapper>
        )
      }

      default:
        return null
    }
  }
  const infoboxJsx = getInfoboxJsx()

  return <InfoboxWrapper>{infoboxJsx}</InfoboxWrapper>
}
