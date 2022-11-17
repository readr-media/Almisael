import styled from 'styled-components'
import evc from '@readr-media/react-election-votes-comparison'

const ElectionVotesComparison = evc.ReactComponent.EVC

const StyledEVC = styled(ElectionVotesComparison)`
  position: absolute;
  width: 320px !important;
  max-height: 666px;
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
`

const ElectionVoteComparisonPanel = ({ evcInfo }) => {
  const { evcData, onEvcSelected, scrollTo } = evcInfo
  console.log(
    'ElectionVoteComparisonPanel',
    scrollTo,
    evcData,
    evcData.districts.find((district) => district.districtName === scrollTo)
  )
  return (
    <StyledEVC
      key={JSON.stringify(evcData)}
      election={evcData}
      device="mobile"
      theme="electionModule"
      ui={{ disableTabs: true }}
      scrollTo={scrollTo}
      // scrollTo="桃園市"
      onChange={(selector, value) => {
        onEvcSelected(value)
      }}
    />
  )
}

export default ElectionVoteComparisonPanel
