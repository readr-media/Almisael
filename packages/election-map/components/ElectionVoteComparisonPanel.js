import styled from 'styled-components'
import evc from '@readr-media/react-election-votes-comparison'
import { CollapsibleWrapper } from './collapsible/CollapsibleWrapper'

const ElectionVotesComparison = evc.ReactComponent.EVC

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
`

const ElectionVoteComparisonPanel = ({ evcInfo }) => {
  const { evcData, onEvcSelected, scrollTo } = evcInfo

  return (
    evcData && (
      <ElectionVotesComparisonWrapper title={'縣市議員候選人'}>
        <StyledEVC
          election={evcData}
          device="mobile"
          theme="electionMap"
          scrollTo={scrollTo}
          onChange={(selector, value) => {
            onEvcSelected(value)
          }}
        />
      </ElectionVotesComparisonWrapper>
    )
  )
}

export default ElectionVoteComparisonPanel
