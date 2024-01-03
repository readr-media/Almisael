import styled from 'styled-components'
import { getInfoBoxData } from '../../utils/infoboxData'

/**
 *  Inside infobox data, a summary object or district object may have a note object
 *  which is special description to the current infobox data.
 *  The note object only exists when needed and the text must exist to describe the situation.
 *  The note.displayVotes flag is used for infobox component to decide if the infobox data should still be displayed.
 * @typedef {Object} InfoboxNote
 * @property {string} text - note content to add additional description to the current infobox data
 * @property {boolean} displayVotes - a flag to indicate whether the following infobox data should display or not
 */

const InfoboxWrapper = styled.div`
  font-family: 'Noto Sans TC', sans-serif;
  padding: 16px 22px;
  height: 130px;
  overflow: auto;

  @media (max-width: 1024px) {
    padding: 0;
  }
`

const InfoboxScrollWrapper = styled.div``

const PresidentTitle = styled.p`
  margin: 0 0 20px;
  font-weight: 700;
`

const PresidentCandidate = styled.p`
  position: relative;
  display: flex;
  flex-direction: column;
  width: fit-content;
  align-items: start;
  margin-top: 20px;
  font-weight: 700;
  line-height: 26px;
  ${({ elected }) => elected && 'color: #DB4C65;'}
`

const PresidentCandidateName = styled.div`
  max-width: 160px;
  font-weight: 700;
`

const PresidentCandidateParty = styled.div`
  font-weight: 350;
`

const InfoboxText = styled.p`
  margin: 0;
`

const InfoboxNote = styled.p`
  margin-bottom: 28px;
`

const ElectedIcon = styled.div`
  position: absolute;
  top: 0;
  right: -32px;
  display: flex;
  justify-contnet: center;
  align-items: center;
`

const RunningHint = styled.span`
  color: #939393;
  font-weight: 700;
  &:before {
    content: '';
    display: inline-block;
    margin: 0 8px;
    width: 12px;
    height: 12px;
    background: #da6262;
    border-radius: 50%;
  }
  @media (max-width: 768px) {
    display: block;
    &:before {
      margin-left: 0;
    }
  }
`

const FinalHint = styled.span`
  color: #939393;
  font-weight: 700;
  &:before {
    content: '';
    display: inline-block;
    margin: 0 8px;
    width: 12px;
    height: 12px;
    background: #939393;
  }
  @media (max-width: 768px) {
    display: block;
    &:before {
      margin-left: 0;
    }
  }
`

const HintWrapper = styled.p`
  margin: 0 0 20px 0;
  > span:before {
    margin-left: 1px;
  }
`

const electedSvg = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.364 3.63604L17.0711 2.92893L16.364 3.63604C17.1997 4.47177 17.8626 5.46392 18.3149 6.55585C18.7672 7.64778 19 8.8181 19 10C19 11.1819 18.7672 12.3522 18.3149 13.4441C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C8.8181 19 7.64778 18.7672 6.55585 18.3149C5.46392 17.8626 4.47177 17.1997 3.63604 16.364L2.92893 17.0711L3.63604 16.364C2.80031 15.5282 2.13738 14.5361 1.68509 13.4441C1.23279 12.3522 1 11.1819 1 10C1 8.8181 1.23279 7.64778 1.68509 6.55585C2.13738 5.46392 2.80031 4.47177 3.63604 3.63604C4.47177 2.80031 5.46392 2.13738 6.55585 1.68508C7.64778 1.23279 8.8181 1 10 1C11.1819 1 12.3522 1.23279 13.4442 1.68508C14.5361 2.13738 15.5282 2.80031 16.364 3.63604Z"
      stroke="#DB4C65"
      strokeWidth="2"
    />
    <line x1="10" y1="1" x2="10" y2="19" stroke="#DB4C65" strokeWidth="2" />
    <line
      x1="10.3638"
      y1="9.83658"
      x2="3.04776"
      y2="14.6275"
      stroke="#DB4C65"
      strokeWidth="2"
    />
  </svg>
)

