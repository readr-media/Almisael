import { useMapData } from '../hook/useMapData'
import { MapControl } from './MapControl'

export const MapContainer = ({ compareMode, mapObject, setMapObject }) => {
  const mapData = useMapData()

  if (!mapData) {
    return <p>Loading...</p>
  }

  return (
    <>
      <MapControl
        mapData={mapData}
        compareMode={compareMode}
        mapObject={mapObject}
        setMapObject={setMapObject}
      />
    </>
  )
}
