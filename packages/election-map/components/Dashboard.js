import { useState } from 'react'
import styled from 'styled-components'
import { ControlPanel } from './ControlPanel'
import { MapContainer } from './MapContainer'
import { InfoboxPanel } from './InfoboxPanel'
import { SeatsPanel } from './SeatsPanel'
import { MapCompareButton } from './MapCompareButton'
import { useElectionData } from '../hook/useElectinData'

const Wrapper = styled.div`
  position: relative;
`

const PanelsWrapper = styled.div`
  position: absolute;
  pointer-events: none;
  & > * {
    pointer-events: auto;
  }
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
`

export const Dashboard = () => {
  const [compareMode, setCompareMode] = useState(false)
  const { electionNamePairs, onElectionChange, election, infoboxData } =
    useElectionData()

  return (
    <Wrapper>
      <PanelsWrapper>
        <ControlPanel
          electionNamePairs={electionNamePairs}
          onElectionChange={onElectionChange}
        />
        <InfoboxPanel type={election.electionType} data={infoboxData} />
        <SeatsPanel seats={election.seats} />
        <MapCompareButton
          compareMode={compareMode}
          onCompareModeChange={() => {
            setCompareMode((v) => !v)
          }}
        />
      </PanelsWrapper>
      <MapContainer compareMode={compareMode} />
    </Wrapper>
  )
}