const PresidentInfobox = ({ level, data, isRunning, isCurrentYear }) => {
  if (typeof data === 'string') {
    return (
      <InfoboxScrollWrapper>
        <InfoboxText>{data}</InfoboxText>
      </InfoboxScrollWrapper>
    )
  }

  /** @type {InfoboxNote | undefined} */
  const note = data.note

  // check the type of InfoboxNote for the business logic of the note
  if (note?.text && !note?.displayVotes) {
    return (
      <InfoboxScrollWrapper>
        <InfoboxNote>{note.text}</InfoboxNote>
      </InfoboxScrollWrapper>
    )
  }

  const isCurrentYearRunningJsx = isCurrentYear ? (
    isRunning ? (
      <RunningHint>開票中</RunningHint>
    ) : (
      <FinalHint>開票結束</FinalHint>
    )
  ) : (
    <></>
  )

  const { profRate, candidates } = data
  return (
    <InfoboxScrollWrapper>
      {note?.text && <InfoboxNote>{note.text}</InfoboxNote>}
      <PresidentTitle>
        {level === 0 && '總'}投票率 {profRate}% {isCurrentYearRunningJsx}
      </PresidentTitle>
      {[...candidates]
        .sort((cand1, cand2) => {
          if (cand1.tksRate === cand2.tksRate) {
            return 0
          }
          return cand1.tksRate < cand2.tksRate ? 1 : -1
        })
        .map((candidate) => {
          const elected = candidate.candVictor === '*'
          const candNames = candidate.name.split(' ')
          return (
            <PresidentCandidate elected={elected} key={candidate.candNo}>
              {candNames.map((candName) => (
                <PresidentCandidateName key={candName}>
                  {candName}
                </PresidentCandidateName>
              ))}
              <PresidentCandidateParty>
                {candidate.party} {candidate.tksRate}%
              </PresidentCandidateParty>
              {elected && <ElectedIcon>{electedSvg} </ElectedIcon>}
            </PresidentCandidate>
          )
        })}
    </InfoboxScrollWrapper>
  )
}

const MayorTitle = styled.div`
  font-weight: 700;
`

const MayorCandidate = styled.div`
  position: relative;
  display: table;
  margin-top: 20px;
  align-items: center;
  line-height: 23px;
  ${({ elected }) => elected && 'color: #DB4C65;'}
`

const MayorCandidateName = styled.div`
  max-width: 160px;
  font-weight: 700;
`
const MayorCandidateParty = styled.div`
  font-weight: 350;
`

const MayorInfobox = ({ level, data, isRunning, isCurrentYear }) => {
  if (typeof data === 'string') {
    return (
      <InfoboxScrollWrapper>
        <InfoboxText>{data}</InfoboxText>
      </InfoboxScrollWrapper>
    )
  }

  /** @type {InfoboxNote | undefined} */
  const note = data.note

  // check the type of InfoboxNote for the business logic of the note
  if (note?.text && !note?.displayVotes) {
    return (
      <InfoboxScrollWrapper>
        <InfoboxNote>{note.text}</InfoboxNote>
      </InfoboxScrollWrapper>
    )
  }

  const { profRate, candidates } = data
  return (
    <InfoboxScrollWrapper>
      {note?.text && <InfoboxNote>{note.text}</InfoboxNote>}
      <MayorTitle>
        {level === 1 && '總'}投票率 {profRate}%
        {isCurrentYear ? (
          isRunning ? (
            <RunningHint>開票中</RunningHint>
          ) : (
            <FinalHint>開票結束</FinalHint>
          )
        ) : (
          <></>
        )}
      </MayorTitle>
      {[...candidates]
        .sort((cand1, cand2) => {
          if (cand1.tksRate === cand2.tksRate) {
            return 0
          }
          return cand1.tksRate < cand2.tksRate ? 1 : -1
        })
        .map((candidate) => {
          const elected = candidate.candVictor === '*'
          return (
            <MayorCandidate elected={elected} key={candidate.candNo}>
              <MayorCandidateName>{candidate.name}</MayorCandidateName>
              <MayorCandidateParty>
                {candidate.party} {candidate.tksRate}%
              </MayorCandidateParty>
              {elected && <ElectedIcon>{electedSvg} </ElectedIcon>}
            </MayorCandidate>
          )
        })}
    </InfoboxScrollWrapper>
  )
}

const LegislatorTypeWrapper = styled.div`
  &:nth-of-type(2) {
    margin-top: 20px;
  }
`

