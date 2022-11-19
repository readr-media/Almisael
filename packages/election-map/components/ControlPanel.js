import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { electionMapColor } from '../consts/colors'
import { ElectionRadio } from './ElectionRadio'
import { ElectionSelect } from './ElectionSelect'
import { ReferendumSelect } from './ReferendumSelect'
import { YearSelect } from './YearSelect'

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

const StyledReferendumSelect = styled(ReferendumSelect)`
  margin: 17px 0 0 12px;
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
`

const ActionButton = styled.button`
  display: inline-block;
  margin: 20px 0 0 12px;
  border: 1px solid #000;
  background-color: ${({ compare }) => (compare ? '#e0e0e0' : '#ffc7bb')};
  color: #000;
  border-radius: 8px;
  line-height: 23px;
  text-align: center;
  width: 80px;
  height: 32px;
`

export const ControlPanel = ({
  electionNamePairs,
  onElectionChange,
  mapObject,
  election,
  expandMode,
  subtypeInfo,
  lastUpdate,
  yearInfo,
  number,
  numbers,
}) => {
  const [compare, setCompare] = useState(false)
  const comapreNumber =
    numbers?.length > 1 ? numbers.filter((n) => n.key !== number.key)[0] : null
  const [compareCandidates, setCompareCandidates] = useState([
    number,
    comapreNumber,
  ])

  const { countyName, townName, constituencyName, villageName } = mapObject
  const { electionType } = election
  const locations = [
    countyName,
    townName,
    constituencyName,
    villageName,
  ].filter((name) => !!name)
  if (!locations.length) locations.push('全國')

  useEffect(() => {
    const comapreNumber =
      numbers?.length > 1
        ? numbers.filter((n) => n.key !== number.key)[0]
        : null

    setCompareCandidates([number, comapreNumber])
  }, [number, numbers])

  if (number) {
    return (
      <Wrapper>
        <StyledElectionSelect
          electionType={electionType}
          electionNamePairs={electionNamePairs}
          onElectionChange={onElectionChange}
        />
        {compare ? (
          <>
            <StyledReferendumSelect
              selectedNumber={compareCandidates[0]}
              numbers={numbers}
              onNumberChange={(number) => {
                setCompareCandidates(([, cand2]) => {
                  console.log(number)
                  if (number === cand2) {
                    return [
                      number,
                      numbers.filter((n) => n.key !== number.key)[0],
                    ]
                  } else {
                    return [number, cand2]
                  }
                })
              }}
            />
            <StyledReferendumSelect
              selectedNumber={compareCandidates[1]}
              numbers={numbers}
              onNumberChange={(number) => {
                console.log(number)
                setCompareCandidates(([cand1]) => {
                  if (number === cand1) {
                    return [
                      numbers.filter((n) => n.key !== number.key)[0],
                      number,
                    ]
                  } else {
                    return [cand1, number]
                  }
                })
              }}
            />
          </>
        ) : (
          <StyledReferendumSelect selectedNumber={number} numbers={numbers} />
        )}
        {comapreNumber && (
          <ActionButton
            onClick={() => {
              setCompare((compare) => !compare)
            }}
            compare={compare}
          >
            {compare ? '取消' : '比較'}
          </ActionButton>
        )}
        {compare && (
          <ActionButton
            onClick={() => {
              console.log('submit compareCandidates', compareCandidates)
            }}
          >
            確定
          </ActionButton>
        )}
        <GoDownWrapper>
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
          electionNamePairs={electionNamePairs}
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
        <div id="infobox" />
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
        <StyledYearSelect yearInfo={yearInfo} />
      </Wrapper>
    )
  }
}
