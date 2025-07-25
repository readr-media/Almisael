import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import Image from 'next/image'
import { useRouter } from 'next/router'
import gtag from '../utils/gtag'

import {
  cecJsonEndpoint,
  breakpoint,
  color,
  staticFileDestination,
  mnewsJsonEndpoint,
} from '../config/index.mjs'

/**
 * @typedef {Object} HeightAndWidth
 * @property {string} width
 * @property {string} height
 */

/**
 * @typedef {Object}ImageSize
 * @property {HeightAndWidth} mobile
 * @property {HeightAndWidth} desktop
 *
 */

const fetcher = (url) => {
  const timestamp = new Date().getTime()
  return fetch(`${url}?t=${timestamp}`).then((res) => {
    const result = res.json()
    result.then((r) => console.log(r?.updateAt))
    return result
  })
}

const Wrapper = styled.section`
  position: relative;
  padding: 0 4px;
  @media (min-width: ${breakpoint.sm}) {
    padding: 0 12px;
  }
`
const ArrowContainer = styled.div`
  display: flex;
  column-gap: 12px;
  justify-content: center;
  margin: 16px 0;
  cursor: pointer;
`

const VoteCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  min-height: 138px;
  @media (min-width: ${breakpoint.sm}) {
    grid-template-columns: repeat(6, 1fr);
  }
`

const VoteCard = styled.div`
  position: relative;
  border-top: 1px solid #979797;
  padding: 4px 6px;

  &:nth-child(1),
  &:nth-child(2),
  &:nth-child(3) {
    border-top: 0;
  }

  &:not(:nth-child(3n)):not(:last-child)::after {
    content: '';
    position: absolute;
    top: 4px;
    bottom: 4px;
    right: 0;
    width: 1px;
    background-color: #979797;
  }

  @media (min-width: ${breakpoint.sm}) {
    &:not(:nth-child(6n)):not(:last-child)::after {
      content: '';
      position: absolute;
      top: 4px;
      bottom: 4px;
      right: 0;
      width: 1px;
      background-color: #979797;
    }

    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6) {
      border-top: 0;
    }
  }
`

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

const Name = styled.p`
  color: #000;
  font-weight: 500;
  font-size: 15px;
  line-height: 1;
`

const Result = styled.p`
  color: ${
    /**
     * @param {Object} props
     * @param {boolean} [props.isPassed]
     */
    ({ isPassed }) => (isPassed ? '#448DE3' : '#D74A47')
  };
  font-weight: 500;
  font-size: 15px;
  line-height: 1;
`

const AgreeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: 4px;
  margin-bottom: 4px;
`

const DisAgreeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: 4px;
`

const Option = styled.p`
  color: #000;
  font-weight: 400;
  font-size: 13px;
  line-height: 1;
`
const BarContainer = styled.div`
  position: relative;
  width: 52px;
  height: 16px;
  background-color: #e3e3e3;
  @media (min-width: ${breakpoint.md}) {
    width: 88px;
  }
`
const VoteBar = styled.div`
  width: ${({ percent }) => `${percent || 0}%`};
  height: 100%;
  background-color: ${({ isAgree }) => (isAgree ? '#448DE3' : '#D74A47')};
`
const VoteCount = styled.p`
  position: absolute;
  left: 4px;
  color: #fff;
  font-size: 12px;
  line-height: 13px;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3), 0px 1px 4px rgba(0, 0, 0, 0.5);
`
const QuarterLine = styled.div`
  position: absolute;
  width: 1px;
  height: 100%;
  border-left: 1px dashed #000;
  left: ${({ percent }) => `${percent}%`};
  z-index: 10;
`

const Notice = styled.p`
  color: #153047;
  font-weight: 500;
  font-size: 12px;
  line-height: 1;
  @media (min-width: ${breakpoint.sm}) {
    font-size: 12px;
  }
`

const MaskLeft = styled.div`
  background-color: transparent;
  width: 50%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  cursor: pointer;