const NormalLegislatorCandidate = styled.div`
  position: relative;
  display: table;
  margin-top: 20px;
  align-items: center;
  line-height: 23px;
  ${
    /**
     * @param {Object} props
     * @param {boolean} [props.elected]
     */
    ({ elected }) => elected && 'color: #DB4C65;'
  }
`

const NormalLegislatorCandidateName = styled.div`
  max-width: 160px;
  font-weight: 700;
`

const NormalLegislatorCandidateParty = styled.div`
  font-weight: 350;
`

const NormalLegislatorDistrict = styled.div`
  padding: 20px 0;
  border-top: 1px solid #000;
  &:first-of-type {
    border-top: unset;
    padding-top: unset;
  }
  &:last-of-type {
    padding-bottom: unset;
  }
`

const NormalLegislatorArea = styled.div`
  font-weight: 700;
  line-height: 23px;
  color: gray;
`

const NormalLegislatorTitle = styled.div`
  font-weight: 700;
`

/**
 *
 * @param {Object} props
 * @param {number} props.level
 * @param {Object} props.data
 * @param {boolean} props.isRunning
 * @param {boolean} props.isCurrentYear
 * @returns {JSX.Element}
 */
const NormalLegislatorInfobox = ({ level, data, isRunning, isCurrentYear }) => {
  const isCurrentYearRunningJsx = isCurrentYear ? (
    isRunning ? (
      <HintWrapper>
        <RunningHint>開票中</RunningHint>
      </HintWrapper>
    ) : (
      <HintWrapper>
        <FinalHint>開票結束</FinalHint>
      </HintWrapper>
    )
  ) : (
    <></>
  )

  // check the type of InfoboxNote for the business logic of the note
  // use one of the note
  /** @type {InfoboxNote | undefined} */
  const note = data.find((data) => !!data.note?.text)?.note

  if (note?.text && !note?.displayVotes) {
    return (
      <InfoboxScrollWrapper>
        <InfoboxNote>{note.text}</InfoboxNote>
      </InfoboxScrollWrapper>
    )
  }

  if (level === 1) {
    const districts = data
    return (
      <InfoboxScrollWrapper>
        {note?.text && <InfoboxNote>{note.text}</InfoboxNote>}
        {isCurrentYearRunningJsx}
        {districts.map(({ county, area, range, candidates, profRate }) => {
          const legislatorPrefix = county + area
          const areaName = range.split(' ')[1]
          const candidateComps = [...candidates]
            .sort((cand1, cand2) => {
              if (cand1.tksRate === cand2.tksRate) {
                return 0
              }
              return cand1.tksRate < cand2.tksRate ? 1 : -1
            })
            .map((candidate) => {
              const elected = candidate.candVictor === '*'
              return (
                <NormalLegislatorCandidate
                  elected={elected}
                  key={legislatorPrefix + candidate.candNo}
                >
                  <NormalLegislatorCandidateName>
                    {candidate.name}
                  </NormalLegislatorCandidateName>
                  <NormalLegislatorCandidateParty>
                    {candidate.party} {candidate.tksRate}%
                  </NormalLegislatorCandidateParty>
                  {elected && <ElectedIcon>{electedSvg} </ElectedIcon>}
                </NormalLegislatorCandidate>
              )
            })
          return (
            <NormalLegislatorDistrict key={legislatorPrefix}>
              <NormalLegislatorArea>{areaName}</NormalLegislatorArea>
              <NormalLegislatorTitle>投票率 {profRate}%</NormalLegislatorTitle>
              {candidateComps}
            </NormalLegislatorDistrict>
          )
        })}
      </InfoboxScrollWrapper>
    )
  }

  return (
    <InfoboxScrollWrapper>
      {note?.text && <InfoboxNote>{note.text}</InfoboxNote>}
      {data.map((district) => {
        const { candidates, profRate, type, county, town, area } = district
        const legislatorPrefix = county + town + area + type

        return (
          <LegislatorTypeWrapper key={legislatorPrefix}>
            <NormalLegislatorTitle>
              投票率 {profRate}% {isCurrentYearRunningJsx}
            </NormalLegislatorTitle>
            {[...candidates]
              .sort((cand1, cand2) => {
                if (cand1.tksRate === cand2.tksRate) {
                  return 0
                }
                return cand1.tksRate < cand2.tksRate ? 1 : -1
              })
              .map((candidate) => {
                const elected = candidate.candVictor === '*'
                return (
                  <NormalLegislatorCandidate
                    elected={elected}
                    id={legislatorPrefix + candidate.candNo}
                    key={legislatorPrefix + candidate.candNo}
                  >
                    <NormalLegislatorCandidateName>
                      {candidate.name}
                    </NormalLegislatorCandidateName>
                    <NormalLegislatorCandidateParty>
                      {candidate.party} {candidate.tksRate}%
                    </NormalLegislatorCandidateParty>
                    {elected && <ElectedIcon>{electedSvg} </ElectedIcon>}
                  </NormalLegislatorCandidate>
                )
              })}
          </LegislatorTypeWrapper>
        )
      })}
    </InfoboxScrollWrapper>
  )
}

