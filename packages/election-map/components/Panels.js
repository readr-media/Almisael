import styled from 'styled-components'
import { ControlPanel } from './ControlPanel'
import ElectionVoteComparisonPanel from './ElectionVoteComparisonPanel'
import { countyMappingData } from './helper/election'
import { InfoboxPanel } from './InfoboxPanel'
import { SeatsPanel } from './SeatsPanel'

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

const StyledInfoboxPanel = styled(InfoboxPanel)`
  ${({ goDown, compare }) => {
    if (goDown) {
      return `
        position: absolute;
        bottom: ${compare ? '42px' : '234px'};
        left: 48px;
      `
    } else {
      return `
      ${compare && 'margin-top: 40px;'}
      `
    }
  }}
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
      />
      <StyledInfoboxPanel
        goDown={!!numberInfo.number}
        data={infoboxData}
        subtype={subtypeInfo?.subtype}
        compareInfo={compareInfo}
        election={election}
        number={numberInfo?.number}
        year={yearInfo?.year}
      />
      {compareMode && (
        <StyledInfoboxPanel
          goDown={!!compareInfo.filter?.number}
          compare={!!compareInfoboxData}
          data={compareInfoboxData}
          subtype={compareInfo.filter?.subtype}
          compareInfo={compareInfo}
          election={election}
          number={compareInfo.filter?.number}
          year={compareInfo.filter?.year}
        />
      )}
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
