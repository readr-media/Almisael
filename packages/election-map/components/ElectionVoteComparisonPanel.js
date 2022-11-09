import { memo } from 'react'
import styled from 'styled-components'
import evc from '@readr-media/react-election-votes-comparison'

const ElectionVotesComparison = evc.ReactComponent.EVC

const StyledEVC = styled(ElectionVotesComparison)`
  position: absolute;
  width: 320px;
  top: 76px;
  right: 20px;
  border: 1px solid #000;
  border-radius: 12px;
  overflow: hidden;

  header {
    border-top: unset;
    border-bottom: 1px solid #000;
  }
  h3:nth-of-type(2) {
    border-top: 1px solid #000;
  }
`

const ElectionVoteComparisonPanel = ({ data }) => {
  return <StyledEVC election={data} device="mobile" theme="electionModule" />
}

export default memo(ElectionVoteComparisonPanel)