`

const MaskRight = styled.div`
  background-color: transparent;
  width: 50%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  cursor: pointer;
`

const passStatus = {
  Yes: 'Y',
  No: 'N',
}

const passStatusLabel = {
  [passStatus.Yes]: '通過',
  [passStatus.No]: '未通過',
}

const sourceMap = {
  mnews: '鏡新聞',
  cec: '中央選舉委員會',
}

export default function Home() {
  const router = useRouter()
  const source = router.query?.source

  const endpoint = source === 'mirror' ? mnewsJsonEndpoint : cecJsonEndpoint

  const { data, error, isLoading } = useSWR(endpoint, fetcher, {
    refreshInterval: 1000 * 60,
    revalidateIfStale: true,
  })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  useEffect(() => {
    const updatePageSize = () => {
      if (window.innerWidth < Number(breakpoint.sm.replace('px', ''))) {
        setPageSize(6)
      } else {
        setPageSize(12)
      }
    }

    updatePageSize()
    window.addEventListener('resize', updatePageSize)

    return () => window.removeEventListener('resize', updatePageSize)
  }, [])

  if (error) return <div>failed to load</div>
  if (isLoading) return <></>

  const current = data.result.slice((page - 1) * pageSize, page * pageSize)

  return (
    <Wrapper>
      <VoteCardContainer>
        {current.map((item) => (
          <VoteCard key={item.name}>
            <InfoWrapper>
              <Name>{item.name}</Name>
              <Result isPassed={item.adptVictor === passStatus['Yes']}>
                {passStatusLabel[item.adptVictor]}
              </Result>
            </InfoWrapper>
            <AgreeContainer>
              <Option>同意</Option>
              <BarContainer>
                <QuarterLine
                  percent={(item.votePop / 4 / item.votePop) * 100}
                />
                <VoteBar isAgree={true} percent={item.ytpRate}>
                  <VoteCount>{item.agreeTks}</VoteCount>
                </VoteBar>
              </BarContainer>
            </AgreeContainer>
            <DisAgreeContainer>
              <Option>不同意</Option>
              <BarContainer>
                <VoteBar isAgree={false} percent={item.ntpRate}>
                  <VoteCount>{item.disagreeTks}</VoteCount>
                </VoteBar>
              </BarContainer>
            </DisAgreeContainer>
          </VoteCard>
        ))}
      </VoteCardContainer>
      <ArrowContainer>
        <Image
          src={`${staticFileDestination}/${color.vectorLeft}.svg`}
          width={32}
          height={32}
          alt="arrow-left"
          onClick={() => {
            if (page > 1) {
              setPage(page - 1)

              gtag.sendGAEvent('click_pagination', {
                direction: 'left',
                pagination_page: page - 1,
              })
            }
          }}
        />
        <Image
          src={`${staticFileDestination}/${color.vectorRight}.svg`}
          width={32}
          height={32}
          alt="arrow-right"
          onClick={() => {
            if (page * pageSize < data?.result.length) {
              setPage(page + 1)

              gtag.sendGAEvent('click_pagination', {
                direction: 'right',
                pagination_page: page + 1,
              })
            }
          }}
        />
      </ArrowContainer>
      <Notice>
        {`最後更新時間：${data.updatedAt}
        票數說明：1.呈現票數係根據各台已報導票數輸入，與其即時票數略有落差。2.正確結果以中選會為主。資料來源：${
          sourceMap[data?.source] || '中央選舉委員會'
        }`}
      </Notice>
      <MaskLeft
        onClick={() => {
          if (page > 1) {
            setPage(page - 1)

            gtag.sendGAEvent('click_pagination', {
              direction: 'left',
              pagination_page: page - 1,
            })
          }
        }}
      />
      <MaskRight
        onClick={() => {
          if (page * pageSize < data?.result.length) {
            setPage(page + 1)

            gtag.sendGAEvent('click_pagination', {
              direction: 'right',
              pagination_page: page + 1,
            })
          }
        }}
      />
    </Wrapper>
  )
}
