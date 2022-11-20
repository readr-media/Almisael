import styled from 'styled-components'
import { CollapsibleWrapper } from './collapsible/CollapsibleWrapper'
import { electionNamePairs } from './helper/election'
import { Infobox } from './infobox/Infobox'
const InfoboxWrapper = styled(CollapsibleWrapper)`
  width: 320px;
  background-color: white;
  pointer-events: auto;
  margin: 22px 0 0;
`

export const InfoboxPanel = ({
  className,
  data,
  subtype,
  compareInfo,
  election,
  number,
}) => {
  const isRunning = data.isRunning
  const electionName = electionNamePairs.find(
    (electionNamePair) =>
      electionNamePair.electionType === election.electionType
  )?.electionName
  const title = compareInfo.compareMode
    ? election.electionType === 'referendum'
      ? `${number?.year} ${number?.name}`
      : electionName
    : '詳細資訊'
  return (
    <InfoboxWrapper className={className} title={title}>
      <Infobox data={data} subtype={subtype} isRunning={isRunning} />
    </InfoboxWrapper>
  )
}
