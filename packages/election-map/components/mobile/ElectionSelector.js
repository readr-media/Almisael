import { useState, useEffect } from 'react'

import { electionActions } from '../../store/election-slice'
import { useAppDispatch } from '../../hook/useRedux'
import { useAppSelector } from '../../hook/useRedux'

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
  &:hover {
    span {
      border-bottom: 1px solid #fff;
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
  z-index: 3;
  border-radius: 8px;
  background-color: #000;
  border: 1px solid;
  cursor: ${
    /**
     *
     * @param {Object} props
     * @param {boolean} props.shouldDisable
     */
    ({ shouldDisable }) => (shouldDisable ? 'not-allowed' : 'pointer')
  };
  span {
    color: #fff;

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
    border-color: #ffffff transparent transparent transparent;
    transform: rotate(0deg);
  }
`
/**
 *
 * @param {Object} props
 * @param {Object[]} props.options
 * @param {'electionType' | 'electionSubType'} props.selectorType
 * @param {function} props.handleOpenSelector
 * @param {string} props.currentOpenSelector
 * @returns
 */
export default function ElectionSelector({
  options = [],
  selectorType,
  handleOpenSelector,
  currentOpenSelector,
}) {
  const electionType = useAppSelector(
    (state) => state.election.config.electionType
  )

  const compareMode = useAppSelector(
    (state) => state.election.compare.info.compareMode
  )
  const currentSubType = useAppSelector(
    (state) => state.election.control.subtype
  )
  const currentSelectedOptionName =
    selectorType === 'electionSubType'
      ? options.find((options) => options.key === currentSubType?.key)?.name
      : options.find((options) => options.electionType === electionType)
          ?.electionName
  const dispatch = useAppDispatch()

  const [shouldShowOptions, setShouldShowOptions] = useState(false)
  const handleSelectedButtonOnClick = () => {
    setShouldShowOptions((pre) => !pre)
    shouldShowOptions
      ? handleOpenSelector(null)
      : handleOpenSelector(selectorType)
  }
  const handleOptionOnSelected = (option) => {
    if (selectorType === 'electionType') {
      dispatch(electionActions.changeElection(option.electionType))
    } else if (selectorType === 'electionSubType') {
      console.log(option)
      dispatch(electionActions.changeSubtype(option))
    }

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
        <SelectedButton
          disabled={compareMode}
          shouldDisable={compareMode}
          onClick={handleSelectedButtonOnClick}
        >
          <span>{currentSelectedOptionName}</span>
          <i className="triangle"></i>
        </SelectedButton>
        {shouldShowOptions && (
          <Options>
            {options.map((option) => (
              <OptionItem
                key={option.electionType || option.key}
                onClick={() => handleOptionOnSelected(option)}
              >
                <span>{option.electionName || option.name}</span>
              </OptionItem>
            ))}
          </Options>
        )}
      </Wrapper>
    </>
  )
}
