import styled from 'styled-components'
import { CollapsibleWrapper } from './collapsible/CollapsibleWrapper'
import widgets from '@readr-media/react-election-widgets'
import { useAppSelector } from '../hook/useRedux'

const ElectionVotesComparison = widgets.VotesComparison.ReactComponent

const ElectionVotesComparisonWrapper = styled(CollapsibleWrapper)`
  position: absolute;
  top: 76px;
  right: 20px;
`

const StyledEVC = styled(ElectionVotesComparison)`
  width: 320px !important;
  padding-bottom: 0 !important;
  max-height: 568px;
  overflow: auto;

  header {
    border-top: unset;
    border-bottom: 1px solid #000;
    margin-bottom: 20px;
    & + div {
      margin-top: 20px;
    }
  }
  h3:nth-of-type(2) {
    border-top: 1px solid #000;
  }
  > div:nth-of-type(2) {
    border-bottom: unset;
  }

  @media (max-height: 750px) {
    ${({ electionType }) =>
      electionType === 'referendum' && `max-height: 500px;`}
  }
`

const ElectionVoteComparisonPanel = ({ onEvcSelected }) => {
  const evcScrollTo = useAppSelector(
    (state) => state.election.control.evcScrollTo
  )
  const electionType = useAppSelector(
    (state) => state.election.config.electionType
  )
  const countyCode = useAppSelector(
    (state) => state.election.control.level.countyCode
  )
  const evcData = useAppSelector((state) => state.election.data.evcData)

  let election
  if (electionType === 'councilMember') {
    election = evcData[1][countyCode]
  } else {
    election = evcData[0]
  }
  console.log('election', evcData)

  return (
    election &&
    (election.districts?.length || election.propositions?.length) && (
      <ElectionVotesComparisonWrapper title={'縣市議員候選人'}>
        <StyledEVC
          electionType={electionType}
          election={election}
          device="mobile"
          theme="electionMap"
          scrollTo={evcScrollTo}
          onChange={(selector, value) => {
            onEvcSelected(value)
          }}
        />
      </ElectionVotesComparisonWrapper>
    )
  )
}

export default ElectionVoteComparisonPanel
