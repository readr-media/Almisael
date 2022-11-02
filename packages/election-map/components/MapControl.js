import { useState } from 'react'
import styled from 'styled-components'
import { useElementDimension } from '../hook/useElementDimension'
import { Map } from './Map'
import { MapTooltip } from './MapTooltip'

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
`

export const defaultMapObject = {
  level: 0,
  currentFeature: null,
  countyId: '',
  countyName: '',
  townId: '',
  townName: '',
  villageId: '',
  villageName: '',
  constituencyId: '',
  constituencyName: '',
  activeId: '',
  upperLevelId: 'background',
}

const defaultTooltip = {
  show: false,
  text: '',
  coordinate: [],
}

export const MapControl = ({
  mapData,
  compareMode,
  mapObject: sharedMapObject,
  setMapObject: setSharedMapObject,
}) => {
  const [_mapObject, _setMapObject] = useState(defaultMapObject)
  const [tooltip, setTooltip] = useState(defaultTooltip)
  const { elementRef, dimension } = useElementDimension()

  // use props' mapData if provided, otherwise use self-managed state (for shared component usage)
  const mapObject = sharedMapObject ? sharedMapObject : _mapObject
  const setMapObject = setSharedMapObject ? setSharedMapObject : _setMapObject

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
            />
            <Map
              dimension={splitDimension}
              mapData={mapData}
              id="second"
              mapObject={mapObject}
              setMapObject={setMapObject}
              setTooltip={setTooltip}
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
          />
        )}
        <MapTooltip tooltip={tooltip} />
      </Wrapper>
    )
  }
}
