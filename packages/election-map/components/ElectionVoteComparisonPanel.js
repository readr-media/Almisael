import styled, { css } from 'styled-components'
import { CollapsibleWrapper } from './collapsible/CollapsibleWrapper'
import widgets from '@readr-media/react-election-widgets'
import { useAppSelector } from '../hook/useRedux'
import gtag from '../utils/gtag'

/**
 * @typedef {import('../consts/electionsConfig').ElectionType} ElectionType
 * @typedef {import('../consts/electionsConfig').ElectionSubtype} ElectionSubtype
 */

const ElectionVotesComparison = widgets.VotesComparison.ReactComponent

const ElectionVotesComparisonDesktopWrapper = styled(CollapsibleWrapper)`
  position: absolute;
  top: 76px;
  right: 20px;
`

const ElectionVotesComparisonMobileWrapper = styled.div`
  margin: 20px 0 0;
`
const mobileStyle = css`
  margin: 0 auto;
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
 *
 * @param {Object} election
 * @param {ElectionType} electionType
 * @param {ElectionSubtype} subtype
 * @returns {boolean}
 */
const computeShouldShowEVC = (election, electionType, subtype) => {
  if (!election) {
    return false
  }
  switch (electionType) {
    case 'president':
      return Array.isArray(election.candidates) && !!election.candidates.length
    case 'mayor':
      return Array.isArray(election.districts) && !!election.districts.length
    case 'legislator':
      switch (subtype.key) {
        case 'normal':
          return (
            Array.isArray(election.districts) && !!election.districts.length
          )
        case 'mountainIndigenous':
        case 'plainIndigenous':
          return (
            Array.isArray(election.candidates) && !!election.candidates.length
          )
        case 'party':
          return Array.isArray(election.parties) && !!election.parties.length
        default:
          return false
      }
    case 'councilMember':
      return Array.isArray(election.districts) && !!election.districts.length

    case 'referendum':
      return (
        Array.isArray(election.propositions) && !!election.propositions.length
      )
    default:
      return false
  }
}

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
  const subtype = useAppSelector((state) => state.election.control.subtype)
  const countyCode = useAppSelector(
    (state) => state.election.control.level.countyCode
  )
  const evcData = useAppSelector((state) => state.election.data.evcData)
  let wrapperTitle = useAppSelector(
    (state) => state.election.config.meta.evc.wrapperTitle
  )
  wrapperTitle =
    typeof wrapperTitle === 'string' ? wrapperTitle : wrapperTitle[subtype.key]

  let election
  // only councilMember and legislator with subtype 'normal' will have evcData for level 1
  if (
    electionType === 'councilMember' ||
    (electionType === 'legislator' && subtype.key === 'normal')
  ) {
    election = evcData[1][countyCode]
  } else {
    election = evcData[0]
  }
  const shouldShowEVC = computeShouldShowEVC(election, electionType, subtype)

  const electionVoteComparisonJsx = isMobile ? (
    <ElectionVotesComparisonMobileWrapper>
      <StyledEVC
        electionType={electionType}
        election={election}
        device="mobile"
        theme="electionMap"
        scrollTo={evcScrollTo}
        onChange={(selector, value) => {
          // In fact mobile selector won't react to the evc selected value,
          // but here we still call the callback to centralized GA event logic.
          onEvcSelected(value)
        }}
        isMobile={isMobile} //for styled-component
      />
    </ElectionVotesComparisonMobileWrapper>
  ) : (
    <ElectionVotesComparisonDesktopWrapper
      title={wrapperTitle}
      onCollapse={() => {
        gtag.sendGAEvent('Click', {
          project: `票數比較 收合`,
        })
      }}
    >
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
    </ElectionVotesComparisonDesktopWrapper>
  )

  return shouldShowEVC && <>{electionVoteComparisonJsx}</>
}

export default ElectionVoteComparisonPanel
