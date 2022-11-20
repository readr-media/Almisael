import { useRef, useState } from 'react'
import styled from 'styled-components'
import useClickOutside from '../hook/useClickOutside'
import { electionNamePairs } from './helper/election'

const SelectWrapper = styled.div`
  position: relative;
  width: 254px;
`

const SelectButton = styled.button`
  width: 254px;
  height: 40px;
  border: 1px solid #000;
  background-color: #fff;
  padding: 0 10px 0 21px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SelectOptions = styled.ul`
  position: absolute;
  top: 45px;
  z-index: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  display: ${({ showOptions }) => (showOptions ? 'block' : 'none')};
  border: 1px solid #000;
  background-color: #fff;
  width: 254px;
`

const SelectOption = styled.li`
  margin: 0;
  padding: 0 0 0 21px;
  list-style: none;
  line-height: 36px;
  color: ${({ selected }) => (selected ? '#000' : '#a5a5a5')};
  cursor: pointer;
  &:hover {
    color: #000;
  }
`

const downTriangleSvg = (
  <svg
    width="18"
    height="15"
    viewBox="0 0 18 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 15L0.339746 -1.63133e-06L17.6603 -1.17124e-07L9 15Z"
      fill="black"
    />
  </svg>
)

export const ElectionSelect = ({
  className,
  electionType,
  onElectionChange,
}) => {
  const [showOptions, setShowOptions] = useState(false)
  const selectRef = useRef(null)
  useClickOutside(selectRef, () => {
    setShowOptions(false)
  })
  return (
    <SelectWrapper ref={selectRef} className={className}>
      <SelectButton
        onClick={() => {
          setShowOptions((value) => !value)
        }}
      >
        {
          electionNamePairs.find(
            (electionNamePair) => electionNamePair.electionType === electionType
          )?.electionName
        }
        {downTriangleSvg}
      </SelectButton>
      <SelectOptions showOptions={showOptions}>
        {electionNamePairs.map((electionNamePair) => (
          <SelectOption
            key={electionNamePair.electionType}
            selected={electionNamePair.electionType === electionType}
            onClick={() => {
              onElectionChange(electionNamePair.electionType)
              setShowOptions(false)
            }}
          >
            {electionNamePair.electionName}
          </SelectOption>
        ))}
      </SelectOptions>
    </SelectWrapper>
  )
}
