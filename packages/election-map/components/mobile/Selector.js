import styled from 'styled-components'
import { useState, useRef } from 'react'
import useClickOutside from '../../hook/useClickOutside'
const Wrapper = styled.div`
  position: relative;
  text-align: left;
  height: 30px;
  width: 88px;
  font-size: 14px;
  line-height: 20.27px;
  font-weight: 500;
`

const Options = styled.ul`
  z-index: 1;
  background-color: #f2f2f2;
  position: absolute;
  color: #fff;
  border-radius: 0px 0px 8px 8px;
  top: 0px;
  padding: 14px 0 0 0;
  margin: 14px 0 0 0;
  border-top: none;
  max-height: 50vh;
  overflow-y: scroll;
  width: 88px;
  list-style-type: none;
  border: 1px solid black;
`
const OptionItem = styled.li`
  list-style: none;
  text-align: left;
  color: #000;
  width: 100%;
  padding: 4px 10px;
  max-height: 28.4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  span {
    border-bottom: ${
      /**
       * @param {{isSelected:boolean}} props
       */
      ({ isSelected }) => (isSelected ? '1px solid #000' : 'none')
    };
  }
  &:hover {
    span {
      border-bottom: 1px solid #000;
    }
  }
`
const SelectedButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  padding: 4px 10px;
  width: 100%;
  z-index: ${
    /**
     * @param {Object} props
     * @param {boolean} props.shouldShowOptions
     */
    ({ shouldShowOptions }) => (shouldShowOptions ? '2' : '0')
  };
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid;
  cursor: pointer;
  span {
    color: black;

    max-height: 28.4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .triangle {
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 8px 4px 0 4px;
    border-color: #000000 transparent transparent transparent;
    transform: rotate(0deg);
  }
`
export default function Selector({
  options = [],
  onSelected,
  districtCode,
  placeholderValue = '',
}) {
  const [shouldShowOptions, setShouldShowOptions] = useState(false)
  const wrapperRef = useRef(null)
  useClickOutside(wrapperRef, () => {
    setShouldShowOptions(false)
  })
  const hasOptions = options && Array.isArray(options) && options.length

  const handleSelectedButtonOnClick = () => {
    setShouldShowOptions((pre) => !pre)
  }
  const handleOptionOnSelected = (option) => {
    onSelected(option.type, option.code)
    setShouldShowOptions(false)
  }
  const currentSelectDistrictName = hasOptions
    ? options.find((option) => option.code === districtCode)?.name ??
      placeholderValue
    : null

  return (
    <>
      <Wrapper ref={wrapperRef}>
        <SelectedButton
          shouldShowOptions={shouldShowOptions}
          onClick={handleSelectedButtonOnClick}
        >
          <span>
            {hasOptions ? currentSelectDistrictName : placeholderValue}
          </span>
          <i className="triangle"></i>
        </SelectedButton>
        {shouldShowOptions && hasOptions && (
          <Options>
            {options.map((option, index) => (
              <OptionItem
                isSelected={option.name === currentSelectDistrictName}
                key={index}
                onClick={() => handleOptionOnSelected(option)}
              >
                <span>{option.name}</span>
              </OptionItem>
            ))}
          </Options>
        )}
      </Wrapper>
    </>
  )
}
