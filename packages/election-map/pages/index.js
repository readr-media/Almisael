import { Dashboard } from '../components/Dashboard'
import { LandingPage } from '../components/LandingPage'
import { NavBar } from '../components/NavBar'
import lb from '@readr-media/react-live-blog'
import { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { electionMapColor } from '../consts/colors'

const LiveBlog = lb.ReactComponent.LiveBlog
const LiveBlogWrapper = styled.div`
  position: relative;
  background-color: ${electionMapColor};
  z-index: 1;
`

export default function Home() {
  const [initialLiveblog, setInitialLiveblog] = useState(false)

  useEffect(() => {
    const fetchLiveblog = async () => {
      const { data } = await axios.get(
        'https://editools-gcs-dev.readr.tw/files/liveblogs/ukraine-war.json'
      )
      console.log('liveblog', data)
      setInitialLiveblog(data)
    }
    fetchLiveblog()
  }, [])
  return (
    <>
      <NavBar />
      <LandingPage />
      <Dashboard />
      <LiveBlogWrapper>
        {initialLiveblog && (
          <LiveBlog
            initialLiveblog={initialLiveblog}
            fetchLiveblogUrl="https://editools-gcs-dev.readr.tw/files/liveblogs/ukraine-war.json"
            fetchImageBaseUrl="https://editools-gcs-dev.readr.tw"
            toLoadPeriodically={true}
          />
        )}
      </LiveBlogWrapper>
    </>
  )
}
