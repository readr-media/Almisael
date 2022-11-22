import styled from 'styled-components'
import { electionMapColor } from '../consts/colors'

const MapButtonWrapper = styled.div`
  margin-top: 20px;
  @media (max-width: 1024px) {
    margin: 0;
  }
`

const MapLevelControlButton = styled.button`
  margin-left: 4px;
  border: 1px solid #000;
  background-color: #686868;
  color: ${electionMapColor};
  border-radius: 8px;
  line-height: 23px;
  text-align: center;
  font-weight: 500;
  padding: 3px 15px 4px;

  s &:hover,
  &:active {
    background-color: #000;
  }
  @media (max-width: 1024px) {
    font-size: 14px;
    padding: 3px 8px;
  }
`

export const MapNavigateButton = ({ mapObject }) => {
  return (
    <MapButtonWrapper>
      <MapLevelControlButton
        disabled={mapObject.level === 0}
        onClick={() => {
          const target = document.querySelector(
            `#first-id-${mapObject.upperLevelId}`
          )
          let event = new MouseEvent('click', { bubbles: true })
          target.dispatchEvent(event)
        }}
      >
        回上層
      </MapLevelControlButton>
      <MapLevelControlButton
        disabled={mapObject.level === 0}
        onClick={() => {
          const target = document.querySelector(`#first-id-background`)
          let event = new MouseEvent('click', { bubbles: true })
          target.dispatchEvent(event)
        }}
      >
        回全國
      </MapLevelControlButton>
    </MapButtonWrapper>
  )
}
