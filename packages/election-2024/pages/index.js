import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'
import { numberWithCommas } from '../utils'
import {
  jsonEndpoint,
  staticFileDestination,
  watchMoreLinkSrc,
  breakpoint,
  color,
  imageName,
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
const CANDIDATES_CONFIG = [
  {
    number: '1',
    president: '柯文哲',
    vicePresident: '吳欣盈',
    candidateImage: 'ko.jpeg',
    partyImage: {
      name: 'TPP',
      size: {
        mobile: {
          width: '8px',
          height: '8px',
        },
        desktop: {
          width: '20px',
          height: '20px',
        },
      },
    },
  },
  {
    number: '2',
    president: '賴清德',
    vicePresident: '蕭美琴',
    candidateImage: 'lai.jpeg',
    partyImage: {
      name: 'DPP',
      size: {
        mobile: {
          width: '12px',
          height: '8px',
        },
        desktop: {
          width: '32px',
          height: '20px',
        },
      },
    },
  },
  {
    number: '3',
    president: '侯友宜',
    vicePresident: '趙少康',
    candidateImage: 'hou.jpeg',
    partyImage: {
      name: 'KMT',
      size: {
        mobile: {
          width: '12px',
          height: '8px',
        },
        desktop: {
          width: '32px',
          height: '20px',
        },
      },
    },
  },
]

const Wrapper = styled.section`
  padding: 12px 10px;
  background-color: ${color.background.normal};

  picture {
    display: flex;
    width: fit-content;
    height: 100%;
    margin: 0 auto;
    object-fit: contain;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 523px;

    img {
      height: auto;
      width: 100%;
    }
    @media (min-width: ${breakpoint}) {
      height: 571.5px;
      img {
        height: 100%;
      }
    }
  }
`
const InfoWrapper = styled.div`
  display: grid;
  padding: 16px 0px;
  grid-template-columns: 0.75fr repeat(3, 1fr);
  grid-template-rows: auto;
`
const Item = styled.div`
  height: auto;
  background-color: ${
    /**
     * @param {Object} props
     * @param {boolean} [props.isVictor]
     */
    ({ isVictor }) =>
      isVictor ? color.background.victor : color.background.normal
  };
`
const CandidateInfoItem = styled(Item)`
  padding-top: 8px;
`
const ResultItem = styled(Item)`
  font-size: 13px;
  line-height: 1.5;
  font-weight: 500;
  text-align: center;
  padding: 8px 0px;
  &.key {
    font-size: 14px;
    line-height: 1.5;
    font-weight: 500;
    text-align: left;
  }
  &.victor {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  color: ${
    /**
     *
     * @param {Object} props
     * @param {string} props.color
     * @param {boolean} props.shouldShowDivider
     * @returns
     */
    ({ color }) => color && color
  };
  border-top: ${({ shouldShowDivider }) =>
    shouldShowDivider ? `1px solid ${color.infoBox.border}` : 'none'};
  @media (min-width: ${breakpoint}) {
    font-size: 16px;
    &.key {
      font-size: 16px;
    }
  }
`
const MockGrayImage = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  margin: 0 auto;
  background-color: #d9d9d9;
  @media (min-width: ${breakpoint}) {
    width: 120px;
    height: 120px;
  }
`
const PartyAndNumber = styled.div`
  width: 40px;
  display: flex;
  margin: 12px auto 8px;
  justify-content: space-between;
  align-items: center;
  @media (min-width: ${breakpoint}) {
    gap: 24px;
    width: fit-content;
    margin: 12px 8px 8px 0;
  }
`
const PartyAndNumberAndPersonWrapper = styled.div`
  @media (min-width: ${breakpoint}) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
  }
