import { useRef, useState } from 'react'
import styled from 'styled-components'
import useClickOutside from '../hook/useClickOutside'
/**
 * @typedef {import('../consts/electionsConfig').ReferendumNumber} ReferendumNumber
 */
const SelectWrapper = styled.div`
  position: relative;
  width: 254px;
`

const SelectButton = styled.button`
  width: 100%;
  height: 40px;
  border: 1px solid #000;
  background-color: #fff;
  padding: 0 10px 0 21px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SelectDetail = styled.div`
  width: 100%;
  padding: 12px 9px;
  background-color: #b9b9b9;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #000;
  max-height: 105px;
  line-height: 1.5;
  overflow: auto;
`

const SelectOptions = styled.ul`
  position: absolute;
  top: 39px;
  z-index: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  display: ${
    /**
     * @param {Object} props
     * @param {boolean} props.showOptions
     */
    ({ showOptions }) => (showOptions ? 'block' : 'none')
  };
  border: 1px solid #000;
  background-color: #fff;
  width: 254px;
  max-height: 200px;
  overflow: scroll;
`

const SelectOption = styled.li`
  margin: 0;
  padding: 0 0 0 21px;
  list-style: none;
  line-height: 36px;
  color: ${
    /**
     * @param {Object} props
     * @param {boolean} props.selected
     */
    ({ selected }) => (selected ? '#000' : '#a5a5a5')
  };
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
/**
 *
 * @param {Object} props
 * @param {ReferendumNumber} props.selectedNumber
 * @param {ReferendumNumber[]} props.numbers
 * @param {Function} props.onNumberChange
 * @param {string} [props.className]
 */
export const ReferendumSelect = ({
  className,
  selectedNumber,
  numbers,
  onNumberChange,
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
        {`${selectedNumber.year} ${selectedNumber.name}`}
        {downTriangleSvg}
      </SelectButton>
      <SelectDetail>{selectedNumber.detail}</SelectDetail>
      <SelectOptions showOptions={showOptions}>
        {numbers.map((number) => (
          <SelectOption
            key={number.key}
            selected={number.key === selectedNumber.key}
            onClick={() => {
              onNumberChange(number)
              setShowOptions(false)
            }}
          >
            {`${number.year} ${number.name}`}
          </SelectOption>
        ))}
      </SelectOptions>
    </SelectWrapper>
  )
}
