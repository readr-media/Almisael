import { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import { ControlPanel } from './ControlPanel'
import { MapContainer } from './MapContainer'
import { InfoboxPanel } from './InfoboxPanel'
import { SeatsPanel } from './SeatsPanel'
import { MapCompareButton } from './MapCompareButton'
import { useElectionData } from '../hook/useElectinData'
import { SpinningModal } from './SpinningModal'
import ElectionVoteComparisonPanel from './ElectionVoteComparisonPanel'
import { electionMapColor } from '../consts/colors'
import { Tutorial } from './Tutorial'
import { countyMappingData } from './helper/electionHelper'

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: ${({ expandMode }) => (expandMode ? `1084px` : `100vh`)};
  background-color: ${electionMapColor};
`

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
  const [compareMode, setCompareMode] = useState(false)
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
    electionNamePairs,
    onElectionChange,
    election,
    mapData,
    infoboxData,
    evcInfo,
    seatData,
    mapObject,
    setMapObject,
    mapGeoJsons,
    yearInfo,
    onTutorialEnd,
    subTypeInfo,
    isRunning,
    lastUpdate,
  } = useElectionData(showLoading, showTutorial)

  const expandMode = !!seatData

  return (
    <Wrapper expandMode={expandMode}>
      {loading && <SpinningModal />}
      <PanelsWrapper>
        <ControlPanel
          electionNamePairs={electionNamePairs}
          onElectionChange={onElectionChange}
          mapObject={mapObject}
          election={election}
          expandMode={expandMode}
          subTypeInfo={subTypeInfo}
          lastUpdate={lastUpdate}
          yearInfo={yearInfo}
        />
        <InfoboxPanel
          data={infoboxData}
          subType={subTypeInfo?.subType}
          isRunning={isRunning}
        />
        <SeatsPanel
          meta={{
            ...election.meta.seat,
            year: yearInfo.year,
            location: countyMappingData.find(
              (countyData) => countyData.countyCode === mapObject.countyId
            )?.countyName,
          }}
          data={seatData}
        />
        <MapCompareButton
          compareMode={compareMode}
          onCompareModeChange={() => {
            setCompareMode((v) => !v)
          }}
        />
        {(evcInfo.evcData?.districts?.length ||
          evcInfo.evcData?.propositions?.length) && (
          <ElectionVoteComparisonPanel evcInfo={evcInfo} />
        )}
      </PanelsWrapper>
      <MapContainer
        showLoading={showLoading}
        compareMode={compareMode}
        mapObject={mapObject}
        electionData={mapData}
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
