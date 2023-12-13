import styled from 'styled-components'
import ElectionVoteComparisonPanel from './ElectionVoteComparisonPanel'
import { SeatsPanel } from './SeatsPanel'
import { MapNavigateButton } from './MapNavigateButton'
import { MapLocations } from './MapLocations'
import { YearSelect } from './YearSelect'
import { ElectionSelect } from './ElectionSelect'
import { ElectionRadio } from './ElectionRadio'
import { ReferendumControl } from './ReferendumControl'
import { InfoboxPanels } from './InfoboxPanels'
import { useAppSelector } from '../hook/useRedux'

const Wrapper = styled.div`
  position: relative;
  pointer-events: none;
  & > * {
    pointer-events: auto;
  }
  padding: 92px 0 20px 48px;
  width: 100%;
  min-height: ${({ expandMode }) => (expandMode ? '1084px' : '100vh')};

  z-index: 1;
`

const LeftPanelWrapper = styled.div`
  width: 320px;
  pointer-events: none;
  & > * {
    pointer-events: auto;
  }
`

const BottomPanelWrapper = styled.div`
  position: absolute;
  bottom: 47px;
`

const StyledElectionSelect = styled(ElectionSelect)`
  margin-left: 12px;
`

const StyledELectionRadio = styled(ElectionRadio)`
  position: absolute;
  bottom: 73px;
  right: 121px;
`
const LastUpdateTime = styled.div`
  position: absolute;
  bottom: 28px;
  right: 8px;
  font-size: 14px;
  font-weight: 500;
`

const StyledYearSelect = styled(YearSelect)`
  position: absolute;
  bottom: 40px;
`

const PlaceHolder = styled.div`
  pointer-events: none;
  height: ${({ electionType }) =>
    electionType === 'referendum' ? '350px' : '300px'};
`

export const Panels = ({ onEvcSelected }) => {
  const lastUpdate = useAppSelector((state) => state.election.data.lastUpdate)
  const compareMode = useAppSelector(
    (state) => state.election.compare.info.compareMode
  )
  const electionConfig = useAppSelector((state) => state.election.config)
  const levelControl = useAppSelector((state) => state.election.control.level)
  const year = useAppSelector((state) => state.election.control.year)
  const number = useAppSelector((state) => state.election.control.number)
  const subtype = useAppSelector((state) => state.election.control.subtype)
  const seatData = useAppSelector((state) => state.election.data.seatData)
  const renderingDistrictNames = useAppSelector(
    (state) => state.map.ui.districtNames
  )
  let seats
  if (electionConfig.electionType === 'councilMember') {
    seats = seatData[1][levelControl.countyCode]
  } else if (electionConfig.electionType === 'legislator') {
    if (subtype.key === 'normal') {
      seats = seatData[1][levelControl.countyCode]
    } else {
      seats = seatData[0]
    }
  }

  const electionType = electionConfig.electionType
  const { countyName, townName, areaName, villageName } = renderingDistrictNames
  const locations = [countyName, townName, areaName, villageName].filter(
    (name) => !!name
  )
  if (!locations.length) locations.push('全國')

  const expandMode = !!seats || compareMode

  return (
    <Wrapper expandMode={expandMode}>
      <LeftPanelWrapper>
        <StyledElectionSelect />
        {number && <ReferendumControl key={electionType} />}
        {!number && (
          <>
            <MapNavigateButton />
            <MapLocations locations={locations} />
            <InfoboxPanels />
          </>
        )}
        {!compareMode && <SeatsPanel />}
        {!number && <StyledYearSelect key={electionType + year.key} />}
        <PlaceHolder electionType={electionType} />
        {number && (
          <>
            <BottomPanelWrapper>
              <MapNavigateButton />
              <MapLocations locations={locations} />
              <InfoboxPanels />
            </BottomPanelWrapper>
          </>
        )}
      </LeftPanelWrapper>

      {!compareMode && (
        <ElectionVoteComparisonPanel onEvcSelected={onEvcSelected} />
      )}
      {subtype && <StyledELectionRadio />}
      {lastUpdate && (
        <LastUpdateTime>
          最後更新時間：{lastUpdate}資料來源：中央選舉委員會
        </LastUpdateTime>
      )}
    </Wrapper>
  )
}
