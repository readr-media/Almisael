import styled, { css } from 'styled-components'
import { CollapsibleWrapper } from './collapsible/CollapsibleWrapper'
import widgets from '@readr-media/react-election-widgets'
import { useAppSelector } from '../hook/useRedux'

const ElectionVotesComparison = widgets.VotesComparison.ReactComponent

const ElectionVotesComparisonDesktopWrapper = styled(CollapsibleWrapper)`
  position: absolute;
  top: 76px;
  right: 20px;
`

const ElectionVotesComparisonMobileWrapper = styled.div`
  margin-top: 20px;
`
const mobileStyle = css`
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 0 !important;

  overflow: auto;
  border-radius: 12px;
  border: 2px solid #000;
`

const desktopStyle = css`
  width: 320px !important;
  padding-bottom: 0 !important;
  max-height: 568px;
  overflow: auto;
`

const StyledEVC = styled(ElectionVotesComparison)`
  ${({ isMobile }) => (isMobile ? mobileStyle : desktopStyle)};

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

/**
 *  @param {Object} props
 *  @param {Function} props.onEvcSelected
 *  @param {boolean} [props.isMobile]
 *  @returns {React.ReactElement}
 */
const ElectionVoteComparisonPanel = ({ onEvcSelected, isMobile = false }) => {
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
  const shouldShowEVC = Boolean(
    election && (election.districts?.length || election.propositions?.length)
  )
  const electionVoteComparisonJsx = isMobile ? (
    <ElectionVotesComparisonMobileWrapper>
      <StyledEVC
        electionType={electionType}
        election={election}
        device="mobile"
        theme="electionMap"
        scrollTo={evcScrollTo}
        onChange={(selector, value) => {
          onEvcSelected(value)
        }}
        isMobile={isMobile} //for styled-component
      />
    </ElectionVotesComparisonMobileWrapper>
  ) : (
    <ElectionVotesComparisonDesktopWrapper title={'縣市議員候選人'}>
      <StyledEVC
        electionType={electionType}
        election={election}
        device="mobile"
        theme="electionMap"
        scrollTo={evcScrollTo}
        onChange={(selector, value) => {
          console.log('value', value)
          onEvcSelected(value)
        }}
        isMobile={isMobile} //for styled-component
      />
    </ElectionVotesComparisonDesktopWrapper>
  )

  return shouldShowEVC && <>{electionVoteComparisonJsx}</>
}

export default ElectionVoteComparisonPanel
