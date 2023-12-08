import { useState } from 'react'
import styled, { css } from 'styled-components'
import { CollapsibleWrapper } from './collapsible/CollapsibleWrapper'

import { useAppSelector } from '../hook/useRedux'

// import widgets from '@readr-media/react-election-widgets'
import widgets from '../.yalc/@readr-media/react-election-widgets/lib/index.js'

const ElectionVotesComparison = widgets.VotesComparison.ReactComponent
import { data as LegislatorDistrictMock } from '../mock-datas/votes-comparison/legislator/district/taipeiCity'
import { data as PresidentMock } from '../mock-datas/votes-comparison/president/all'
import { data as LegislatorPartyMock } from '../mock-datas/votes-comparison/legislator/party/all'
import { data as LegislatorPlainMock } from '../mock-datas/votes-comparison/legislator/plainIndigenous/all'
import { data as LegislatorMountainMock } from '../mock-datas/votes-comparison/legislator/mountainIndigenous/all'

const mobileStyle = css`
  width: calc(100% - 54px);
  margin: auto;
  padding-bottom: 0 !important;
  max-height: 568px;
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

const ElectionVotesComparisonWrapper = styled(CollapsibleWrapper)`
  position: absolute;
  top: 76px;
  right: 20px;
`

/**
 * @param {Object} props
 * @param {boolean} props.isMobile - Whether the component is being rendered on mobile device.
 * @param {string} props.electionType
 */
const StyledEVC = styled(ElectionVotesComparison)`
  ${({ isMobile }) => (isMobile ? mobileStyle : desktopStyle)}

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

const ToggleItem = styled.div`
  background: yellow;
  position: fixed;
  top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  font-size: 10px;
  cursor: pointer;

  &:hover {
    background: blue;
    color: white;
  }
`

/**
 *  @param {Object} props
 *  @param {Function} props.onEvcSelected
 *  @param {boolean} [props.isMobile]
 *  @returns {React.ReactElement}
 */
export default function ElectionVoteComparisonPanel({
  onEvcSelected,
  isMobile = false,
}) {
  console.log('onEvcSelected', onEvcSelected)

  // Selector（暫時註解）--------------------------
  // const evcScrollTo = useAppSelector(
  //   (state) => state.election.control.evcScrollTo
  // )
  const electionType = useAppSelector(
    (state) => state.election.config.electionType
  )
  // const countyCode = useAppSelector(
  //   (state) => state.election.control.level.countyCode
  // )
  // const evcData = useAppSelector((state) => state.election.data.evcData)

  // let election
  // if (electionType === 'councilMember') {
  //   election = evcData[1][countyCode]
  // } else {
  //   election = evcData[0]
  // }

  // const shouldShowJsx =
  //   election && (election.districts?.length || election.propositions?.length)

  // ----------------------------------------
  // FIXME: 目前尚未能直接使用 onEvcSelected，因為 electionType 不會更新

  //全國層級 [0]
  function All_SelectedChange() {
    const target = document.querySelector(`#first-id-background`)
    if (target) {
      let event = new MouseEvent('click', { bubbles: true })
      target.dispatchEvent(event)
    }
  }

  // 正副總統 - president
  const PresidentData = {
    title: '總統選舉', // TODO: 確認 title 名稱是否要加 `候選人`
    election: PresidentMock,
    scrollTo: undefined, // or '全國'
    onEvcSelected: All_SelectedChange,
  }

  // 立委/平地原住民 - legislator-plainIndigenous
  const LegislatorPlainData = {
    title: '立委選舉',
    election: LegislatorPlainMock,
    scrollTo: undefined, // or '全國（平地）'
    onEvcSelected: All_SelectedChange,
  }

  // 立委/山地原住民 - legislator-mountainIndigenous
  const LegislatorMountainData = {
    title: '立委選舉',
    election: LegislatorMountainMock,
    scrollTo: undefined, // or '全國（山地）'
    onEvcSelected: All_SelectedChange,
  }

  // 立委/不分區 - legislator-party
  const LegislatorPartyData = {
    title: '立委選舉',
    election: LegislatorPartyMock,
    scrollTo: undefined, // or '全國'
    onEvcSelected: All_SelectedChange,
  }

  // 立委/區域 - legislator-district
  const LegislatorDistrictData = {
    title: '立委選舉',
    election: LegislatorDistrictMock,
    scrollTo: '',
    onEvcSelected: () => {},
  }

  const [mockData, setMockData] = useState(PresidentData)

  return (
    <>
      <ToggleItem
        style={{ right: '300px' }}
        onClick={() => setMockData(LegislatorDistrictData)}
      >
        立(區域)
      </ToggleItem>
      <ToggleItem
        style={{ right: '240px' }}
        onClick={() => setMockData(LegislatorPartyData)}
      >
        立(不分區)
      </ToggleItem>
      <ToggleItem
        style={{ right: '190px' }}
        onClick={() => setMockData(LegislatorPlainData)}
      >
        立(平地)
      </ToggleItem>
      <ToggleItem
        style={{ right: '140px' }}
        onClick={() => setMockData(LegislatorMountainData)}
      >
        立(山地)
      </ToggleItem>
      <ToggleItem
        style={{ right: '105px' }}
        onClick={() => setMockData(PresidentData)}
      >
        總統
      </ToggleItem>

      {/* {shouldShowJsx && ( */}
      <ElectionVotesComparisonWrapper title={`${mockData.title}候選人`}>
        <StyledEVC
          // election={election}
          // scrollTo={evcScrollTo}
          // onChange={(selector, value) => {
          //   onEvcSelected(value)
          // }}
          device="mobile"
          theme="electionMap"
          election={mockData.election}
          scrollTo={mockData.scrollTo}
          onChange={mockData.onEvcSelected}
          isMobile={isMobile} //for styled-component
          electionType={electionType} //for styled-component
        />
      </ElectionVotesComparisonWrapper>
      {/* )} */}
    </>
  )
}
