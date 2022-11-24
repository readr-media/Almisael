import { DashboardContainer } from '../components/DashboardContainer'
import { LandingPage } from '../components/LandingPage'
import { NavBar } from '../components/NavBar'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { RelatedPost } from '../components/related-post/RelatedPost'
import { LiveblogContainer } from '../components/LiveblogContainer'
import { electionMapColor } from '../consts/colors'
import { organization } from '../consts/config'
import ReactGA from 'react-ga'

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
const StickyHeader = styled.div`
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
  const [showTutorial, setShowTutorial] = useState(false)
  const [dashboardInView, setDashboardInView] = useState(true)
  const dashboardObserver = useRef()
  const endDivObserver = useRef()

  useEffect(() => {
    if (!localStorage.finishTutorial) {
      setShowTutorial(true)
    }
  }, [])

  const dashboardRef = useCallback((node) => {
    if (dashboardObserver.current) dashboardObserver.current.disconnect()
    dashboardObserver.current = new IntersectionObserver((entries) => {
      const isIntersecting = entries[0].isIntersecting
      setDashboardInView(isIntersecting)
      if (!isIntersecting && organization === 'readr-media') {
        ReactGA.event({
          category: 'Projects',
          action: 'Scroll',
          label: `Scroll To Liveblog`,
        })
      }
    })
    if (node) dashboardObserver.current.observe(node)
  }, [])

  const EndRef = useCallback((node) => {
    if (endDivObserver.current) endDivObserver.current.disconnect()
    endDivObserver.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          ReactGA.event({
            category: 'Projects',
            action: 'Scroll',
            label: `Scroll To Bottom`,
          })
        }
      },
      {
        rootMargin: '20px',
        threshold: 0,
      }
    )
    if (node) endDivObserver.current.observe(node)
  }, [])

  return (
    <>
      <NavBar dashboardInView={dashboardInView} />
      <LandingPage />
      <DashboardContainer
        showTutorial={showTutorial}
        setShowTutorial={setShowTutorial}
        ref={dashboardRef}
        dashboardInView={dashboardInView}
      />
      {!showTutorial && (
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
      {/* <div ref={EndRef} /> */}
    </>
  )
}
