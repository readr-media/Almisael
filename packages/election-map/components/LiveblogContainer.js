import { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import ReactGA from 'react-ga'

import { electionMapColor } from '../consts/colors'
import lb from '@readr-media/react-live-blog'
import { environment } from '../consts/config'

const LiveBlog = lb.ReactComponent.LiveBlog
const LiveBlogWrapper = styled.div`
  position: relative;
  background-color: ${electionMapColor};
`

export const LiveblogContainer = () => {
  const [initialLiveblog, setInitialLiveblog] = useState(false)

  const handleLiveblogEvent = (event) => {
    const { eventName, eventTarget, eventValue, metadata } = event
    if (eventTarget === '繼續閱讀按鈕') {
      ReactGA.event({
        category: 'Projects',
        action: eventName,
        label: `liveblog item ${eventValue} ${metadata.article.title}`,
      })
    } else if (eventTarget === 'tag 按鈕') {
      ReactGA.event({
        category: 'Projects',
        action: eventName,
        label: `tag： ${eventValue}`,
      })
    } else if (eventTarget === '外連按鈕') {
      ReactGA.event({
        category: 'Projects',
        action: eventName,
        label: `liveblog item ${eventTarget} ${metadata.article.title}`,
      })
    }
  }
  const liveblogUrl =
    environment === 'dev'
      ? 'https://editools-gcs.readr.tw/files/liveblogs/election2022-test.json'
      : 'https://editools-gcs.readr.tw/files/liveblogs/election2022.json'
  useEffect(() => {
    const fetchLiveblog = async () => {
      const { data } = await axios.get(liveblogUrl)
      setInitialLiveblog(data)
    }
    fetchLiveblog()
  }, [liveblogUrl])

  return (
    <LiveBlogWrapper>
      {initialLiveblog && (
        <LiveBlog
          initialLiveblog={initialLiveblog}
          fetchLiveblogUrl={liveblogUrl}
          fetchImageBaseUrl="https://editools-gcs.readr.tw"
          toLoadPeriodically={true}
          onChange={handleLiveblogEvent}
        />
      )}
    </LiveBlogWrapper>
  )
}
