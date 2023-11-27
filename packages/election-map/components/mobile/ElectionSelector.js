import { useState, useEffect } from 'react'

import styled from 'styled-components'

const WIDTH = '100px'
const Wrapper = styled.div`
  position: relative;
  text-align: left;
  height: 30px;
  width: ${WIDTH};
  font-size: 14px;
  line-height: 20.27px;
  font-weight: 500;
  margin-top: 80px;
`

const Options = styled.ul`
  z-index: 2;
  background-color: #3a3a3a;
  position: absolute;
  color: #fff;
  border-radius: 0px 0px 8px 8px;
  top: 0px;
  padding: 14px 0 0 0;
  margin: 14px 0 0 0;
  border-top: none;
  width: ${WIDTH};
  list-style-type: none;
  border: 1px solid black;
`
const OptionItem = styled.li`
  list-style: none;
  text-align: left;

  width: 100%;
  padding: 4px 10px;
  max-height: 28.4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  /* &:hover {
    color: black;
  } */
`
const SelectedButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  padding: 4px 10px;
  width: 100%;
  z-index: 3;
  border-radius: 8px;
  background-color: #000;
  border: 1px solid;
  cursor: pointer;
  span {
    color: #fff;

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
    border-color: #ffffff transparent transparent transparent;
    transform: rotate(0deg);
  }
`
export default function ElectionSelector({
  options = [],
  currentElection,
  setCurrentElection,
  selectorType = '',
  handleOpenSelector,
  currentOpenSelector,
  placeholderValue,
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
    setCurrentElection(option)
    setShouldShowOptions(false)
    handleOpenSelector(null)
  }

  useEffect(() => {
    if (currentOpenSelector !== selectorType) {
      setShouldShowOptions(false)
    }
  }, [currentOpenSelector, selectorType])

  return (
    <>
      <Wrapper>
        <SelectedButton onClick={handleSelectedButtonOnClick}>
          <span>{currentElection?.electionName || currentElection?.name}</span>
          <i className="triangle"></i>
        </SelectedButton>
        {shouldShowOptions && hasOptions && (
          <Options>
            {options.map((option) => (
              <OptionItem
                key={option.electionType || option.key}
                onClick={() => handleOptionOnSelected(option)}
              >
                {option.electionName || option.name}
              </OptionItem>
            ))}
          </Options>
        )}
      </Wrapper>
    </>
  )
}
