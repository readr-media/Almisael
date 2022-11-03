import { useMapData } from '../hook/useMapData'
import { MapControl } from './MapControl'

export const MapContainer = ({
  compareMode,
  mapObject,
  setMapObject,
  electionData,
  electionType,
}) => {
  const mapData = useMapData()

  if (!mapData) {
    return <p>Loading...</p>
  }

  return (
    <>
      <MapControl
        mapData={mapData}
        electionData={electionData}
        compareMode={compareMode}
        mapObject={mapObject}
        setMapObject={setMapObject}
        electionType={electionType}
      />
    </>
  )
}
