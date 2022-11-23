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
          點選地圖，會出現對應行政區的相關投票資訊（由於中選會資料提供的限制，當屆選舉開票時無法顯示村里層級的票數，待開票完成才可查詢。）
        </InformationHint>
        <ElectionHint>
          照片好嗎動畫有或是要開面寫，大不，定圖神是中國啥上有難受要很字出來，真是到底工作⋯這有想他即使心。
        </ElectionHint>
        <CompareHint>
          可選取年份看不同年份的選舉結果。也可選取多個年份（最多 2
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
