import { useEffect } from 'react'
import styled from 'styled-components'

const DarkLayer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: calc(100vh - 227px);
  background-color: #555;
  mix-blend-mode: multiply;
`

const HintLayer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: calc(100vh - 227px);
`

const Hint = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  width: 34%;
  height: 26%;
  bottom: 26%;
  max-width: 126px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  &::before {
    content: '';
    display: block;
    position: absolute;
    top: calc(100% + 16px);
    left: 50%;
    height: 54%;
    width: 1px;
    background-color: white;
  }
`

const InformationHint = styled(Hint)`
  right: 18px;
`

const ElectionHint = styled(Hint)`
  left: 16px;
`

const CompareHint = styled(Hint)`
  bottom: unset;
  top: 18.4%;
  height: 18.4%;
  right: 19px;
  flex-direction: column;
  &::before {
    top: unset;
    bottom: calc(100% + 13px);
    left: 66%;
    height: 42%;
  }
`

const TouchLayer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`

export const MobileTutorial = ({ mapData, onClick, show }) => {
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

  return (
    <>
      <DarkLayer />
      <HintLayer>
        <InformationHint>
          查看縣市議員資料時，點擊「得票分布」會出現該選區候選人投票資訊，點擊「席次分佈」會出現該縣市席次表。
        </InformationHint>
        <ElectionHint>點選「看其他選舉」按鈕，切換不同選舉類型。</ElectionHint>
        <CompareHint>
          點選左側「年份」按鈕，切換各年度選舉資料。
          <br />
          點選右側「比較」按鈕，可選取多個年份（最多 2
          個），點選「比較」鍵同時呈現 2 次選舉結果作為對照。
        </CompareHint>
      </HintLayer>
      <TouchLayer
        onClick={() => {
          localStorage.finishTutorial = true
          onClick()
        }}
      />
    </>
  )
}
