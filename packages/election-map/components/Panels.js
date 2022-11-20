import styled from 'styled-components'
import { ControlPanel } from './ControlPanel'
import ElectionVoteComparisonPanel from './ElectionVoteComparisonPanel'
import { countyMappingData } from './helper/election'
import { InfoboxPanel } from './InfoboxPanel'
import { SeatsPanel } from './SeatsPanel'
import { MapNavigateButton } from './MapNavigateButton'
import { MapLocations } from './MapLocations'

const PanelsWrapper = styled.div`
  position: absolute;
  pointer-events: none;
  & > * {
    pointer-events: auto;
  }
  padding-left: 48px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`

const InfoboxPaneWrapper = styled.div`
  width: 320px;
  ${({ goDown }) =>
    goDown &&
    `
    position: absolute;
    bottom: 42px;
    left: 48px;
  `}
`

const StyledInfoboxPanel = styled(InfoboxPanel)`
  ${({ compare }) =>
    compare &&
    `
    margin-top: 40px;
  `}}
`

export const Panels = ({
  onElectionChange,
  mapObject,
  election,
  expandMode,
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
  const { compareMode } = compareInfo
  const { countyName, townName, constituencyName, villageName } = mapObject
  const locations = [
    countyName,
    townName,
    constituencyName,
    villageName,
  ].filter((name) => !!name)
  if (!locations.length) locations.push('全國')

  return (
    <PanelsWrapper>
      <ControlPanel
        onElectionChange={onElectionChange}
        mapObject={mapObject}
        election={election}
        expandMode={expandMode}
        subtypeInfo={subtypeInfo}
        lastUpdate={lastUpdate}
        yearInfo={yearInfo}
        numberInfo={numberInfo}
        compareInfo={compareInfo}
        locations={locations}
      />
      <InfoboxPaneWrapper goDown={!!numberInfo.number}>
        {numberInfo?.number && (
          <>
            <MapNavigateButton mapObject={mapObject} />
            <MapLocations locations={locations} />
          </>
        )}
        <StyledInfoboxPanel
          data={infoboxData}
          subtype={subtypeInfo?.subtype}
          compareInfo={compareInfo}
          election={election}
          number={numberInfo?.number}
          year={yearInfo?.year}
        />
        {compareMode && (
          <StyledInfoboxPanel
            compare={!!compareInfoboxData}
            data={compareInfoboxData}
            subtype={compareInfo.filter?.subtype}
            compareInfo={compareInfo}
            election={election}
            number={compareInfo.filter?.number}
            year={compareInfo.filter?.year}
          />
        )}
      </InfoboxPaneWrapper>
      {!compareMode && (
        <>
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
          {(evcInfo.evcData?.districts?.length ||
            evcInfo.evcData?.propositions?.length) && (
            <ElectionVoteComparisonPanel evcInfo={evcInfo} />
          )}
        </>
      )}
    </PanelsWrapper>
  )
}