const IndigenousLegislatorTitle = styled.div`
  font-weight: 700;
`

const IndigenousLegislatorCandidate = styled.div`
  position: relative;
  display: table;
  margin-top: 20px;
  align-items: center;
  line-height: 23px;
  ${
    /**
     * @param {Object} props
     * @param {boolean} [props.elected]
     */
    ({ elected }) => elected && 'color: #DB4C65;'
  }
`

const IndigenousLegislatorCandidateName = styled.div`
  max-width: 160px;
  font-weight: 700;
`

const IndigenousLegislatorCandidateParty = styled.div`
  font-weight: 350;
`

/**
 * @param {Object} props
 * @param {Object} props.data
 * @param {boolean} props.isRunning
 * @param {boolean} props.isCurrentYear
 * @returns {JSX.Element}
 */
const IndigenousLegislatorInfobox = ({ data, isRunning, isCurrentYear }) => {
  const isCurrentYearRunningJsx = isCurrentYear ? (
    isRunning ? (
      <RunningHint>開票中</RunningHint>
    ) : (
      <FinalHint>開票結束</FinalHint>
    )
  ) : (
    <></>
  )

  let infoboxData = Array.isArray(data) ? data : [data]

  // check the type of InfoboxNote for the business logic of the note
  // use one of the note
  /** @type {InfoboxNote | undefined} */
  const note = infoboxData.find((data) => !!data.note?.text)?.note

  if (note?.text && !note?.displayVotes) {
    return (
      <InfoboxScrollWrapper>
        <InfoboxNote>{note.text}</InfoboxNote>
      </InfoboxScrollWrapper>
    )
  }

  return (
    <InfoboxScrollWrapper>
      {note?.text && <InfoboxNote>{note.text}</InfoboxNote>}
      {infoboxData.map((district) => {
        const { candidates, profRate, type, county, town, area } = district
        const legislatorPrefix = county + town + area + type

        return (
          <LegislatorTypeWrapper key={legislatorPrefix}>
            <IndigenousLegislatorTitle>
              投票率 {profRate}% {isCurrentYearRunningJsx}
            </IndigenousLegislatorTitle>
            {[...candidates]
              .sort((cand1, cand2) => {
                if (cand1.tksRate === cand2.tksRate) {
                  return 0
                }
                return cand1.tksRate < cand2.tksRate ? 1 : -1
              })
              .map((candidate) => {
                const elected = candidate.candVictor === '*'
                return (
                  <IndigenousLegislatorCandidate
                    elected={elected}
                    id={legislatorPrefix + candidate.candNo}
                    key={legislatorPrefix + candidate.candNo}
                  >
                    <IndigenousLegislatorCandidateName>
                      {candidate.name}
                    </IndigenousLegislatorCandidateName>
                    <IndigenousLegislatorCandidateParty>
                      {candidate.party} {candidate.tksRate}%
                    </IndigenousLegislatorCandidateParty>
                    {elected && <ElectedIcon>{electedSvg} </ElectedIcon>}
                  </IndigenousLegislatorCandidate>
                )
              })}
          </LegislatorTypeWrapper>
        )
      })}
    </InfoboxScrollWrapper>
  )
}

const PartyLegislatorTitle = styled.div`
  font-weight: 700;
  margin-bottom: 16px;
`

const PartyLegislatorCandidate = styled.div`
  position: relative;
  display: table;
  align-items: center;
  line-height: 23px;
`

const PartyLegislatorCandidateParty = styled.div`
  font-weight: 700;
`

