import { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import { MapContainer } from './MapContainer'
import { useElectionData } from '../hook/useElectinData'
import { SpinningModal } from './SpinningModal'
import { electionMapColor } from '../consts/colors'
import { Tutorial } from './Tutorial'
import { Panels } from './Panels'

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: ${({ expandMode }) => (expandMode ? `1084px` : `100vh`)};
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

export const Dashboard = ({ showTutorial, setShowTutorial }) => {
  const [loading, setLoading] = useState(false)
  const loadingTimout = useRef(null)

  const showLoading = useCallback((show) => {
    if (show) {
      clearTimeout(loadingTimout.current)
      loadingTimout.current = setTimeout(() => {
        setLoading(true)
      }, 100)
    } else {
      clearTimeout(loadingTimout.current)
      setTimeout(() => {
        setLoading(false)
      }, 300)
    }
  }, [])

  const {
    onElectionChange,
    election,
    mapData,
    compareMapData,
    infoboxData,
    compareInfoboxData,
    evcInfo,
    seatData,
    mapObject,
    setMapObject,
    mapGeoJsons,
    onTutorialEnd,
    yearInfo,
    subtypeInfo,
    numberInfo,
    lastUpdate,
    compareInfo,
  } = useElectionData(showLoading, showTutorial)

  const expandMode = !!seatData || compareInfo.compareMode

  return (
    <Wrapper expandMode={expandMode}>
      {loading && <SpinningModal />}
      <Panels
        onElectionChange={onElectionChange}
        mapObject={mapObject}
        election={election}
        expandMode={expandMode}
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
        compareMode={compareInfo.compareMode}
        mapObject={mapObject}
        electionData={mapData}
        compareElectionData={compareMapData}
        setMapObject={setMapObject}
        electionType={election.electionType}
        mapData={mapGeoJsons}
      />
      {showTutorial && (
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
