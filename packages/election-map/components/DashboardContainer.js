import { forwardRef, useCallback, useRef, useState } from 'react'
import { useElectionData } from '../hook/useElectinData'
import { SpinningModal } from './SpinningModal'
import useWindowDimensions from '../hook/useWindowDimensions'
// import { MobileDashboard } from './MobileDashboard'
import { MobileDashboardNew } from './mobile/MobileDashboardNew'
import { Dashboard } from './Dashboard'

export const DashboardContainer = forwardRef(function DashboardContainer(
  { showTutorial, hasAnchor, setShowTutorial, dashboardInView },
  ref
) {
  const [loading, setLoading] = useState(false)
  const loadingTimout = useRef(null)
  const { width } = useWindowDimensions()
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

  const { onEvcSelected, onTutorialEnd } = useElectionData(
    showLoading,
    showTutorial
  )

  if (!isMobile) {
    return (
      <div ref={ref}>
        {loading && <SpinningModal />}
        <Dashboard
          onEvcSelected={onEvcSelected}
          showLoading={showLoading}
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
          onTutorialEnd={onTutorialEnd}
          dashboardInView={dashboardInView}
          hasAnchor={hasAnchor}
        />
      </div>
    )
  } else {
    return (
      <div ref={ref}>
        {loading && <SpinningModal />}
        <MobileDashboardNew />
      </div>
    )
  }
})
