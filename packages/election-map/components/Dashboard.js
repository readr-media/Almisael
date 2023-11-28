import styled from 'styled-components'
import { electionMapColor } from '../consts/colors'
import { MapContainer } from './MapContainer'
import { Panels } from './Panels'
import { Tutorial } from './Tutorial'
import { useGeoJsons } from '../hook/useGeoJsons'
import { useState } from 'react'
import {
  defaultMapUpperLevelId,
  defaultRenderingDistrictNames,
} from '../consts/election-module-pc'

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
  levelControl,
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
  setLevelControl,
  showTutorial,
  setShowTutorial,
  onTutorialEnd,
  dashboardInView,
  hasAnchor,
}) => {
  const geoJsonsData = useGeoJsons()
  const [renderingDistrictNames, setRenderingDistrictNames] = useState(
    defaultRenderingDistrictNames
  )
  const [mapUpperLevelId, setMapUpperLevelId] = useState(defaultMapUpperLevelId)

  return (
    <Wrapper>
      <Panels
        onElectionChange={onElectionChange}
        levelControl={levelControl}
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
        mapUpperLevelId={mapUpperLevelId}
        renderingDistrictNames={renderingDistrictNames}
      />
      <MapContainer
        showLoading={showLoading}
        compareInfo={compareInfo}
        levelControl={levelControl}
        electionData={mapData}
        compareElectionData={compareMapData}
        setLevelControl={setLevelControl}
        electionType={election.electionType}
        geoJsonsData={geoJsonsData}
        dashboardInView={dashboardInView}
        mapColor={election.meta?.map?.mapColor}
        yearInfo={yearInfo}
        numberInfo={numberInfo}
        setMapUpperLevelId={setMapUpperLevelId}
        setRenderingDistrictNames={setRenderingDistrictNames}
      />
      {!hasAnchor && showTutorial && (
        <Tutorial
          show={showTutorial}
          isMapReady={geoJsonsData.hasGeoJsons}
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
