import styled from 'styled-components'

const InfoboxWrapper = styled.div`
  font-family: 'Noto Sans TC', sans-serif;
  padding: 16px 22px;
  font-size: 18px;
  height: 130px;
  overflow: auto;
`

const InfoboxScrollWrapper = styled.div``

const PresidentTitle = styled.p`
  margin: 0 0 20px;
  font-weight: 700;
`

const PresidentCandidate = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
  font-weight: 700;
  line-height: 26px;
  ${({ elected }) => elected && 'color: green;'}
`

const InfoboxText = styled.p`
  margin: 0;
`

const ElectedIcon = styled.img`
  margin-left: 14px;
`

const PresidentInfobox = ({ level, data }) => {
  const { profRate, candidates } = data
  return (
    <InfoboxScrollWrapper>
      <PresidentTitle>
        {level === 0 && '總'}投票率 {profRate}%
      </PresidentTitle>
      {candidates.map((candidate) => {
        const elected = candidate.candVictor === '*'
        return (
          <PresidentCandidate elected={elected} key={candidate.canNo}>
            {candidate.name} {candidate.party} {candidate.tksRate}%
            {elected && (
              <ElectedIcon src={'/images/elected.svg'} alt="elected" />
            )}
          </PresidentCandidate>
        )
      })}
    </InfoboxScrollWrapper>
  )
}

const MayorTitle = styled.p`
  margin: 0 0 20px;
  font-weight: 700;
`

const MayorCandidate = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
  font-weight: 700;
  line-height: 26px;
  ${({ elected }) => elected && 'color: green;'}
`

const MayorInfobox = ({ level, data }) => {
  if (level === 0) {
    return (
      <InfoboxScrollWrapper>
        <InfoboxText>點擊地圖看更多資料</InfoboxText>
      </InfoboxScrollWrapper>
    )
  }
  const { profRate, candidates } = data
  return (
    <InfoboxScrollWrapper>
      <MayorTitle>
        {level === 1 && '總'}投票率 {profRate}%
      </MayorTitle>
      {candidates.map((candidate) => {
        const elected = candidate.candVictor === '*'
        return (
          <MayorCandidate elected={elected} key={candidate.canNo}>
            {candidate.name} {candidate.party} {candidate.tksRate}%
            {elected && (
              <ElectedIcon src={'/images/elected.svg'} alt="elected" />
            )}
          </MayorCandidate>
        )
      })}
    </InfoboxScrollWrapper>
  )
}

const LegislatorDistrict = styled.div`
  padding: 20px 0;
  border-top: 1px solid #000;
  &:nth-of-type(2) {
    border-top: unset;
    padding-top: unset;
  }
  &:last-of-type {
    padding-bottom: unset;
  }
`
const LegislatorConstituency = styled.div`
  font-size: 17px;
  color: gray;
`

const LegislatorTitle = styled.div`
  margin-bottom: 20px;
  font-weight: 700;
`

const LegislatorCandidate = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  line-height: 26px;
  ${({ elected }) => elected && 'color: green;'}
