import styled from 'styled-components'
import { electionMapColor } from '../consts/colors'
import { useAppSelector } from '../hook/useRedux'
import gtag from '../utils/gtag'

const MapButtonWrapper = styled.div`
  margin-top: 16px;
`

const MapLevelControlButton = styled.button`
  border: 1px solid #000;
  background-color: #686868;
  color: ${electionMapColor};
  border-radius: 8px;
  line-height: 23px;
  text-align: center;
  font-weight: 500;
  padding: 3px 15px 4px;
  &:nth-of-type(2) {
    margin-left: 4px;
  }

  s &:hover,
  &:active {
    background-color: #000;
  }
`

export const MapNavigateButton = () => {
  const levelControl = useAppSelector((state) => state.election.control.level)
  const mapUpperLevelId = useAppSelector(
    (state) => state.map.control.mapUpperLevelId
  )

  return (
    <MapButtonWrapper>
      <MapLevelControlButton
        disabled={levelControl.level === 0}
        onClick={() => {
          const target = document.querySelector(`#first-id-${mapUpperLevelId}`)
          let event = new MouseEvent('click', { bubbles: true })
          target.dispatchEvent(event)
          gtag.sendGAEvent('Click', {
            project: '回上層',
          })
        }}
      >
        回上層
      </MapLevelControlButton>
      <MapLevelControlButton
        disabled={levelControl.level === 0}
        onClick={() => {
          const target = document.querySelector(`#first-id-background`)
          let event = new MouseEvent('click', { bubbles: true })
          target.dispatchEvent(event)
          gtag.sendGAEvent('Click', {
            project: '回全國',
          })
        }}
      >
        回全國
      </MapLevelControlButton>
    </MapButtonWrapper>
  )
}
