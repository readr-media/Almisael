import { useCallback, useEffect, useRef, useState } from 'react'
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

const Wrapper = styled.div`
  position: relative;
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
  width: 100vw;
  height: 100vh;
  z-index: 1;
`

export const Dashboard = () => {
  const [showTutorial, setShowTutorial] = useState(false)
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

  useEffect(() => {
    if (!localStorage.finishTutorial) {
      setShowTutorial(true)
    }
  }, [])

  const {
    electionNamePairs,
    onElectionChange,
    election,
    mapData,
    infoboxData,
    evcData,
    seatData,
    mapObject,
    setMapObject,
    mapGeoJsons,
    year,
    onTutorialEnd,
  } = useElectionData(showLoading, showTutorial)

  return (
    <Wrapper>
      {loading && <SpinningModal />}
      <PanelsWrapper>
        <ControlPanel
          electionNamePairs={electionNamePairs}
          onElectionChange={onElectionChange}
          mapObject={mapObject}
          election={election}
        />
        <InfoboxPanel data={infoboxData} />
        <SeatsPanel
          meta={{
            ...election.meta.seat,
            year,
            location: election.meta.seat?.mapping[mapObject.countyId],
          }}
          data={seatData}
        />
        <MapCompareButton
          compareMode={compareMode}
          onCompareModeChange={() => {
            setCompareMode((v) => !v)
          }}
        />
        <ElectionVoteComparisonPanel data={evcData} />
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
    </Wrapper>
  )
}