`

const LegislatorInfobox = ({ level, data }) => {
  if (level === 0) {
    return (
      <InfoboxScrollWrapper>
        <InfoboxText>點擊地圖看更多資料</InfoboxText>
      </InfoboxScrollWrapper>
    )
  }
  if (level === 1) {
    const { summary, districts } = data
    const { profRate } = summary

    return (
      <InfoboxScrollWrapper>
        <LegislatorTitle>投票率 {profRate}%</LegislatorTitle>
        {districts.map(({ county, area, range, candidates }) => {
          const legislatorIdPrefix = county + area
          const constituency = range.split(' ')[1]
          const candidateComps = candidates.map((candidate) => {
            const elected = candidate.candVictor === '*'
            return (
              <LegislatorCandidate
                elected={elected}
                key={legislatorIdPrefix + candidate.canNo}
              >
                {candidate.name} {candidate.party} {candidate.tksRate}%
                {elected && (
                  <ElectedIcon src={'/images/elected.svg'} alt="elected" />
                )}
              </LegislatorCandidate>
            )
          })
          return (
            <LegislatorDistrict key={legislatorIdPrefix}>
              <LegislatorConstituency>{constituency}</LegislatorConstituency>
              {candidateComps}
            </LegislatorDistrict>
          )
        })}
      </InfoboxScrollWrapper>
    )
  }

  const { profRate, candidates, county, area } = data
  const legislatorIdPrefix = county + area

  return (
    <InfoboxScrollWrapper>
      <LegislatorTitle>投票率 {profRate}%</LegislatorTitle>
      {candidates.map((candidate) => {
        const elected = candidate.candVictor === '*'
        return (
          <LegislatorCandidate
            elected={elected}
            key={legislatorIdPrefix + candidate.canNo}
          >
            {candidate.name} {candidate.party} {candidate.tksRate}%
            {elected && (
              <ElectedIcon src={'/images/elected.svg'} alt="elected" />
            )}
          </LegislatorCandidate>
        )
      })}
    </InfoboxScrollWrapper>
  )
}

const CouncilmanDistrict = styled.div`
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
const CouncilmanConstituency = styled.div`
  font-size: 17px;
  color: gray;
`

const CouncilmanTitle = styled.div`
  margin-bottom: 20px;
  font-weight: 700;
`

const CouncilmanCandidate = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  line-height: 26px;
  ${({ elected }) => elected && 'color: green;'}
`

const CouncilmanInfobox = ({ level, data }) => {
  if (level === 0) {
    return (
      <InfoboxScrollWrapper>
        <InfoboxText>點擊地圖看更多資料</InfoboxText>
      </InfoboxScrollWrapper>
    )
  }
  if (level === 1) {
    const { districts } = data
    return (
      <InfoboxScrollWrapper>
        {districts.map(({ county, area, range, candidates, profRate }) => {
          const councilmandPrefix = county + area
          const constituency = range.split(' ')[1]
          const candidateComps = candidates.map((candidate) => {
            const elected = candidate.candVictor === '*'
            return (
              <CouncilmanCandidate
                elected={elected}
                key={councilmandPrefix + candidate.canNo}
              >
                {candidate.name} {candidate.party} {candidate.tksRate}%
                {elected && (
                  <ElectedIcon src={'/images/elected.svg'} alt="elected" />
                )}
              </CouncilmanCandidate>
            )
          })
          return (
            <CouncilmanDistrict key={councilmandPrefix}>
              <CouncilmanConstituency>{constituency}</CouncilmanConstituency>
              <CouncilmanTitle>投票率 {profRate}%</CouncilmanTitle>
              {candidateComps}
            </CouncilmanDistrict>
          )
        })}
      </InfoboxScrollWrapper>
    )
  }

  const { profRate, candidates, county, area } = data
  const councilmandPrefix = county + area

  return (
    <InfoboxScrollWrapper>
      <CouncilmanTitle>投票率 {profRate}%</CouncilmanTitle>
      {candidates.map((candidate) => {
        const elected = candidate.candVictor === '*'
        return (
          <CouncilmanCandidate
            elected={elected}
            key={councilmandPrefix + candidate.canNo}
          >
            {candidate.name} {candidate.party} {candidate.tksRate}%
            {elected && (
              <ElectedIcon src={'/images/elected.svg'} alt="elected" />
            )}
          </CouncilmanCandidate>
        )
      })}
    </InfoboxScrollWrapper>
  )
}

const ReferendaTitle = styled.p`
  margin: 0 0 20px;
  font-weight: 700;
`

const ReferendaPassWrapper = styled.span`
  color: #ff8585;
