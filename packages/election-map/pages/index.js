import { DashboardContainer } from '../components/DashboardContainer'
import { LandingPage } from '../components/LandingPage'
import { NavBar } from '../components/NavBar'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { RelatedPost } from '../components/related-post/RelatedPost'
import { LiveblogContainer } from '../components/LiveblogContainer'
import { electionMapColor } from '../consts/colors'
import { organization } from '../consts/config'
import { useAppDispatch, useAppSelector } from '../hook/useRedux'
import { electionActions } from '../store/election-slice'
import { mapActions } from '../store/map-slice'
import gtag from '../utils/gtag'

const upTriangle = (
  <svg
    width="14"
    height="12"
    viewBox="0 0 14 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 0L13.9282 12H0.0717969L7 0Z" fill="white" />
  </svg>
)

const NewsWrapper = styled.div`
  position: relative;
  padding: 50px 0;
  background: ${electionMapColor};
`

/**
 * Styled navigation component.
 *
 * @typedef {object} StickyHeaderProps
 * @property {boolean} [dashboardInView] - Indicates whether the dashboard is in view.
 */

const StickyHeader = /** @type {import('styled-components').ThemedStyledFunction<'div', any, StickyHeaderProps>} */ (
  styled.div
)`
  position: fixed;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  top: 0;
  height: 40px;
  background: #000;
  color: #fff;
  z-index: 1;
  font-size: 14px;
  svg {
    margin-left: 6px;
  }
  cursor: pointer;
  text-decoration: underline;
  ${({ dashboardInView }) => dashboardInView && `display: none;`};
  @media (max-width: 1024px) {
    font-size: 16px;
  }
`

export default function Home() {
  const showTutorial = useAppSelector((state) => state.map.ui.showTutorial)
  const device = useAppSelector((state) => state.ui.device)
  const [dashboardInView, setDashboardInView] = useState(true)
  const [hasAnchor, setHasAnchor] = useState(false)
  /** @type {{current: IntersectionObserver} | null} */
  const dashboardObserver = useRef(null)
  /** @type {{current: IntersectionObserver} | null} */
  const endDivObserver = useRef()
  const dispatch = useAppDispatch()

  useEffect(() => {
    // only PC mode (map) has tutorial
    if (!localStorage.finishTutorial && window.innerWidth > 1024) {
      // show tutorial in current year election type with seat map.
      dispatch(mapActions.changeUiShowTutorial(true))
      dispatch(electionActions.changeElection('councilMember'))
      dispatch(mapActions.resetMapFeature())
      dispatch(mapActions.resetUiDistrictNames())
    }
  }, [dispatch])

  useEffect(() => {
    if (organization === 'readr-media' && document.location.hash) {
      setHasAnchor(true)
    }
  }, [])

  /**
   * Callback function for creating an IntersectionObserver for the html element.
   *
   * @callback RefCallback
   * @param {HTMLElement | null} node - The DOM node to observe or null.
   * @returns {void}
   */

  /**
   * A ref callback for the dashboard element.
   *
   * @type {RefCallback}
   */
  const dashboardRef = useCallback(
    (node) => {
      if (dashboardObserver.current) dashboardObserver.current.disconnect()
      dashboardObserver.current = new IntersectionObserver((entries) => {
        const isIntersecting = entries[0].isIntersecting
        setDashboardInView(isIntersecting)
        if (!isIntersecting) {
          if (organization === 'readr-media') {
            gtag.sendGAEvent('Scroll', {
              project: `scroll to liveblog / ${device}`,
            })
          } else if (organization === 'mirror-media') {
            gtag.sendGAEvent('Scroll', {
              project: `scroll to related post / ${device}`,
            })
          }
        }
      })
      if (node) dashboardObserver.current.observe(node)
    },
    [device]
  )

  /**
   * A ref callback for the end div.
   *
   * @type {RefCallback}
   */
  const EndRef = useCallback(
    (node) => {
      if (endDivObserver.current) endDivObserver.current.disconnect()
      endDivObserver.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            gtag.sendGAEvent('Click', {
              project: `scroll to bottom / ${device}`,
            })
          }
        },
        {
          rootMargin: '20px',
          threshold: 0,
        }
      )
      if (node) endDivObserver.current.observe(node)
    },
    [device]
  )

  return (
    <>
      <NavBar dashboardInView={dashboardInView} />
      {!hasAnchor && <LandingPage />}
      <DashboardContainer
        hasAnchor={hasAnchor}
        ref={dashboardRef}
        dashboardInView={dashboardInView}
      />
      {(!showTutorial || hasAnchor) && (
        <NewsWrapper>
          <StickyHeader
            dashboardInView={dashboardInView}
            onClick={() => {
              document.body.scrollTop = 0 // For Safari
              document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
            }}
          >
            回地圖 {upTriangle}
          </StickyHeader>
          {organization === 'readr-media' && <LiveblogContainer />}
          {organization === 'mirror-media' && <RelatedPost />}
        </NewsWrapper>
      )}
      {!dashboardInView && <div ref={EndRef} />}
    </>
  )
}
