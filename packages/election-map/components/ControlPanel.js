import styled from 'styled-components'
import { ElectionRadio } from './ElectionRadio'
import { ElectionSelect } from './ElectionSelect'
import { YearSelect } from './YearSelect'
import { ReferendumControl } from './ReferendumControl'
import { MapNavigateButton } from './MapNavigateButton'
import { MapLocations } from './MapLocations'

const Wrapper = styled.div`
  width: 320px;
  & * {
    pointer-events: auto;
  }
`

const StyledElectionSelect = styled(ElectionSelect)`
  margin: 92px 0 0 12px;
`

const StyledELectionRadio = styled(ElectionRadio)`
  position: absolute;
  bottom: ${({ expandMode }) => (expandMode ? `193px` : `73px`)};
  right: 121px;
`
const LastUpdateTime = styled.div`
  position: absolute;
  bottom: ${({ expandMode }) => (expandMode ? `148px` : `28px`)};
  right: 8px;
  font-size: 14px;
  font-weight: 500;
`

const StyledYearSelect = styled(YearSelect)`
  position: absolute;
  bottom: 40px;
  left: 0;
`

export const ControlPanel = ({
  onElectionChange,
  mapObject,
  election,
  expandMode,
  subtypeInfo,
  lastUpdate,
  yearInfo,
  numberInfo,
  compareInfo,
  locations,
}) => {
  const { electionType } = election

  if (numberInfo?.number) {
    return (
      <Wrapper>
        <StyledElectionSelect
          electionType={electionType}
          onElectionChange={onElectionChange}
        />
        <ReferendumControl
          key={election.electionType}
          numberInfo={numberInfo}
          compareInfo={compareInfo}
        />
        {subtypeInfo && (
          <StyledELectionRadio
            expandMode={expandMode}
            subtypeInfo={subtypeInfo}
          />
        )}
        {lastUpdate && (
          <LastUpdateTime expandMode={expandMode}>
            最後更新時間：{lastUpdate}資料來源：中央選舉委員會
          </LastUpdateTime>
        )}
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <StyledElectionSelect
          electionType={electionType}
          onElectionChange={onElectionChange}
        />
        <MapNavigateButton mapObject={mapObject} />
        <MapLocations locations={locations} />
        {subtypeInfo && (
          <StyledELectionRadio
            expandMode={expandMode}
            subtypeInfo={subtypeInfo}
          />
        )}
        {lastUpdate && (
          <LastUpdateTime expandMode={expandMode}>
            最後更新時間：{lastUpdate}資料來源：中央選舉委員會
          </LastUpdateTime>
        )}
        <StyledYearSelect
          key={election.electionType}
          yearInfo={yearInfo}
          compareInfo={compareInfo}
        />
      </Wrapper>
    )
  }
}
