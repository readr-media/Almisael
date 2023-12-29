import { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'

import { electionMapColor } from '../consts/colors'
import lb from '@readr-media/react-live-blog'
import { environment } from '../consts/config'
import gtag from '../utils/gtag'
import { useAppSelector } from '../hook/useRedux'

const LiveBlog = lb.ReactComponent.LiveBlog
const LiveBlogWrapper = styled.div`
  position: relative;
  background-color: ${electionMapColor};
`

export const LiveblogContainer = () => {
  const device = useAppSelector((state) => state.ui.device)
  const [initialLiveblog, setInitialLiveblog] = useState(false)

  const handleLiveblogEvent = (event) => {
    const { eventTarget, eventValue, metadata } = event
    switch (eventTarget) {
      case '由新至舊按鈕':
        gtag.sendGAEvent('Click', {
          project: `liveblog item ${eventValue} / ${device}`,
        })
        break
      case 'tag 按鈕':
        gtag.sendGAEvent('Click', {
          project: `liveblog item: tag - ${eventValue} / ${device}`,
        })
        break
      case 'lightbox按鈕':
        gtag.sendGAEvent('Click', {
          project: `liveblog item: ${eventValue}: ${metadata.article.title} / ${device}`,
        })
        break
      case '繼續閱讀按鈕':
        gtag.sendGAEvent('Click', {
          project: `liveblog item ${eventValue}: ${metadata.article.title} / ${device}`,
        })
        break
      case '複製按鈕':
        gtag.sendGAEvent('Click', {
          project: `liveblog item ${eventValue}: ${metadata.article.title} / ${device}`,
        })
        break
      case '外連按鈕':
        gtag.sendGAEvent('Click', {
          project: `liveblog item ${eventTarget}: ${metadata.article.title} / ${device}`,
        })
        break
      default:
        break
    }
  }
  const liveblogUrl =
    environment === 'dev'
      ? 'https://editools-gcs.readr.tw/files/liveblogs/election2024-test.json'
      : 'https://editools-gcs.readr.tw/files/liveblogs/election2024.json'
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