const PartyLegislatorCandidateSeats = styled.span`
  font-weight: 400;
  margin-left: 11px;
`
const PartyLegislatorTitleHint = styled.div`
  font-size: 13px;
  font-weight: 400;
  margin-top: 5px;
`

/**
 * @param {Object} props
 * @param {Object} props.data
 * @param {boolean} props.isRunning
 * @param {boolean} props.isCurrentYear
 * @returns {JSX.Element}
 */
const PartyLegislatorInfobox = ({ data, isRunning, isCurrentYear }) => {
  const isCurrentYearRunningJsx = isCurrentYear ? (
    isRunning ? (
      <RunningHint>開票中</RunningHint>
    ) : (
      <FinalHint>開票結束</FinalHint>
    )
  ) : (
    <></>
  )
  let infoboxData = Array.isArray(data) ? data : [data]

  // check the type of InfoboxNote for the business logic of the note
  // use one of the note
  /** @type {InfoboxNote | undefined} */
  const note = infoboxData.find((data) => !!data.note?.text)?.note

  if (note?.text && !note?.displayVotes) {
    return (
      <InfoboxScrollWrapper>
        <InfoboxNote>{note.text}</InfoboxNote>
      </InfoboxScrollWrapper>
    )
  }

  return (
    <InfoboxScrollWrapper>
      {note?.text && <InfoboxNote>{note.text}</InfoboxNote>}
      {/* 
          Although all party legislator data should only contain one district to render,
          use map function to handle cause all legislator infobox data is filled in array.
       */}
      {infoboxData.map((district) => {
        const { candidates, profRate, type, county, town, area } = district
        const legislatorPrefix = county + town + area + type

        return (
          <LegislatorTypeWrapper key={legislatorPrefix}>
            <PartyLegislatorTitle>
              投票率 {profRate}% {isCurrentYearRunningJsx}
              <PartyLegislatorTitleHint>
                ＊此為第一階段投票率
              </PartyLegislatorTitleHint>
            </PartyLegislatorTitle>
            {[...candidates]
              .sort((cand1, cand2) => {
                if (cand1.tksRate === cand2.tksRate) {
                  return 0
                }
                return cand1.tksRate < cand2.tksRate ? 1 : -1
              })
              .map((candidate) => {
                return (
                  <PartyLegislatorCandidate
                    id={legislatorPrefix + candidate.candNo}
                    key={legislatorPrefix + candidate.candNo}
                  >
                    <PartyLegislatorCandidateParty>
                      {candidate.party} {candidate.tksRate}%
                      {candidate.seats !== 0 ? (
                        <PartyLegislatorCandidateSeats>
                          {`最終獲${candidate.seats}席`}
                        </PartyLegislatorCandidateSeats>
                      ) : (
                        <></>
                      )}
                    </PartyLegislatorCandidateParty>
                  </PartyLegislatorCandidate>
                )
              })}
          </LegislatorTypeWrapper>
        )
      })}
    </InfoboxScrollWrapper>
  )
}

/**
 *
 * @param {Object} props
 * @param {number} props.level
 * @param {Object} props.data
 * @param {boolean} props.isRunning
 * @param {boolean} props.isCurrentYear
 * @param {import('../../consts/electionsConfig').ElectionSubtype} props.subtype
 * @returns {JSX.Element}
 */
const LegislatorInfobox = ({
  level,
  data,
  isRunning,
  isCurrentYear,
  subtype,
}) => {
  if (typeof data === 'string') {
    return (
      <InfoboxScrollWrapper>
        <InfoboxText>{data}</InfoboxText>
      </InfoboxScrollWrapper>
    )
  }

  // separate all types for individual component to support extreme custom UI for each type
  switch (subtype.key) {
    case 'normal':
      return (
        <NormalLegislatorInfobox
          level={level}
          data={data}
          isRunning={isRunning}
          isCurrentYear={isCurrentYear}
        />
      )
    case 'mountainIndigenous':
    case 'plainIndigenous':
      return (
        <IndigenousLegislatorInfobox
          data={data}
          isRunning={isRunning}
          isCurrentYear={isCurrentYear}
        />
      )
    case 'party':
      return (
        <PartyLegislatorInfobox
          data={data}
          isRunning={isRunning}
          isCurrentYear={isCurrentYear}
        />
      )
    default:
      console.error(
        'legislator infobox render with unexpected type',
        subtype.key
      )
      break
  }
}

