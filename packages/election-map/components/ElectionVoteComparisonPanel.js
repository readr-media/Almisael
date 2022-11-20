import styled from 'styled-components'
import evc from '@readr-media/react-election-votes-comparison'

const ElectionVotesComparison = evc.ReactComponent.EVC

const StyledEVC = styled(ElectionVotesComparison)`
  position: absolute;
  width: 320px !important;
  padding-bottom: 0 !important;
  max-height: 568px;
  overflow: auto;
  top: 76px;
  right: 20px;
  border: 1px solid #000;
  border-radius: 12px;

  header {
    border-top: unset;
    border-bottom: 1px solid #000;
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
    <StyledEVC
      election={evcData}
      device="mobile"
      theme="electionMap"
      scrollTo={scrollTo}
      onChange={(selector, value) => {
        onEvcSelected(value)
      }}
    />
  )
}

export default ElectionVoteComparisonPanel
