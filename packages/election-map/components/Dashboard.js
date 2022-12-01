import styled from 'styled-components'
import { electionMapColor } from '../consts/colors'
import { MapContainer } from './MapContainer'
import { Panels } from './Panels'
import { Tutorial } from './Tutorial'

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  background-color: ${electionMapColor};
`

const MoreHint = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background-color: #000;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`

export const Dashboard = ({
  onElectionChange,
  mapObject,
  election,
  mapData,
  compareMapData,
  seatData,
  infoboxData,
  compareInfoboxData,
  evcInfo,
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
  dashboardInView,
  hasAnchor,
}) => {
  return (
    <Wrapper>
      <Panels
        onElectionChange={onElectionChange}
        mapObject={mapObject}
        election={election}
        seatData={seatData}
        infoboxData={infoboxData}
        compareInfoboxData={compareInfoboxData}
        evcInfo={evcInfo}
        subtypeInfo={subtypeInfo}
        yearInfo={yearInfo}
        numberInfo={numberInfo}
        compareInfo={compareInfo}
        lastUpdate={lastUpdate}
      />
      <MapContainer
        showLoading={showLoading}
        compareInfo={compareInfo}
        mapObject={mapObject}
        electionData={mapData}
        compareElectionData={compareMapData}
        setMapObject={setMapObject}
        electionType={election.electionType}
        mapData={mapGeoJsons}
        dashboardInView={dashboardInView}
        mapColor={election.meta?.map?.mapColor}
        yearInfo={yearInfo}
        numberInfo={numberInfo}
      />
      {!hasAnchor && showTutorial && (
        <Tutorial
          show={showTutorial}
          mapData={mapGeoJsons}
          onClick={() => {
            setShowTutorial(false)
            onTutorialEnd()
          }}
        />
      )}
      {!showTutorial && <MoreHint>往下滑看最新選情</MoreHint>}
    </Wrapper>
  )
}
