import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Card } from './Card'
import { electionMapColor } from '../../consts/colors'
import gtag from '../../utils/gtag'
import { useAppSelector } from '../../hook/useRedux'

/**
 * @typedef {import('./Card').Post} Post
 */

const Wrapper = styled.div`
  position: relative;
  padding: 48px 0 100px;
  background-color: ${electionMapColor};
`

const RelatedPostWrapper = styled.div`
  margin: 0 auto;
  width: 288px;
  @media (min-width: 644px) {
    width: 592px;
  }
  @media (min-width: 768px) {
    width: 714px;
  }
  @media (min-width: 1200px) {
    width: 1008px;
  }
`

const RelatedPostTitle = styled.div`
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  line-height: 41px;
`

const Cards = styled.div`
  margin-top: 48px;
  display: grid;
  row-gap: 20px;
  grid-template-columns: 1fr;
  @media (min-width: 644px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 25px;
  }
  @media (min-width: 768px) {
    gap: 26px 26px;
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 26px 16px;
  }
`
/** @type {Array<Post>} */
const defaultPosts = []

export const RelatedPost = () => {
  const [posts, setPosts] = useState(defaultPosts)
  const [nextShowingIndex, setNextShowingIndex] = useState(12)
  const device = useAppSelector((state) => state.ui.device)
  /**
   * @type {React.MutableRefObject<IntersectionObserver | null>}
   */
  const observer = useRef(null)

  const displayPosts = posts.slice(0, nextShowingIndex)

  const loadMore = useCallback(() => {
    setNextShowingIndex((nextShowingIndex) => nextShowingIndex + 12)
  }, [])

  const lastArticleRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && posts.length >= nextShowingIndex) {
            loadMore()
          }
        },
        {
          rootMargin: '20px',
          threshold: 0,
        }
      )
      if (node) observer.current.observe(node)
    },
    [loadMore, nextShowingIndex, posts.length]
  )

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios(
          'https://v3-statics.mirrormedia.mg/files/json/2024election_relatedposts.json'
        )
        setPosts(response?.data?.posts || [])
      } catch (error) {
        console.error('Fetch mirrormedia related posts failed')
      }
    }
    fetchResult()
  }, [])

  return (
    <Wrapper>
      <RelatedPostWrapper>
        <RelatedPostTitle>最新消息</RelatedPostTitle>
        <Cards>
          {displayPosts.map((post, index) => (
            <Card
              key={post.id}
              item={post}
              ref={index === displayPosts.length - 1 ? lastArticleRef : null}
              onClick={() => {
                gtag.sendGAEvent('Click', {
                  project: `related post: ${post.title} / ${device}`,
                })
              }}
            />
          ))}
        </Cards>
      </RelatedPostWrapper>
    </Wrapper>
  )
}
