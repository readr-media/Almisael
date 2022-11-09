import { useMapData } from '../hook/useMapData'
import { MapControl } from './MapControl'

export const MapContainer = ({
  compareMode,
  mapObject,
  setMapObject,
  electionData,
  electionType,
  showLoading,
}) => {
  const mapData = useMapData(showLoading)

  if (!mapData) {
    return <div></div>
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
