import { useState } from 'react'
import styled from 'styled-components'
import { useElementDimension } from '../hook/useElementDimension'
import { Map } from './Map'
import { MapTooltip } from './MapTooltip'

// margin-left: 368px;
// width: ${({ compareMode }) =>
//   compareMode ? 'calc(100vw - 368px)' : 'calc(100vw - 368px - 340px)'};

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  ${({ compareMode }) =>
    compareMode &&
    `
    width: calc(100vw - 368px);
    margin-left: 368px;
  `};
`

const defaultTooltip = {
  show: false,
  text: '',
  coordinate: [],
}

export const MapContainer = ({
  mapData,
  compareMode,
  mapObject,
  setMapObject,
  electionData,
  compareElectionData,
  electionType,
}) => {
  const [tooltip, setTooltip] = useState(defaultTooltip)
  const { elementRef, dimension } = useElementDimension()

  if (!mapData) {
    return <div></div>
  }

  if (compareMode) {
    const splitDimension = {
      width: dimension.width / 2,
      height: dimension.height,
    }

    return (
      <Wrapper ref={elementRef} compareMode={compareMode}>
        {dimension && (
          <>
            <Map
              dimension={splitDimension}
              mapData={mapData}
              id="first"
              mapObject={mapObject}
              setMapObject={setMapObject}
              setTooltip={setTooltip}
              electionData={electionData}
              electionType={electionType}
            />
            <Map
              dimension={splitDimension}
              mapData={mapData}
              id="second"
              mapObject={mapObject}
              setMapObject={setMapObject}
              setTooltip={setTooltip}
              electionData={compareElectionData}
              electionType={electionType}
            />
          </>
        )}
        <MapTooltip tooltip={tooltip} />
      </Wrapper>
    )
  } else {
    return (
      <Wrapper ref={elementRef}>
        {dimension && (
          <Map
            dimension={dimension}
            mapData={mapData}
            id="first"
            mapObject={mapObject}
            setMapObject={setMapObject}
            setTooltip={setTooltip}
            electionData={electionData}
            electionType={electionType}
          />
        )}
        <MapTooltip tooltip={tooltip} />
      </Wrapper>
    )
  }
}
