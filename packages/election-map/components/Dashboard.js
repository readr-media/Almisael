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
    subTypeInfo,
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
        />
        <InfoboxPanel data={infoboxData} subType={subTypeInfo?.subType} />
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
        {(evcData?.districts?.length || evcData?.propositions?.length) && (
          <ElectionVoteComparisonPanel data={evcData} />
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
      <MoreHint>往下滑看最新選情</MoreHint>
    </Wrapper>
  )
}
