import styled from 'styled-components'

const Button = styled.button`
  display: block;
  margin: 20px 0 0;
  border: 1px solid #000;
  background-color: #686868;
  color: #fff1db;
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

export const MapCompareButton = ({ compareMode, onCompareModeChange }) => {
  return (
    <Button onClick={onCompareModeChange}>
      {compareMode ? 'cancel' : 'compare'}
    </Button>
  )
}