`
const PersonWrapper = styled.div``
const Person = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 1.5;
  color: ${color.candidateName};
  text-align: center;
  @media (min-width: ${breakpoint}) {
    font-size: 16px;
  }
`
const Title = styled.h2`
  font-size: 16px;
  line-height: 1.5;
  color: ${color.title};
  font-weight: 700;
  width: 100%;
  margin: 0 auto 12px;
  text-align: center;

  @media (min-width: ${breakpoint}) {
    font-size: 20px;
  }
`
const SubTitle = styled.h3`
  width: 100%;
  font-size: 15px;
  line-height: 1.5;
  font-weight: 400;
  padding: 6.5px 0;
  color: ${color.subTitle.text};
  background-color: ${color.subTitle.background};
  text-align: center;
`
const Caption = styled.div`
  color: ${color.caption};
  font-size: 11px;
  line-height: 1.5;
`
const UpdateTime = styled.div`
  font-size: 11px;
  line-height: 1.5;
  color: ${color.update};
  margin-top: 4px;
`
const Party = styled.div`
  position: relative;
  width: ${
    /**
     * @param {Object} props
     * @param {ImageSize} props.imageSize
     */
    ({ imageSize }) => imageSize && imageSize.mobile.width
  };
  height: ${({ imageSize }) => imageSize && imageSize.mobile.height};
  @media (min-width: ${breakpoint}) {
    width: ${
      /**
       * @param {Object} props
       * @param {ImageSize} props.imageSize
       */
      ({ imageSize }) => imageSize && imageSize.desktop.width
    };
    height: ${({ imageSize }) => imageSize && imageSize.desktop.height};
  }
`
const WatchMore = styled.div`
  width: 100%;
  margin: 24px auto 0;
  a {
    display: block;
    width: fit-content;
    margin: 0 auto;
    color: ${color.watchMore};
    text-align: center;
    text-decoration: underline;
  }
  @media (min-width: 768px) {
    margin: 12px auto 0;
  }
`
export default function Home() {
  const [shouldShowResult, setShouldResult] = useState(false)
  const { data, error, isLoading } = useSWR(jsonEndpoint, fetcher, {
    refreshInterval: 1000 * 60,
    revalidateIfStale: true,
  })
  useEffect(() => {
    console.log(data)
  }, [data])
  useEffect(() => {
    const currentTimeStamp = new Date().getTime()
    const targetTimestamp = new Date('2024-01-13T08:00:00Z').getTime()
    if (currentTimeStamp >= targetTimestamp) {
      setShouldResult(true)
    }
  }, [])
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  const getVictor = (result) => {
    const victorArray = result?.find((item) => item.key === '當選')
    if (
      !victorArray ||
      !victorArray?.value ||
      !Array.isArray(victorArray?.value) ||
      !victorArray?.value?.length
    ) {
      return ''
    }
    const victorResult = victorArray.value.find((item, index) => {
      return item[`${index + 1}`] === '*'
    })
    return Object.keys(victorResult)?.[0]
  }
  const victorNumber = getVictor(data.result)

  return (
    <Wrapper>
      {shouldShowResult ? (
        <>
          <Title>2024 總統及立委大選開票</Title>
          <SubTitle>{data.title}</SubTitle>
          <InfoWrapper>
            <CandidateInfoItem />
            {CANDIDATES_CONFIG.map((candidate) => (
              <CandidateInfoItem
                isVictor={candidate.number === victorNumber}
                key={candidate.number}
              >
                <MockGrayImage>
                  <Image
                    src={`${candidate.candidateImage}`}
                    fill
                    alt={candidate.president}
                    style={{ objectFit: 'cover' }}
                  ></Image>
                </MockGrayImage>
                <PartyAndNumberAndPersonWrapper>
                  <PartyAndNumber>
                    <Party imageSize={candidate.partyImage.size}>
                      <Image
                        src={`${staticFileDestination}/${candidate.partyImage.name}.svg`}
                        fill
                        alt={candidate.partyImage.name}
                      ></Image>
                    </Party>
                    <Image
                      src={`${staticFileDestination}/${candidate.number}.svg`}
                      width={20}
                      height={20}
                      alt={candidate.number}
                    ></Image>
                  </PartyAndNumber>

                  <PersonWrapper>
                    <Person>{candidate.president}</Person>
                    <Person>{candidate.vicePresident}</Person>
                  </PersonWrapper>
                </PartyAndNumberAndPersonWrapper>
              </CandidateInfoItem>
            ))}
            {data.result.map((item, index) => {
              const isOdd = Boolean(index % 2)
              const textColor = isOdd ? color.infoBox.light : color.infoBox.dark
              const shouldShowDivider = index !== 0
              return (
                <>
                  <ResultItem
                    color={textColor}
                    shouldShowDivider={shouldShowDivider}
                    className="key"
                    key={item.key}
                  >
                    {item.key}
                  </ResultItem>

                  {item.value.map((i, index) => {
                    const value = Object.values(i).toString()
                    if (item.key === '當選') {
                      return (
                        <ResultItem
                          key={index}
                          color={textColor}
                          isVictor={`${index + 1}` === victorNumber}
                          shouldShowDivider={shouldShowDivider}
                          className="victor"
                        >
                          {value === '*' ? (
                            <Image
                              src={`${staticFileDestination}/victor.svg`}
                              width={17}
                              height={17}
                              alt="當選"
                            ></Image>
                          ) : null}
                        </ResultItem>
                      )
                    }

                    return (
                      <ResultItem
                        key={index}
                        isVictor={`${index + 1}` === victorNumber}
                        color={textColor}
                        shouldShowDivider={shouldShowDivider}
                      >
                        {numberWithCommas(value)}
                        {item.key === '得票率' ? '%' : null}
                      </ResultItem>
                    )
                  })}
                </>
              )
            })}
          </InfoWrapper>
          <Caption>
            票數說明：1.呈現票數係根據各台已報導票數輸入，與其即時票數略有落差。2.正確結果以中選會為主。
          </Caption>
          <UpdateTime>最後更新時間：{data?.updateAt}</UpdateTime>
          <WatchMore>
            <Link
              href={watchMoreLinkSrc}
              target="_blank"
              rel="noreferrer noopenner"
            >
              查看更多
            </Link>
          </WatchMore>
        </>
      ) : (
        <picture>
          <source
            srcSet={`/banner/${imageName}_m.jpg`}
            media="(max-width: 1199px)"
          />
          <img src={`/banner/${imageName}.jpg`} alt="尚未開票" />
        </picture>
      )}
      <button
        onClick={() => {
          setShouldResult((pre) => !pre)
        }}
      >
        測試切換
      </button>
    </Wrapper>
  )
}
