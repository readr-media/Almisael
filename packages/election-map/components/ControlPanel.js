import styled from 'styled-components'
import { electionMapColor } from '../consts/colors'
import { ElectionRadio } from './ElectionRadio'
import { ElectionSelect } from './ElectionSelect'
import { YearSelect } from './YearSelect'
import { ReferendumControl } from './ReferendumControl'

const Wrapper = styled.div`
  width: 320px;
  & * {
    pointer-events: auto;
  }
`

const MapButtonWrapper = styled.div`
  margin-top: 20px;
`

const MapLevelBackButton = styled.button`
  border: 1px solid #000;
  background-color: #686868;
  color: ${electionMapColor};
  border-radius: 8px;
  line-height: 23px;
  text-align: center;
  width: 80px;
  height: 32px;

  &:hover,
  &:active {
    background-color: #000;
  }
`

const MapLevelResetButton = styled.button`
  margin-left: 4px;
  border: 1px solid #000;
  background-color: #686868;
  color: ${electionMapColor};
  border-radius: 8px;
  line-height: 23px;
  text-align: center;
  width: 80px;
  height: 32px;

  &:hover,
  &:active {
    background-color: #000;
  }
`

const LocationsWrapper = styled.div`
  margin: 13px 0 0;
`

const Location = styled.span`
  margin-right: 16px;
  font-size: 24px;
  line-height: 34.75px;
  &:last-of-type {
    font-weight: 900;
    margin-right: unset;
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

const GoDownWrapper = styled.div`
  position: absolute;
  bottom: 240px;
  left: 48px;

  ${({ compare }) => compare && `bottom: 452px;`}
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
}) => {
  const { compareMode } = compareInfo
  const { number } = numberInfo

  const { countyName, townName, constituencyName, villageName } = mapObject
  const { electionType } = election
  const locations = [
    countyName,
    townName,
    constituencyName,
    villageName,
  ].filter((name) => !!name)
  if (!locations.length) locations.push('全國')

  console.log('ControlPanel number', number)
  if (number) {
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
        <GoDownWrapper compare={compareMode}>
          <MapButtonWrapper>
            <MapLevelBackButton
              disabled={mapObject.level === 0}
              onClick={() => {
                const target = document.querySelector(
                  `#first-id-${mapObject.upperLevelId}`
                )
                let event = new MouseEvent('click', { bubbles: true })
                target.dispatchEvent(event)
              }}
            >
              回上層
            </MapLevelBackButton>
            <MapLevelResetButton
              disabled={mapObject.level === 0}
              onClick={() => {
                const target = document.querySelector(`#first-id-background`)
                let event = new MouseEvent('click', { bubbles: true })
                target.dispatchEvent(event)
              }}
            >
              回全國
            </MapLevelResetButton>
          </MapButtonWrapper>
          <LocationsWrapper>
            {locations.map((location, i) => (
              <Location key={i}>{location}</Location>
            ))}
          </LocationsWrapper>
        </GoDownWrapper>
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
        <MapButtonWrapper>
          <MapLevelBackButton
            disabled={mapObject.level === 0}
            onClick={() => {
              const target = document.querySelector(
                `#first-id-${mapObject.upperLevelId}`
              )
              let event = new MouseEvent('click', { bubbles: true })
              target.dispatchEvent(event)
            }}
          >
            回上層
          </MapLevelBackButton>
          <MapLevelResetButton
            disabled={mapObject.level === 0}
            onClick={() => {
              const target = document.querySelector(`#first-id-background`)
              let event = new MouseEvent('click', { bubbles: true })
              target.dispatchEvent(event)
            }}
          >
            回全國
          </MapLevelResetButton>
        </MapButtonWrapper>
        <LocationsWrapper>
          {locations.map((location, i) => (
            <Location key={i}>{location}</Location>
          ))}
        </LocationsWrapper>
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
