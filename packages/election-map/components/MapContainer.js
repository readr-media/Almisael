import { useState } from 'react'
import styled from 'styled-components'
import { useElementDimension } from '../hook/useElementDimension'
import { Map } from './Map'
import { MapTooltip } from './MapTooltip'

const Wrapper = styled.div`
  margin-left: 368px;
  width: calc(100vw - 368px - 340px);
  height: 100vh;
  position: relative;
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
      <Wrapper ref={elementRef}>
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
              electionData={electionData}
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
