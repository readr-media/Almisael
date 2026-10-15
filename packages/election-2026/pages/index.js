import { useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import Image from 'next/image'
import Select from '../components/Select'

import {
  mayorJsonEndpoint,
  breakpoint,
  staticFileDestination,
} from '../config/index.mjs'

const fetcher = async (url) => {
  const timestamp = new Date().getTime()
  const res = await fetch(`${url}?t=${timestamp}`)
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  return res.json()
}

const Wrapper = styled.section`
  width: 320px;
  padding: 0 16px;
  background-color: #f4f5f6;

  @media (min-width: ${breakpoint.sm}) {
    width: 720px;
    padding: 0 24px;
  }

  @media (min-width: ${breakpoint.md}) {
    width: 970px;
  }
`
const CitySelectorWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 2px solid #d8d8d8;

  @media (min-width: ${breakpoint.md}) {
    display: block;
    padding-top: 8px;
    padding-bottom: 12px;
  }
`
const Title = styled.h1`
  font-size: 18px;
  line-height: 24px;
  font-weight: 500;
  text-align: center;
  color: #1b3f5c;

  @media (min-width: ${breakpoint.md}) {
    padding-top: 16px;
  }
`
const CitySelectorDesktop = styled.div`
  display: none;

  @media (min-width: ${breakpoint.md}) {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 8px;
    gap: 8px;
  }
`
const CitySelectorMobile = styled.div`
  display: block;

  @media (min-width: ${breakpoint.md}) {
    display: none;
  }
`
const City = styled.div`
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  background-color: white;
  color: #4a4a4a;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    border: 1px solid #949494;
    background-color: #f4f5f6;
    color: #2b2b2b;
  }

  ${({ $isActive }) =>
    $isActive &&
    `
    border: 1px solid #2074d5;
    background-color: #2074d5;
    color: white;

    &:hover {
      border: 1px solid #2074d5;
      background-color: #2074d5;
      color: white;
    }
  `}
`
const VoteBarChartWrapper = styled.section`
  height: 214px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 2px solid white;

  @media (min-width: ${breakpoint.sm}) {
    flex-direction: row;
    height: 84px;
    gap: 24px;
  }

  @media (min-width: ${breakpoint.md}) {
    gap: 32px;
  }
`
const VoteBarChart = styled.div`
  width: 288px;

  @media (min-width: ${breakpoint.sm}) {
    width: 208px;
  }

  @media (min-width: ${breakpoint.md}) {
    width: 286px;
  }
`
const VoteBarChartTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  font-weight: 500;
  line-height: 24px;
`
const CandidateInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 8px;
  font-size: 16px;
  color: #4a4a4a;
`
const VoteShare = styled.div`
  font-size: 14px;
  color: #6e6e6e;
`
const VoteBar = styled.div`
  width: 100%;
  height: 24px;
`
const VoteCount = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #2b2b2b;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
`
const SourceAndTimestamp = styled.div`
  padding-top: 8px;
  padding-bottom: 12px;
  font-size: 13px;
  line-height: 18px;
  color: #6e6e6e;
`

const PartyStyleMap = {
  中國國民黨: {
    emblem: `${staticFileDestination}/kmt.svg`,
    color: '#7cb0ee',
  },
  民主進步黨: {
    emblem: `${staticFileDestination}/dpp.svg`,
    color: '#62bc90',
  },
  台灣民眾黨: {
    emblem: `${staticFileDestination}/tpp.svg`,
    color: '#57c2c2',
  },
  無黨籍: {
    emblem: `${staticFileDestination}/independent.svg`,
    color: '#a8b0bb',
  },
}

export default function Home() {
  const { data, error, isLoading } = useSWR(mayorJsonEndpoint, fetcher, {
    refreshInterval: 1000 * 60,
    revalidateIfStale: true,
  })

  const [selectedCity, setSelectedCity] = useState(
    data?.polling?.[0]?.city || '臺北市'
  )
  console.log('isLoading', isLoading)
  console.log('data?.polling?.[0]?.city', data?.polling?.[0]?.city)
  if (error) return <div>Failed to load</div>
  if (isLoading) return null

  const currentCityData = data?.polling?.find(
    (item) => item?.city === selectedCity
  )

  return (
    <Wrapper>
      <CitySelectorWrapper>
        <Title>22縣市長開票進度</Title>
        <CitySelectorDesktop>
          {data?.polling
            ?.filter((item) => Boolean(item?.city))
            .map((item) => (
              <City
                key={item?.city}
                $isActive={selectedCity === item?.city}
                onClick={() => setSelectedCity(item?.city)}
              >
                {item?.city}
              </City>
            ))}
        </CitySelectorDesktop>
        <CitySelectorMobile>
          <Select
            options={data?.polling
              ?.filter((item) => Boolean(item?.city))
              .map((item) => ({
                value: item?.city,
                label: item?.city,
              }))}
            value={selectedCity}
            onValueChange={setSelectedCity}
          />
        </CitySelectorMobile>
      </CitySelectorWrapper>

      <VoteBarChartWrapper>
        {currentCityData?.candidates?.map((candidate) => {
          const partyStyle = PartyStyleMap[candidate?.party]

          return (
            <VoteBarChart key={candidate?.name}>
              <VoteBarChartTop>
                <CandidateInfo>
                  <div>{candidate?.candNo}</div>
                  <div>{candidate?.name}</div>
                  {partyStyle?.emblem && (
                    <Image
                      src={partyStyle?.emblem}
                      width={16}
                      height={16}
                      alt={candidate?.party}
                    />
                  )}
                  {data?.isStarted && candidate?.candVictor && (
                    <Image
                      src={`${staticFileDestination}/elected.svg`}
                      width={16}
                      height={16}
                      alt="當選"
                    />
                  )}
                </CandidateInfo>
                <VoteShare>
                  {data?.isStarted &&
                    candidate?.tksRate &&
                    `${candidate?.tksRate}%`}
                </VoteShare>
              </VoteBarChartTop>
              <VoteBar>
                <VoteCount
                  style={{
                    width:
                      candidate?.absTksRate > 0
                        ? `max(4px, ${candidate?.absTksRate}%)`
                        : '0%',
                    backgroundColor:
                      partyStyle?.color || PartyStyleMap['無黨籍']?.color,
                  }}
                >
                  {data?.isStarted &&
                  typeof candidate?.tks === 'number' &&
                  candidate?.tks !== 0
                    ? candidate?.tks.toLocaleString()
                    : '—'}
                </VoteCount>
              </VoteBar>
            </VoteBarChart>
          )
        })}
      </VoteBarChartWrapper>
      <SourceAndTimestamp>
        {data?.isStarted ? (
          <div>
            最後更新時間：
            {currentCityData?.updatedAt}
          </div>
        ) : (
          <div>開票開始時間：2026-11-28 16:00:00</div>
        )}
        <div>
          資料來源：
          {currentCityData?.source || '中央選舉委員會'}
        </div>
      </SourceAndTimestamp>
    </Wrapper>
  )
}
