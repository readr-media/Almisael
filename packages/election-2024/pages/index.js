import styled from 'styled-components'
import useSWR from 'swr'
import Image from 'next/image'
import { numberWithCommas } from '../utils'

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

const fetcher = (url) => fetch(url).then((res) => res.json())
const DARK_BLUE = '#153047'
const LIGHT_BLUE = '#004EBC'
const GRAY = '#f5f5f5'
const CANDIDATES_CONFIG = [
  {
    number: '1',
    president: '柯文哲',
    vicePresident: '吳欣盈',
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

const MOCK_DATA = {
  timestamp: '2099/13/32 25:99',
  result: [
    {
      key: '得票數',
      value: [
        {
          1: '9999999',
        },
        {
          2: '9999999',
        },
        {
          3: '9999999',
        },
      ],
    },
    {
      key: '得票數',
      value: [
        {
          1: '9999999',
        },
        {
          2: '9999999',
        },
        {
          3: '9999999',
        },
      ],
    },
    {
      key: '得票數',
      value: [
        {
          1: '9999999',
        },
        {
          2: '9999999',
        },
        {
          3: '9999999',
        },
      ],
    },
    {
      key: '得票率',
      value: [
        {
          1: '99.99',
        },
        {
          2: '99.99',
        },
        {
          3: '99.99',
        },
      ],
    },
    {
      key: '當選',
      value: [
        {
          1: ' ',
        },
        {
          2: '*',
        },
        {
          3: ' ',
        },
      ],
    },
  ],
  title: '這是小標',
}
const Wrapper = styled.section`
  padding: 12px 10px;
  background-color: ${GRAY};
`
const InfoWrapper = styled.div`
  display: grid;
  padding: 16px 0px;
  grid-template-columns: 0.75fr repeat(3, 1fr);
  grid-template-rows: auto;
`
const Item = styled.div`
  height: auto;
`
const CandidateInfoItem = styled(Item)``
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
    shouldShowDivider ? '1px solid #C2C2C2' : 'none'};
  @media (min-width: 1200px) {
    font-size: 16px;
    &.key {
      font-size: 16px;
    }
  }
`
const MockGrayImage = styled.div`
  width: 40px;
  height: 40px;
  margin: 0 auto;
  background-color: #d9d9d9;
  @media (min-width: 1200px) {
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
  @media (min-width: 1200px) {
    gap: 24px;
    width: fit-content;
    margin: 12px 8px 8px 0;
  }
`
const PartyAndNumberAndPersonWrapper = styled.div`
  @media (min-width: 1200px) {
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
  color: ${DARK_BLUE};
  text-align: center;
  @media (min-width: 1200px) {
    font-size: 16px;
  }
`
const Title = styled.h2`
  font-size: 16px;
  line-height: 1.5;
  color: ${DARK_BLUE};
  font-weight: 700;
  width: 100%;
  margin: 0 auto 12px;
  text-align: center;
  background-color: ${GRAY};
  @media (min-width: 1200px) {
    font-size: 20px;
  }
`
const SubTitle = styled.h3`
  width: 100%;
  font-size: 15px;
  line-height: 1.5;
  font-weight: 400;
  padding: 6.5px 0;
  color: #ffcc01;
  background-color: ${DARK_BLUE};
  text-align: center;
`
const Caption = styled.div`
  color: ${DARK_BLUE};
  font-size: 11px;
  line-height: 1.5;
`
const UpdateTime = styled.div`
  font-size: 11px;
  line-height: 1.5;
  color: #9b9b9b;
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
  @media (min-width: 1200px) {
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
const ENDPOINT = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
export default function Home() {
  const { data, error, isLoading } = useSWR(ENDPOINT, fetcher)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return (
    <Wrapper>
      <Title>2024 總統及立委大選開票</Title>
      <SubTitle>{MOCK_DATA.title}</SubTitle>
      <InfoWrapper>
        <CandidateInfoItem />
        {CANDIDATES_CONFIG.map((candidate) => (
          <CandidateInfoItem key={candidate.number}>
            <MockGrayImage></MockGrayImage>
            <PartyAndNumberAndPersonWrapper>
              <PartyAndNumber>
                <Party imageSize={candidate.partyImage.size}>
                  <Image
                    src={`/${candidate.partyImage.name}.svg`}
                    fill
                    alt={candidate.partyImage.name}
                  ></Image>
                </Party>
                <Image
                  src={`/${candidate.number}.svg`}
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
        {MOCK_DATA.result.map((item, index) => {
          const isOdd = Boolean(index % 2)
          const color = isOdd ? LIGHT_BLUE : DARK_BLUE
          const shouldShowDivider = index !== 0
          return (
            <>
              <ResultItem
                color={color}
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
                      color={color}
                      shouldShowDivider={shouldShowDivider}
                      className="victor"
                    >
                      {value === '*' ? (
                        <Image
                          src="/victor.svg"
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
                    color={color}
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
      <UpdateTime>最後更新時間：{MOCK_DATA.timestamp}</UpdateTime>
    </Wrapper>
  )
}
