import styled from 'styled-components'
import { useState, useEffect } from 'react'
const Wrapper = styled.div`
  position: relative;
  text-align: left;
  height: 30px;
  width: 89px;
  font-size: 14px;
  line-height: 20.27px;
  font-weight: 500;
`

const Options = styled.ul`
  z-index: 0;
  background-color: #fff;
  position: absolute;
  color: #fff;
  border-radius: 0px 0px 8px 8px;
  top: 0px;
  padding: 14px 0 0 0;
  margin: 14px 0 0 0;
  border-top: none;
  width: 89px;
  list-style-type: none;
  border: 1px solid black;
`
const OptionItem = styled.li`
  list-style: none;
  text-align: left;
  color: ${
    /**
     * @param {{isSelected:boolean}} props
     */
    ({ isSelected }) => (isSelected ? 'black' : 'gray')
  };
  width: 100%;
  padding: 4px 10px;
  max-height: 28.4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: black;
  }
`
const SelectedButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  padding: 4px 10px;
  width: 100%;
  z-index: 1;
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

  /* &:after {
      position: absolute;
      content: '';
      top: 14px;
      right: 1em;
      width: 0;
      height: 0;
      color: white;
      border: 5px solid transparent;
      border-color: #fff transparent transparent transparent;
    } */
  /* &.open {
      border: none;
      border-radius: 15px 15px 0px 0px;
    } */

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
  selectorType = '',
  placeholderValue = '',
  handleOpenSelector,
  currentOpenSelector,
}) {
  const [shouldShowOptions, setShouldShowOptions] = useState(false)

  const hasOptions = options && Array.isArray(options) && options.length

  const handleSelectedButtonOnClick = () => {
    setShouldShowOptions((pre) => !pre)
    shouldShowOptions
      ? handleOpenSelector(null)
      : handleOpenSelector(selectorType)
  }
  const handleOptionOnSelected = (option) => {
    onSelected(option.type, option.code)
    setShouldShowOptions(false)
    handleOpenSelector(null)
  }
  const currentSelectDistrictName = hasOptions
    ? options.find((option) => option.code === districtCode)?.name ??
      placeholderValue
    : null
  useEffect(() => {
    if (currentOpenSelector !== selectorType) {
      setShouldShowOptions(false)
    }
  }, [currentOpenSelector, selectorType])
  return (
    <>
      <Wrapper>
        <SelectedButton onClick={handleSelectedButtonOnClick}>
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
                {option.name}
              </OptionItem>
            ))}
          </Options>
        )}
      </Wrapper>
    </>
  )
}
