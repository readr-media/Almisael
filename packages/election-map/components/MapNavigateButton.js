import styled from 'styled-components'
import { electionMapColor } from '../consts/colors'

const MapButtonWrapper = styled.div`
  margin-top: 20px;
`
const MapLevelBackButton = styled.button`
  border: 1px solid #000;
  background-color: #686868;
  color: ${electionMapColor};
  border-radius: 8px;
  line-height: 23px;
  text-align: center;
  width: 80px;
  height: 32px;

  &:hover,
  &:active {
    background-color: #000;
  }
`

const MapLevelResetButton = styled.button`
  margin-left: 4px;
  border: 1px solid #000;
  background-color: #686868;
  color: ${electionMapColor};
  border-radius: 8px;
  line-height: 23px;
  text-align: center;
  width: 80px;
  height: 32px;

  &:hover,
  &:active {
    background-color: #000;
  }
`
export const MapNavigateButton = ({ mapObject }) => {
  return (
    <MapButtonWrapper>
      <MapLevelBackButton
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
      </MapLevelBackButton>
      <MapLevelResetButton
        disabled={mapObject.level === 0}
        onClick={() => {
          const target = document.querySelector(`#first-id-background`)
          let event = new MouseEvent('click', { bubbles: true })
          target.dispatchEvent(event)
        }}
      >
        回全國
      </MapLevelResetButton>
    </MapButtonWrapper>
  )
}
