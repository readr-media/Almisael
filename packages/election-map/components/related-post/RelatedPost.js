import { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Card } from './Card'
import { electionMapColor } from '../../consts/colors'

const Wrapper = styled.div`
  position: relative;
  background-color: ${electionMapColor};
`

export const RelatedPost = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchResult = async () => {
      const response = await axios(
        'https://www.mirrormedia.mg/json/63521e9d11a2841a005e7470.json'
      )
      setPosts(response?.data?._items || [])
    }
    fetchResult()
  }, [])

  return (
    <Wrapper>
      {posts.map((post) => (
        <Card key={post._id} item={post} />
      ))}
    </Wrapper>
  )
}
