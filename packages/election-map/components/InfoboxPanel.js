import styled from 'styled-components'
import { CollapsibleWrapper } from './collapsible/CollapsibleWrapper'
import { currentYear } from '../consts/electionsConfig'
import { electionNamePairs } from '../utils/election'
import { Infobox } from './infobox/Infobox'
import { useAppSelector } from '../hook/useRedux'
import gtag from '../utils/gtag'

const Wrppaer = styled.div`
  width: 320px;
`
const InfoboxWrapper = styled(CollapsibleWrapper)`
  width: 100%;
  background-color: white;
  pointer-events: auto;
  margin: 22px 0 0;
`

const InfoboxYear = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 35px;
`

/**
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @param {import('../utils/electionsData').InfoboxData} props.data
 * @param {import('../consts/electionsConfig').ElectionSubtype} props.subtype
 * @param {Object} props.compareInfo
 * @param {import('../consts/electionsConfig').Year} props.year
 * @param {import('../consts/electionsConfig').ReferendumNumber} props.number
 * @returns {JSX.Element}
 */
export const InfoboxPanel = ({
  className,
  data,
  subtype,
  compareInfo,
  year,
  number,
}) => {
  const electionType = useAppSelector(
    (state) => state.election.config.electionType
  )
  const level = useAppSelector((state) => state.election.control.level)
  // add key for infobox component to rerender when level control changed
  const key =
    level.level +
    level.countyCode +
    level.townCode +
    level.areaCode +
    level.villageCode
  const { compareMode } = compareInfo
  const electionName = electionNamePairs.find(
    (electionNamePair) => electionNamePair.electionType === electionType
  )?.electionName
  const title = compareMode
    ? electionType === 'referendum'
      ? `${number?.year} ${number?.name}`
      : electionName
    : '詳細資訊'
  return (
    <Wrppaer className={className} key={key}>
      {compareMode && !number && <InfoboxYear>{year.key}</InfoboxYear>}
      <InfoboxWrapper
        title={title}
        onCollapse={() => {
          gtag.sendGAEvent('Click', {
            project: `infobox 收合`,
          })
        }}
      >
        <Infobox
          data={data}
          subtype={subtype}
          isCurrentYear={year.key === currentYear}
          year={year.key}
        />
      </InfoboxWrapper>
    </Wrppaer>
  )
}
