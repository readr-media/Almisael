import styled from 'styled-components'
import { MapContainer } from './MapContainer'
import { MobilePanels } from './MobilePanels'
import { MobileTutorial } from './MobileTutorial'

const Wrapper = styled.div``

export const MobileDashboard = ({
  onElectionChange,
  mapObject,
  election,
  mapData,
  compareMapData,
  seatData,
  infoboxData,
  compareInfoboxData,
  subtypeInfo,
  yearInfo,
  numberInfo,
  compareInfo,
  lastUpdate,
  showLoading,
  setMapObject,
  mapGeoJsons,
  showTutorial,
  setShowTutorial,
  onTutorialEnd,
  hasAnchor,
}) => {
  return (
    <Wrapper>
      <MapContainer
        showLoading={showLoading}
        compareInfo={compareInfo}
        mapObject={mapObject}
        electionData={mapData}
        compareElectionData={compareMapData}
        setMapObject={setMapObject}
        electionType={election.electionType}
        mapData={mapGeoJsons}
        mapColor={election.meta?.map?.mapColor}
        yearInfo={yearInfo}
        numberInfo={numberInfo}
      />
      <MobilePanels
        seatData={seatData}
        infoboxData={infoboxData}
        compareInfoboxData={compareInfoboxData}
        election={election}
        yearInfo={yearInfo}
        mapObject={mapObject}
        subtypeInfo={subtypeInfo}
        compareInfo={compareInfo}
        numberInfo={numberInfo}
        lastUpdate={lastUpdate}
        showTutorial={showTutorial}
        onElectionChange={onElectionChange}
      />
      {!hasAnchor && showTutorial && (
        <MobileTutorial
          show={showTutorial}
          mapData={mapGeoJsons}
          onClick={() => {
            setShowTutorial(false)
            onTutorialEnd()
          }}
        />
      )}
    </Wrapper>
  )
}
