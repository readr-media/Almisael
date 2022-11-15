import { useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    overflow: hidden;
    position: fixed;
    width: 100vw;
  }
`

const DarkLayer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #555;
  mix-blend-mode: multiply;
`

const HintLayer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
`

const Hint = styled.div`
  position: absolute;
  width: 170px;
  height: 125px;
  color: #fff;
  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 61px;
    left: -125px;
    height: 1px;
    width: 100px;
    background-color: white;
  }
`

const InfoboxHint = styled(Hint)`
  top: 275px;
  left: 475px;
`

const SeatHint = styled(Hint)`
  top: 575px;
  left: 475px;
`

const EvcHint = styled(Hint)`
  top: 100px;
  right: 430px;
  &::before {
    left: unset;
    right: -125px;
  }
`

const CompareHint = styled(Hint)`
  top: 820px;
  left: 800px;
`

const TouchLayer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`

export const Tutorial = ({ mapData, onClick }) => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!localStorage.finishTutorial) {
      setShow(true)
    }
  }, [])
  useEffect(() => {
    if (show && mapData) {
      setTimeout(() => {
        const target = document.querySelector(`#first-id-63000`)
        if (target) {
          let event = new MouseEvent('click', { bubbles: true })
          target.dispatchEvent(event)
        }
      }, 300)
    }
  }, [mapData, show])

  if (!show) return <></>

  return (
    <>
      <GlobalStyle />
      <DarkLayer></DarkLayer>
      <HintLayer>
        <InfoboxHint>
          照片好嗎動畫有或是要開面寫，大不，定圖神是中國啥上有難受要很字出來，真是到底工作⋯這有想他即使心。
        </InfoboxHint>
        <SeatHint>
          照片好嗎動畫有或是要開面寫，大不，定圖神是中國啥上有難受要很字出來，真是到底工作⋯這有想他即使心。
        </SeatHint>
        <EvcHint>
          照片好嗎動畫有或是要開面寫，大不，定圖神是中國啥上有難受要很字出來，真是到底工作⋯這有想他即使心。
        </EvcHint>
        <CompareHint>
          照片好嗎動畫有或是要開面寫，大不，定圖神是中國啥上有難受要很字出來，真是到底工作⋯這有想他即使心。
        </CompareHint>
      </HintLayer>
      <TouchLayer
        onClick={() => {
          localStorage.finishTutorial = true
          setShow(false)
          onClick()
        }}
      />
    </>
  )
}
