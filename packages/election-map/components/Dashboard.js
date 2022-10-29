import { useState } from 'react'
import styled from 'styled-components'
import { ControlPanel } from './ControlPanel'
import { MapContainer } from './MapContainer'
import { InfoboxPanel } from './InfoboxPanel'
import { SeatsPanel } from './SeatsPanel'
import { MapCompareButton } from './MapCompareButton'

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

// const defaultLevel = 0
// const defaultElection = elections.mayor
// const year = defaultElection.years[0]
// const mappingData = defaultElection.levels[defaultLevel]

export const Dashboard = () => {
  const [compareMode, setCompareMode] = useState(false)

  const elections = [
    { type: 'president' },
    { type: 'mayor' },
    {
      type: 'legislator',
      seats: { title: '立法委員席次圖' },
    },
    {
      type: 'councilman',
      seats: { title: '縣市議員席次圖' },
    },
  ]
  // const election = elections[Math.floor(Math.random() * elections.length)]
  const election = elections[3]

  return (
    <Wrapper>
      <PanelsWrapper>
        <ControlPanel />
        <InfoboxPanel type={election.type} />
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
