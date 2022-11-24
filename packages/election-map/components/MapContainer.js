import { useState } from 'react'
import styled from 'styled-components'
import { useElementDimension } from '../hook/useElementDimension'
import useWindowDimensions from '../hook/useWindowDimensions'
import { Map } from './Map'
import { MapTooltip } from './MapTooltip'

// margin-left: 368px;
// width: ${({ compareMode }) =>
//   compareMode ? 'calc(100vw - 368px)' : 'calc(100vw - 368px - 340px)'};

const Wrapper = styled.div`
  width: 100vw;
  top: 0;
  height: 100vh;
  position: fixed;

  @media (min-width: 1025px) {
    ${({ dashboardInView }) => !dashboardInView && `display: none;`}
  }

  @media (max-width: 1024px) {
    position: absolute;
    ${({ compareMode }) =>
      compareMode &&
      `
        svg:first-of-type {
          border-bottom: 1px solid #000;
        } 
    `}
  }
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
  dashboardInView,
  mapColor,
}) => {
  const [tooltip, setTooltip] = useState(defaultTooltip)
  const { elementRef, dimension } = useElementDimension()
  const { width } = useWindowDimensions()

  if (!mapData) {
    return <div></div>
  }

  if (compareMode && mapColor) {
    const splitDimension =
      width > 1024
        ? {
            width: dimension.width / 2,
            height: dimension.height,
          }
        : {
            width: dimension.width,
            height: dimension.height / 2 - 20,
          }
    return (
      <Wrapper
        ref={elementRef}
        compareMode={compareMode}
        dashboardInView={dashboardInView}
      >
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
              mapColor={mapColor}
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
              mapColor={mapColor}
            />
          </>
        )}
        <MapTooltip tooltip={tooltip} />
      </Wrapper>
    )
  } else {
    return (
      <Wrapper ref={elementRef} dashboardInView={dashboardInView}>
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
            mapColor={mapColor}
          />
        )}
        <MapTooltip tooltip={tooltip} />
      </Wrapper>
    )
  }
}