`

const ReferendaCandidate = styled.div``

const ReferendaInfobox = ({ data }) => {
  const { profRate, adptVictor, agreeRate, disagreeRate } = data
  const noResult = adptVictor !== 'Y' && adptVictor !== 'N'
  const pass = adptVictor === 'Y'
  return (
    <InfoboxScrollWrapper>
      <ReferendaTitle>
        此案是否通過{' '}
        {pass ? <ReferendaPassWrapper>是</ReferendaPassWrapper> : '否'}
        <br />
        投票率 {profRate}%
      </ReferendaTitle>
      {noResult ? (
        <>
          <ReferendaCandidate>同意 {agreeRate}%</ReferendaCandidate>
          <ReferendaCandidate>不同意 {disagreeRate}%</ReferendaCandidate>
        </>
      ) : pass ? (
        <>
          <ReferendaCandidate>
            <ReferendaPassWrapper>同意 {agreeRate}%</ReferendaPassWrapper>
          </ReferendaCandidate>
          <ReferendaCandidate>不同意 {disagreeRate}%</ReferendaCandidate>
        </>
      ) : (
        <>
          <ReferendaCandidate>同意 {agreeRate}%</ReferendaCandidate>
          <ReferendaCandidate>
            <ReferendaPassWrapper>不同意 {disagreeRate}%</ReferendaPassWrapper>
          </ReferendaCandidate>
        </>
      )}
    </InfoboxScrollWrapper>
  )
}

/**
 * The complete Triforce, or one or more components of the Triforce.
 * @typedef {Object} InfoboxTemplateInput
 * @property {string} type - Election types, like president
 * @property {number} level - Info level: 1. country, 2. county, 3. towns / constituency 4. village
 * @property {number} profRate - Total vote rate
 * @property {object[]} candidates - All candidates info
 */

/**
 * Create infobox template based on the election infos
 * @param {InfoboxTemplateInput} input
 * @return {string} template
 */

// const templates = {
//   president: `
//   投票率 ${profRate}
//   ${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}
//   ${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}
//   `,
//   mayor: `
//   總投票率 ${profRate}
//   ${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}
//   ${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}
//   `,
//   councilman: `
//   ${constituency}
//   投票率 ${profRate}
//   ${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}
//   ${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}
//   `,
//   legislator: `
//   ${constituency}
//   投票率 ${profRate}
//   ${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}
//   ${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}
//   `,
// }

export const Infobox = ({ data }) => {
  const { electionType, level, electionData } = data
  let infobox
  switch (electionType) {
    case 'president': {
      infobox = <PresidentInfobox level={level} data={electionData} />
      break
    }
    case 'mayor': {
      infobox = <MayorInfobox level={level} data={electionData} />
      break
    }
    case 'legislator': {
      infobox = <LegislatorInfobox level={level} data={electionData} />
      break
    }
    case 'councilman': {
      console.log('infobox councilman')
      infobox = <CouncilmanInfobox level={level} data={electionData} />
      break
    }
    case 'referenda':
      console.log('referenda')
      infobox = <ReferendaInfobox data={electionData} />
      break
    default:
      break
  }

  return <InfoboxWrapper>{infobox}</InfoboxWrapper>
}

/*
總統
投票率 ${profRate}
${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}
${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}

縣市首長
總投票率 ${profRate}
${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}
${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}

立法委員
下面可能是array
${選區名稱}
投票率 ${profRate}
${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}
${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}
or
點擊地圖看更多資訊

縣市議員
下面可能是array
${選區名稱}
投票率 ${profRate}
${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}
${candidate.name} ${candidate.party} ${candidate.tksRate} ${candidate.candVictor}
or
點擊地圖看更多資訊

公投
${公投案號} ${公投案簡稱}
此案是否通過：${通過與否}
投票率 ${profRate}
同意 ${agreeRate}
不同意 ${全國投票率得票率}


*/

/**
 * President level: 1. country, 2. county, 3. towns 4. village
 * Mayor level: 1. county, 2. towns 3. village
 * Councilmen level: 1. county, 2. constituency 3. village
 * Indigenous Councilmen level: 1. county, 2. constituency 3. village
 * Legislators level: 1. county 2. constituency 3. village
 * Indigenous Legislators level: 1. country, 2. county, 3. towns 4. village
 * Legislators Party level: 1. country, 2. county, 3. towns 4. village
 * Referenda level: 1. country, 2. county, 3. towns 4. village
 */
