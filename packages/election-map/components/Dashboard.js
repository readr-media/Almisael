import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { ControlPanel } from './ControlPanel'
import { MapContainer } from './MapContainer'
import { InfoboxPanel } from './InfoboxPanel'
import { SeatsPanel } from './SeatsPanel'
import { MapCompareButton } from './MapCompareButton'
import { useElectionData } from '../hook/useElectinData'
import { SpinningModal } from './SpinningModal'
import ElectionVoteComparisonPanel from './ElectionVoteComparisonPanel'

const Wrapper = styled.div`
  position: relative;
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
  const [compareMode, setCompareMode] = useState(false)
  const [loading, setLoading] = useState(false)

  const showLoading = useCallback((show) => {
    if (show) {
      setLoading(true)
    } else {
      setTimeout(() => {
        setLoading(false)
      }, 200)
    }
  }, [])

  const {
    electionNamePairs,
    onElectionChange,
    election,
    mapData,
    infoboxData,
    evcData,
    mapObject,
    setMapObject,
  } = useElectionData(showLoading)

  return (
    <Wrapper>
      {loading && <SpinningModal />}
      <PanelsWrapper>
        <ControlPanel
          electionNamePairs={electionNamePairs}
          onElectionChange={onElectionChange}
          mapObject={mapObject}
        />
        <InfoboxPanel data={infoboxData} />
        <SeatsPanel seats={election.seats} />
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
      />
    </Wrapper>
  )
}
