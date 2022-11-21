import styled from 'styled-components'
import ElectionVoteComparisonPanel from './ElectionVoteComparisonPanel'
import { countyMappingData } from './helper/election'
import { SeatsPanel } from './SeatsPanel'
import { MapNavigateButton } from './MapNavigateButton'
import { MapLocations } from './MapLocations'
import { YearSelect } from './YearSelect'
import { ElectionSelect } from './ElectionSelect'
import { ElectionRadio } from './ElectionRadio'
import { ReferendumControl } from './ReferendumControl'
import { InfoboxPanels } from './InfoboxPanels'

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
  height: 350px;
  pointer-events: none;
`

export const Panels = ({
  onElectionChange,
  mapObject,
  election,
  infoboxData,
  compareInfoboxData,
  seatData,
  evcInfo,
  compareInfo,
  subtypeInfo,
  yearInfo,
  numberInfo,
  lastUpdate,
}) => {
  const { electionType } = election
  const { compareMode } = compareInfo
  const { countyName, townName, constituencyName, villageName } = mapObject
  const locations = [
    countyName,
    townName,
    constituencyName,
    villageName,
  ].filter((name) => !!name)
  if (!locations.length) locations.push('全國')

  const expandMode = !!seatData || compareInfo.compareMode

  return (
    <Wrapper expandMode={expandMode}>
      <LeftPanelWrapper>
        <StyledElectionSelect
          electionType={electionType}
          onElectionChange={onElectionChange}
        />
        {numberInfo?.number && (
          <ReferendumControl
            key={election.electionType}
            numberInfo={numberInfo}
            compareInfo={compareInfo}
          />
        )}
        {!numberInfo?.number && (
          <>
            <MapNavigateButton mapObject={mapObject} />
            <MapLocations locations={locations} />
            <InfoboxPanels
              infoboxData={infoboxData}
              subtypeInfo={subtypeInfo}
              compareInfo={compareInfo}
              election={election}
              numberInfo={numberInfo}
              yearInfo={yearInfo}
              compareInfoboxData={compareInfoboxData}
            />
          </>
        )}
        {!compareMode && (
          <SeatsPanel
            meta={{
              ...election.meta.seat,
              year: yearInfo.year?.key,
              location: countyMappingData.find(
                (countyData) => countyData.countyCode === mapObject.countyId
              )?.countyName,
            }}
            data={seatData}
          />
        )}
        {!numberInfo?.number && (
          <StyledYearSelect
            key={election.electionType + yearInfo.year.key}
            yearInfo={yearInfo}
            compareInfo={compareInfo}
          />
        )}
        <PlaceHolder />
        {numberInfo?.number && (
          <>
            <BottomPanelWrapper>
              <MapNavigateButton mapObject={mapObject} />
              <MapLocations locations={locations} />
              <InfoboxPanels
                infoboxData={infoboxData}
                subtypeInfo={subtypeInfo}
                compareInfo={compareInfo}
                election={election}
                numberInfo={numberInfo}
                yearInfo={yearInfo}
                compareInfoboxData={compareInfoboxData}
              />
            </BottomPanelWrapper>
          </>
        )}
      </LeftPanelWrapper>

      {!compareMode && <ElectionVoteComparisonPanel evcInfo={evcInfo} />}
      {subtypeInfo && <StyledELectionRadio subtypeInfo={subtypeInfo} />}
      {lastUpdate && (
        <LastUpdateTime>
          最後更新時間：{lastUpdate}資料來源：中央選舉委員會
        </LastUpdateTime>
      )}
    </Wrapper>
  )
}
