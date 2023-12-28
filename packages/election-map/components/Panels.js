import styled from 'styled-components'
import ElectionVoteComparisonPanel from './ElectionVoteComparisonPanel'
import { SeatsPanel } from './SeatsPanel'
import { MapNavigateButton } from './MapNavigateButton'
import { MapLocations } from './MapLocations'
import { YearSelect } from './YearSelect'
import { ReferendumControl } from './ReferendumControl'
import { InfoboxPanels } from './InfoboxPanels'
import { useAppSelector } from '../hook/useRedux'
import ElectionSelector from './mobile/ElectionSelector'
import { electionNamePairs } from '../utils/election'
import { useMemo } from 'react'

const Wrapper = styled.div`
  position: relative;
  pointer-events: none;
  & > * {
    pointer-events: auto;
  }
  padding: 92px 0 20px 48px;
  width: 100%;
  min-height: max(
    100vh,
    735px
  ); // evc and lastUpdate will need at least 780px to show
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

const ElectionSelectWrapper = styled.div`
  display: flex;
  gap: 8px;
`

const StyledElectionSelect = styled(ElectionSelector)`
  height: 31px;
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
  height: ${
    /**
     * @param {Object} props
     * @param {import('../consts/electionsConfig').ElectionType} props.electionType
     * @param {boolean} props.compareMode
     */
    ({ electionType, compareMode }) =>
      electionType === 'referendum'
        ? compareMode
          ? '520px'
          : '350px'
        : '136px'
  };
`

export const Panels = ({ onEvcSelected }) => {
  const lastUpdate = useAppSelector((state) => state.election.data.lastUpdate)
  const compareMode = useAppSelector(
    (state) => state.election.compare.info.compareMode
  )
  const electionConfig = useAppSelector((state) => state.election.config)
  const year = useAppSelector((state) => state.election.control.year)
  const number = useAppSelector((state) => state.election.control.number)
  const renderingDistrictNames = useAppSelector(
    (state) => state.map.ui.districtNames
  )

  const electionType = electionConfig.electionType
  const { countyName, townName, areaName, villageName } = renderingDistrictNames
  const locations = [countyName, townName, areaName, villageName].filter(
    (name) => !!name
  )
  if (!locations.length) locations.push('全國')

  const electionSubtypes = useMemo(() => {
    if (!electionConfig.subtypes) {
      return
    }
    return electionConfig.subtypes.filter((subtype) => !subtype.mobileOnly)
  }, [electionConfig.subtypes])

  return (
    <Wrapper>
      <LeftPanelWrapper>
        <ElectionSelectWrapper>
          <StyledElectionSelect
            selectorType="electionType"
            options={electionNamePairs}
          />
          {electionConfig.subtypes && (
            <StyledElectionSelect
              selectorType="electionSubType"
              options={electionSubtypes}
            />
          )}
        </ElectionSelectWrapper>
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
        <PlaceHolder electionType={electionType} compareMode={compareMode} />
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
      {lastUpdate && (
        <LastUpdateTime>
          最後更新時間：{lastUpdate} 資料來源：中央選舉委員會
        </LastUpdateTime>
      )}
    </Wrapper>
  )
}
