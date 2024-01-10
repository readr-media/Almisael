import { useEffect } from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../hook/useRedux'

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
  top: 292px;
  left: 475px;
`

const SeatHint = styled(Hint)`
  top: 588px;
  left: 475px;
`

const EvcHint = styled(Hint)`
  top: 137px;
  right: 430px;
  &::before {
    left: unset;
    right: -111px;
  }
`

const CompareHint = styled(Hint)`
  bottom: 33px;
  left: 604px;
  &::before {
    top: 77px;
  }
`

const TouchLayer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`

export const Tutorial = ({ onClick, show }) => {
  const geoJsons = useAppSelector((state) => state.map.data.geoJsons)
  const isMapReady = !!geoJsons.villages
  useEffect(() => {
    if (show && isMapReady) {
      setTimeout(() => {
        const target = document.querySelector(`#first-id-63000`)
        if (target) {
          let event = new MouseEvent('click', { bubbles: true })
          target.dispatchEvent(event)
        }
      }, 300)
    }
  }, [isMapReady, show])

  return (
    <>
      <DarkLayer />
      <HintLayer>
        <InfoboxHint>
          點選地圖，會出現對應行政區的相關投票資訊（由於中選會資料提供的限制，當屆選舉開票時無法顯示村里層級的票數，待開票完成才可查詢。）
        </InfoboxHint>
        <SeatHint>
          點選地圖，會出現該次選舉政黨席次分佈（僅立法委員、縣市議員有此功能）。滑鼠移至（手機為點選）席次圓點會顯示政黨名稱。
        </SeatHint>
        <EvcHint>
          點選地圖，會出現該次選舉中，該選區的選舉結果。可橫幅移動看更多候選人。
        </EvcHint>
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