const CouncilMemberDistrict = styled.div`
  padding: 20px 0;
  border-top: 1px solid #000;
  &:first-of-type {
    border-top: unset;
    padding-top: unset;
  }
  &:last-of-type {
    padding-bottom: unset;
  }
`

const CouncilMemberTypeWrapper = styled.div`
  &:nth-of-type(2) {
    margin-top: 20px;
  }
`

const CouncilMemberArea = styled.div`
  font-weight: 700;
  line-height: 23px;
  color: gray;
`

const CouncilMemberTitle = styled.div`
  font-weight: 700;
`

const CouncilMemberCandidate = styled.div`
  position: relative;
  display: table;
  margin-top: 20px;
  align-items: center;
  line-height: 23px;
  ${({ elected }) => elected && 'color: #DB4C65;'}
`

const CouncilMemberCandidateName = styled.div`
  max-width: 160px;
  font-weight: 700;
`
const CouncilMemberCandidateParty = styled.div`
  font-weight: 350;
`

const CouncilMemberInfobox = ({ level, data, isRunning, isCurrentYear }) => {
  if (typeof data === 'string') {
    return (
      <InfoboxScrollWrapper>
        <InfoboxText>{data}</InfoboxText>
      </InfoboxScrollWrapper>
    )
  }

  if (level === 1) {
    /** @type {InfoboxNote | undefined} */
    const note = data.note

    // check the type of InfoboxNote for the business logic of the note
    if (note?.text && !note?.displayVotes) {
      return (
        <InfoboxScrollWrapper>
          <InfoboxNote>{note.text}</InfoboxNote>
        </InfoboxScrollWrapper>
      )
    }

    const { districts } = data
    return (
      <InfoboxScrollWrapper>
        {note?.text && <InfoboxNote>{note.text}</InfoboxNote>}
        {isCurrentYear ? (
          isRunning ? (
            <HintWrapper>
              <RunningHint>開票中</RunningHint>
            </HintWrapper>
          ) : (
            <HintWrapper>
              <FinalHint>開票結束</FinalHint>
            </HintWrapper>
          )
        ) : (
          <></>
        )}
        {districts.map(({ county, area, range, candidates, profRate }) => {
          const councilMemberdPrefix = county + area
          const areaName = range.split(' ')[1]
          const candidateComps = [...candidates]
            .sort((cand1, cand2) => {
              if (cand1.tksRate === cand2.tksRate) {
                return 0
              }
              return cand1.tksRate < cand2.tksRate ? 1 : -1
            })
            .map((candidate) => {
              const elected = candidate.candVictor === '*'
              return (
                <CouncilMemberCandidate
                  elected={elected}
                  key={councilMemberdPrefix + candidate.candNo}
                >
                  <CouncilMemberCandidateName>
                    {candidate.name}
                  </CouncilMemberCandidateName>
                  <CouncilMemberCandidateParty>
                    {candidate.party} {candidate.tksRate}%
                  </CouncilMemberCandidateParty>
                  {elected && <ElectedIcon>{electedSvg} </ElectedIcon>}
                </CouncilMemberCandidate>
              )
            })
          return (
            <CouncilMemberDistrict key={councilMemberdPrefix}>
              <CouncilMemberArea>{areaName}</CouncilMemberArea>
              <CouncilMemberTitle>投票率 {profRate}%</CouncilMemberTitle>
              {candidateComps}
            </CouncilMemberDistrict>
          )
        })}
      </InfoboxScrollWrapper>
    )
  }

  // check the type of InfoboxNote for the business logic of the note
  // use one of the note
  /** @type {InfoboxNote | undefined} */
  const note = data.find((data) => !!data.note?.text)?.note

  if (note?.text && !note?.displayVotes) {
    return (
      <InfoboxScrollWrapper>
        <InfoboxNote>{note.text}</InfoboxNote>
      </InfoboxScrollWrapper>
    )
  }

  const councilMembers = data.map((district) => {
    const { candidates, profRate, type, county, town, area } = district
    const councilMemberdPrefix = county + town + area + type

    if (type === 'normal') {
      return (
        <CouncilMemberTypeWrapper key={councilMemberdPrefix}>
          <CouncilMemberTitle>
            投票率 {profRate}%
            {isCurrentYear ? (
              isRunning ? (
                <RunningHint>開票中</RunningHint>
              ) : (
                <FinalHint>開票結束</FinalHint>
              )
            ) : (
              <></>
            )}
          </CouncilMemberTitle>
          {[...candidates]
            .sort((cand1, cand2) => {
              if (cand1.tksRate === cand2.tksRate) {
                return 0
              }
              return cand1.tksRate < cand2.tksRate ? 1 : -1
            })
            .map((candidate) => {
              const elected = candidate.candVictor === '*'
              return (
                <CouncilMemberCandidate
                  elected={elected}
                  id={councilMemberdPrefix + candidate.candNo}
                  key={councilMemberdPrefix + candidate.candNo}
                >
                  <CouncilMemberCandidateName>
                    {candidate.name}
                  </CouncilMemberCandidateName>
                  <CouncilMemberCandidateParty>
                    {candidate.party} {candidate.tksRate}%
                  </CouncilMemberCandidateParty>
                  {elected && <ElectedIcon>{electedSvg} </ElectedIcon>}
                </CouncilMemberCandidate>
              )
            })}
        </CouncilMemberTypeWrapper>
      )
    } else {
      return (
        <CouncilMemberTypeWrapper key={councilMemberdPrefix}>
          <CouncilMemberArea>
            {type === 'plainIndigenous' ? '平地原住民' : '山地原住民'}
          </CouncilMemberArea>
          <CouncilMemberTitle>
            投票率 {profRate}%
            {isCurrentYear ? (
              isRunning ? (
                <RunningHint>開票中</RunningHint>
              ) : (
                <FinalHint>開票結束</FinalHint>
              )
            ) : (
              <></>
            )}
          </CouncilMemberTitle>
          {[...candidates]
            .sort((cand1, cand2) => {
              if (cand1.tksRate === cand2.tksRate) {
                return 0
              }
              return cand1.tksRate < cand2.tksRate ? 1 : -1
            })
            .map((candidate) => {
              const elected = candidate.candVictor === '*'
              return (
                <CouncilMemberCandidate
                  elected={elected}
                  key={councilMemberdPrefix + candidate.candNo}
                >
                  <CouncilMemberCandidateName>
                    {candidate.name}
                  </CouncilMemberCandidateName>
                  <CouncilMemberCandidateParty>
                    {candidate.party} {candidate.tksRate}%
                  </CouncilMemberCandidateParty>
                  {elected && <ElectedIcon>{electedSvg} </ElectedIcon>}
                </CouncilMemberCandidate>
              )
            })}
        </CouncilMemberTypeWrapper>
      )
    }
  })

  return (
    <InfoboxScrollWrapper>
      {note?.text && <InfoboxNote>{note.text}</InfoboxNote>}
      {councilMembers}
    </InfoboxScrollWrapper>
  )
}

