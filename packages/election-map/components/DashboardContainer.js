import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { useElectionData } from '../hook/useElectinData'
import { SpinningModal } from './SpinningModal'
import useWindowDimensions from '../hook/useWindowDimensions'
// import { MobileDashboard } from './MobileDashboard'
import { MobileDashboardNew } from './mobile/MobileDashboardNew'
import { Dashboard } from './Dashboard'
import { useAppDispatch } from '../hook/useRedux'
import { uiActions } from '../store/ui-slice'

export const DashboardContainer = forwardRef(function DashboardContainer(
  { hasAnchor, dashboardInView },
  ref
) {
  const [loading, setLoading] = useState(false)
  const loadingTimout = useRef(null)
  const { width } = useWindowDimensions()
  const isMobile = width <= 1024
  const dispatch = useAppDispatch()

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

  const { onEvcSelected } = useElectionData(showLoading)

  useEffect(() => {
    if (width > 1024) {
      dispatch(uiActions.changeUiDevice('desktop'))
    } else {
      dispatch(uiActions.changeUiDevice('mobile'))
    }
  }, [dispatch, width])

  if (!isMobile) {
    return (
      <div ref={ref}>
        {loading && <SpinningModal />}
        <Dashboard
          onEvcSelected={onEvcSelected}
          showLoading={showLoading}
          dashboardInView={dashboardInView}
          hasAnchor={hasAnchor}
        />
      </div>
    )
  } else {
    return (
      <div ref={ref}>
        {loading && <SpinningModal />}
        <MobileDashboardNew onEvcSelected={onEvcSelected} />
      </div>
    )
  }
})
