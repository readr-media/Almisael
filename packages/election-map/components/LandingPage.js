import { useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { electionMapColor } from '../consts/colors'
import { CollapsibleWrapper } from './collapsible/CollapsibleWrapper'

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
  width: 100vw;
  height: 100vh;
  background-color: ${electionMapColor};
`

const InfoWrapper = styled.div`
  position: absolute;
  top: calc((100vh - 647px) * 0.7);
  left: 100px;
  width: 320px;
`

const IntroWrapper = styled(CollapsibleWrapper)`
  width: 100%;
`

const Intro = styled.div`
  padding: 8px 15px 0;
  background-color: white;
  height: 291px;
  h1 {
    margin: unset;
    font-size: 36px;
    line-height: 52.13px;
    font-weight: 900;
  }
  p {
    margin: 23px 0 0;
    line-height: 23.17px;
  }
`

const ActionButton = styled.button`
  margin: 36px 0 12px;
  width: 100%;
  height: 40px;
  background-color: #ff4f4f;
  color: ${electionMapColor};
  border-radius: 8px;
  border: 1px solid #000000;
  font-size: 18px;
  line-height: 40px;
  font-weight: 700;
`

const TeamWrapper = styled(CollapsibleWrapper)`
  width: 100%;
  .collapseBtn {
    height: 25px;
  }
`

const Team = styled.div`
  padding: 9px 87px 0;
  background-color: white;
`

const TeamMember = styled.p`
  margin: unset;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`

const Note = styled.div`
  padding: 18px 45px 20px;
  background-color: white;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #7d7d7d;
`

const teamMembers = [
  '監製｜簡信昌',
  '製作人｜李又如 王薏晴',
  '工程｜李文瀚 李法賢',
  '記者｜劉怡馨',
  '社群｜徐湘芸',
  '設計｜曾立宇 吳曼努',
]

export const LandingPage = () => {
  const [show, setShow] = useState(false)

  // since the showing logic is binding to whether the tutorial has shown, so we check the localstorage again
  // maybe in the future the condition will not be the same (to show landing page and to show tutorial)
  useEffect(() => {
    if (!localStorage.finishTutorial) {
      setShow(true)
    }
  }, [])

  const onEnterClickedHandler = () => {
    setShow(false)
  }

  if (!show) return <></>

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <InfoWrapper>
          <IntroWrapper preventCollapse={true}>
            <Intro>
              <h1>標題標題標題標題 標題標題標題標題</h1>
              <p>
                照片好嗎動畫有或是要開面寫，大不，定圖神是中國啥上有難受要很字出來，真是到底工作⋯這有想他即使心想什麼啦喜歡他，就這麼。可舒喜歡們都苦欸我感覺也多，月還。
              </p>
            </Intro>
          </IntroWrapper>
          <ActionButton onClick={onEnterClickedHandler}>Enter</ActionButton>
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
      </Wrapper>
    </>
  )
}