const ReferendumPassWrapper = styled.span`
  color: #5673da;
`

const ReferendumFailWrapper = styled.span`
  color: #ff8585;
`

const ReferendumTitle = styled.div`
  font-weight: 700;
  ${ReferendumPassWrapper}, ${ReferendumFailWrapper} {
    margin-left: 18px;
  }
  line-height: 23px;
  &:nth-of-type(2) {
    margin-bottom: 12px;
  }
`

const NoResult = styled.span`
  margin-left: 16px;
  font-weight: 700;
  color: #da6262;
`

const ReferendumCandidate = styled.div`
  line-height: 23px;
`

const ReferendumInfobox = ({ data, isRunning, isCurrentYear }) => {
  if (typeof data === 'string') {
    return (
      <InfoboxScrollWrapper>
        <InfoboxText>{data}</InfoboxText>
      </InfoboxScrollWrapper>
    )
  }

  const { profRate, adptVictor, agreeRate, disagreeRate } = data
  const noResult = adptVictor !== 'Y' && adptVictor !== 'N'
  const pass = adptVictor === 'Y'

  /** @type {InfoboxNote | undefined} */
  const note = data.note

  // check the type of InfoboxNote for the business logic of the note
  if (note?.text && !note?.displayVotes) {
    return (
      <InfoboxScrollWrapper>
        <InfoboxNote>{note.text}</InfoboxNote>
      </InfoboxScrollWrapper>
    )
  }

  return (
    <InfoboxScrollWrapper>
      {note?.text && <InfoboxNote>{note.text}</InfoboxNote>}
      {isCurrentYear ? (
        isRunning ? (
          <HintWrapper>
            <RunningHint>開票中</RunningHint>
          </HintWrapper>
        ) : (
          <HintWrapper>
            <FinalHint>開票結束</FinalHint>
          </HintWrapper>
        )
      ) : (
        <></>
      )}
      <ReferendumTitle>
        此案是否通過
        {noResult ? (
          <NoResult>結果尚未公布</NoResult>
        ) : pass ? (
          <ReferendumPassWrapper>是</ReferendumPassWrapper>
        ) : (
          <ReferendumFailWrapper>否</ReferendumFailWrapper>
        )}
      </ReferendumTitle>
      <ReferendumTitle>
        投票率 {profRate}%{isRunning && <RunningHint>開票中</RunningHint>}
      </ReferendumTitle>
      {noResult ? (
        <>
          <ReferendumCandidate>同意 {agreeRate}%</ReferendumCandidate>
          <ReferendumCandidate>不同意 {disagreeRate}%</ReferendumCandidate>
        </>
      ) : pass ? (
        <>
          <ReferendumCandidate>
            <ReferendumPassWrapper>同意 {agreeRate}%</ReferendumPassWrapper>
          </ReferendumCandidate>
          <ReferendumCandidate>不同意 {disagreeRate}%</ReferendumCandidate>
        </>
      ) : (
        <>
          <ReferendumCandidate>同意 {agreeRate}%</ReferendumCandidate>
          <ReferendumCandidate>
            <ReferendumFailWrapper>
              不同意 {disagreeRate}%
            </ReferendumFailWrapper>
          </ReferendumCandidate>
        </>
      )}
    </InfoboxScrollWrapper>
  )
}

