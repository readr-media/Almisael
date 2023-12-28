import { useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { electionMapColor } from '../consts/colors'
import { CollapsibleWrapper } from './collapsible/CollapsibleWrapper'
import taiwanMap from '../public/images/taiwan_map.png'
import taiwanMapMobile from '../public/images/taiwan_map_m.png'
import Image from 'next/image'
import { imageLoader } from '../loader'
import { og } from '../consts/config'
import gtag from '../utils/gtag'
import { useAppSelector } from '../hook/useRedux'

const GlobalStyle = createGlobalStyle`
  body {
    overflow: hidden;
    position: fixed;
    width: 100vw;
  }
`

const Wrapper = styled.div`
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: ${electionMapColor};
`

const InfoWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;

  @media (max-width: 1024px) {
    width: 320px;
    margin: 0 auto;
    left: 0;
    right: 0;
    bottom: 28px;
    top: unset;
  }
  @media (min-width: 1025px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 0;
    bottom: 0;
    margin: auto 0;
    height: 558px;
  }
`

const IntroWrapper = styled(CollapsibleWrapper)`
  width: 100%;
  border-radius: 0 0 16px 16px;
`

const Intro = styled.div`
  text-align: center;

  @media (max-width: 1024px) {
    padding: 8px 15px 16px;
    background-color: white;
    h1 {
      margin: unset;
      font-size: 24px;
      line-height: 34.75px;
      font-weight: 700;
    }
    p {
      margin: 23px 0 0;
      line-height: 23.17px;
    }
  }
  @media (min-width: 1025px) {
    width: 70vw;
    h1 {
      font-size: 64px;
      font-weight: 700;
      margin: unset;
    }
    p {
      font-size: 20px;
      margin-top: 20px;
    }
  }
`

const ActionButton = styled.button`
  margin: 36px 0 12px;
  width: 320px;
  height: 45px;
  background-color: #ff4f4f;
  color: ${electionMapColor};
  border-radius: 8px;
  border: 1px solid #000000;
  font-size: 18px;
  font-weight: 700;
  &:hover {
    background-color: rgba(255, 79, 79, 0.6);
  }
  @media (min-width: 1025px) {
    height: 45px;
    margin-top: 75px;
  }
`

const TeamWrapper = styled(CollapsibleWrapper)`
  width: 320px;
  .collapseBtn {
    height: 25px;
  }
  border-radius: 0 0 16px 16px;
`

const Team = styled.div`
  padding: 9px 0 0;
  margin: 0 auto;
  font-size: 14px;
  line-height: 20px;
  background-color: white;
`

const TeamMember = styled.p`
  margin: unset;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`

const Note = styled.div`
  padding: 12px 45px 13px;
  background-color: white;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #7d7d7d;
`

const StyledImage = styled(Image)`
  position: absolute;
  left: 0;
  top: 10.5%;
  bottom: 3%;
  width: 100%;
  height: 86.5%;

  object-fit: contain;
  @media (max-width: 1024px) {
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    object-fit: cover;
    z-index: -1;
  }
`

const teamMembers = [
  '監製：簡信昌',
  '製作人：李又如、王薏晴',
  '工程：李文瀚、傅典洋、張容瑄、劉鴻明、',
  '李又如、李法賢、蘇庭葳', // 工程名稱太長，強制換行
  '設計：曾立宇、吳曼努',
  '社群：徐湘芸',
]

export const LandingPage = () => {
  const [show, setShow] = useState(false)
  const device = useAppSelector((state) => state.ui.device)
  const isMobile = device !== 'desktop'
  const imgSrc = isMobile ? taiwanMapMobile : taiwanMap

  useEffect(() => {
    setShow(true)
  }, [])

  /** @type {React.MouseEventHandler} */
  const onEnterClickedHandler = () => {
    setShow(false)
    gtag.sendGAEvent('Click', {
      project: `landing page enter / ${device}`,
    })
  }

  if (!show) return <></>

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <InfoWrapper>
          {!isMobile ? (
            <Intro>
              <h1>
                2024 總統、立委選舉
                <br />
                開票即時資訊
              </h1>
              <p>{og.descriptioin}</p>
            </Intro>
          ) : (
            <IntroWrapper preventCollapse={true}>
              <Intro>
                <h1>
                  2024 總統、立委選舉
                  <br />
                  開票即時資訊
                </h1>
                <p>{og.descriptioin}</p>
              </Intro>
            </IntroWrapper>
          )}
          <ActionButton onClick={onEnterClickedHandler}>
            看最新選情
          </ActionButton>
          <TeamWrapper centerTitle={'製作團隊'}>
            <Team>
              {teamMembers.map((teamMember) => (
                <TeamMember key={teamMember}>{teamMember}</TeamMember>
              ))}
            </Team>
            <Note>
              資料來源為中華民國中央選舉委員會， 開票結果以中選會公告為準。
            </Note>
          </TeamWrapper>
        </InfoWrapper>
        <StyledImage src={imgSrc} loader={imageLoader} alt="line logo" />
      </Wrapper>
    </>
  )
}
