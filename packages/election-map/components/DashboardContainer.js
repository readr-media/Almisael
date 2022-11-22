import { useCallback, useRef, useState } from 'react'
import { useElectionData } from '../hook/useElectinData'
import { SpinningModal } from './SpinningModal'
import useWindowDimensions from '../hook/useWindowDimensions'
import { MobileDashboard } from './MobileDashboard'
import { Dashboard } from './Dashboard'

export const DashboardContainer = ({ showTutorial, setShowTutorial }) => {
  const [loading, setLoading] = useState(false)
  const loadingTimout = useRef(null)
  const { width } = useWindowDimensions() || []
  const isMobile = width <= 1024

  const showLoading = useCallback((show) => {
    if (show) {
      clearTimeout(loadingTimout.current)
      loadingTimout.current = setTimeout(() => {
        setLoading(true)
      }, 100)
    } else {
      clearTimeout(loadingTimout.current)
      setTimeout(() => {
        setLoading(false)
      }, 300)
    }
  }, [])

  const {
    onElectionChange,
    election,
    mapData,
    compareMapData,
    infoboxData,
    compareInfoboxData,
    evcInfo,
    seatData,
    mapObject,
    setMapObject,
    mapGeoJsons,
    onTutorialEnd,
    yearInfo,
    subtypeInfo,
    numberInfo,
    lastUpdate,
    compareInfo,
  } = useElectionData(showLoading, showTutorial)

  if (!isMobile) {
    return (
      <>
        {loading && <SpinningModal />}
        <Dashboard
          onElectionChange={onElectionChange}
          mapObject={mapObject}
          election={election}
          mapData={mapData}
          compareMapData={compareMapData}
          seatData={seatData}
          infoboxData={infoboxData}
          compareInfoboxData={compareInfoboxData}
          evcInfo={evcInfo}
          subtypeInfo={subtypeInfo}
          yearInfo={yearInfo}
          numberInfo={numberInfo}
          compareInfo={compareInfo}
          lastUpdate={lastUpdate}
          showLoading={showLoading}
          setMapObject={setMapObject}
          mapGeoJsons={mapGeoJsons}
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
          onTutorialEnd={onTutorialEnd}
        />
      </>
    )
  } else {
    return (
      <>
        {loading && <SpinningModal />}
        <MobileDashboard
          onElectionChange={onElectionChange}
          mapObject={mapObject}
          election={election}
          mapData={mapData}
          compareMapData={compareMapData}
          seatData={seatData}
          infoboxData={infoboxData}
          compareInfoboxData={compareInfoboxData}
          subtypeInfo={subtypeInfo}
          yearInfo={yearInfo}
          numberInfo={numberInfo}
          compareInfo={compareInfo}
          lastUpdate={lastUpdate}
          showLoading={showLoading}
          setMapObject={setMapObject}
          mapGeoJsons={mapGeoJsons}
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
          onTutorialEnd={onTutorialEnd}
        />
      </>
    )
  }
}