/**
 *
 * @param {Object} props
 * @param {import('../../utils/electionsData').InfoboxData} props.data
 * @param {boolean} props.isCurrentYear
 * @param {number} props.year
 * @param {import('../../consts/electionsConfig').ElectionSubtype} props.subtype
 * @returns {JSX.Element}
 */
export const Infobox = ({ data, isCurrentYear, year, subtype }) => {
  const { electionType, level, electionData, isRunning, isStarted } = data
  let infobox

  const getInfoboxDataOnCertainElectionType = getInfoBoxData(
    electionType,
    'desktop'
  )

  switch (electionType) {
    case 'president': {
      const data = getInfoboxDataOnCertainElectionType(
        electionData,
        level,
        year,
        isStarted,
        isRunning
      )
      infobox = (
        <PresidentInfobox
          level={level}
          data={data}
          isRunning={isRunning}
          isCurrentYear={isCurrentYear}
        />
      )
      break
    }
    case 'mayor': {
      const data = getInfoboxDataOnCertainElectionType(
        electionData,
        level,
        year,
        isStarted,
        isRunning
      )
      infobox = (
        <MayorInfobox
          level={level}
          data={data}
          isRunning={isRunning}
          isCurrentYear={isCurrentYear}
        />
      )
      break
    }
    case 'legislator': {
      const data = getInfoboxDataOnCertainElectionType(
        electionData,
        level,
        year,
        isStarted,
        isRunning,
        subtype
      )
      infobox = (
        <LegislatorInfobox
          level={level}
          data={data}
          isRunning={isRunning}
          isCurrentYear={isCurrentYear}
          subtype={subtype}
        />
      )
      break
    }
    case 'councilMember': {
      const data = getInfoboxDataOnCertainElectionType(
        electionData,
        level,
        year,
        isStarted,
        isRunning
      )
      infobox = (
        <CouncilMemberInfobox
          level={level}
          data={data}
          isRunning={isRunning}
          isCurrentYear={isCurrentYear}
        />
      )
      break
    }
    case 'referendum':
      const data = getInfoboxDataOnCertainElectionType(
        electionData,
        level,
        year,
        isStarted,
        isRunning
      )
      infobox = (
        <ReferendumInfobox
          data={data}
          isRunning={isRunning}
          isCurrentYear={isCurrentYear}
        />
      )
      break
    default:
      break
  }

  return <InfoboxWrapper>{infobox}</InfoboxWrapper>
}
