import { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'

import { electionMapColor } from '../consts/colors'
import lb from '@readr-media/react-live-blog'

const LiveBlog = lb.ReactComponent.LiveBlog
const LiveBlogWrapper = styled.div`
  position: relative;
  background-color: ${electionMapColor};
`

export const LiveblogContainer = () => {
  const [initialLiveblog, setInitialLiveblog] = useState(false)

  useEffect(() => {
    const fetchLiveblog = async () => {
      const { data } = await axios.get(
        'https://editools-gcs.readr.tw/files/liveblogs/election2022.json'
      )
      setInitialLiveblog(data)
    }
    fetchLiveblog()
  }, [])

  return (
    <LiveBlogWrapper>
      {initialLiveblog && (
        <LiveBlog
          initialLiveblog={initialLiveblog}
          fetchLiveblogUrl="https://editools-gcs.readr.tw/files/liveblogs/election2022.json"
          fetchImageBaseUrl="https://editools-gcs.readr.tw"
          toLoadPeriodically={true}
        />
      )}
    </LiveBlogWrapper>
  )
}
