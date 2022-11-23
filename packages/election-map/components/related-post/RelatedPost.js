import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Card } from './Card'
import { electionMapColor } from '../../consts/colors'

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

export const RelatedPost = () => {
  const [posts, setPosts] = useState([])
  const [nextShowingIndex, setNextShowingIndex] = useState(12)
  const observer = useRef()

  const displayPosts = posts.slice(0, nextShowingIndex)

  const loadMore = useCallback(() => {
    console.log('loadmore')
    setNextShowingIndex((nextShowingIndex) => nextShowingIndex + 12)
  }, [])

  const lastArticleRef = useCallback(
    (node) => {
      console.log('something happend?', node)
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
      const response = await axios(
        'https://statics.mirrormedia.mg/json/5b7bbdbb34cc3f1000619fa3.json'
      )
      setPosts(response?.data?._items || [])
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
              key={post._id}
              item={post}
              ref={index === displayPosts.length - 1 ? lastArticleRef : null}
              // ref={lastArticleRef}
              value={
                index === displayPosts.length - 1 ? 'lastArticleRef' : null
              }
            />
          ))}
        </Cards>
      </RelatedPostWrapper>
    </Wrapper>
  )
}
