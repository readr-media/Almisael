import { useState, useRef } from 'react'

import { electionActions } from '../../store/election-slice'
import { useAppDispatch } from '../../hook/useRedux'
import { useAppSelector } from '../../hook/useRedux'
import useClickOutside from '../../hook/useClickOutside'
import styled from 'styled-components'
import { mapActions } from '../../store/map-slice'
import gtag from '../../utils/gtag'

const WIDTH = '100px'
const Wrapper = styled.div`
  position: relative;
  text-align: left;
  height: 26.09px;
  width: ${WIDTH};
  font-size: 14px;
  line-height: 20.27px;
  font-weight: 500;
`

const Options = styled.ul`
  z-index: 1;
  background-color: #3a3a3a;
  position: absolute;
  color: #fff;
  border-radius: 0px 0px 8px 8px;
  top: 0px;
  padding: 14px 0 0 0;
  margin: 14px 0 0 0;
  border-top: none;
  width: 100%;
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
  height: 100%;
  z-index: ${
    /**
     * @param {Object} props
     * @param {boolean} props.shouldDisable
     * @param {boolean} props.isOptionsOpen
     */
    ({ isOptionsOpen }) => (isOptionsOpen ? '2' : '1')
  };
  border-radius: 8px;
  border: 1px solid;
  cursor: ${({ shouldDisable }) => (shouldDisable ? 'not-allowed' : 'pointer')};
  background-color: ${({ shouldDisable }) =>
    shouldDisable ? '#747474' : '#000'};
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
 * @param {string} [props.className]
 * @param {Object[]} props.options
 * @param {'electionType' | 'electionSubType'} props.selectorType
 */
export default function ElectionSelector({
  className,
  options = [],
  selectorType,
}) {
  const electionType = useAppSelector(
    (state) => state.election.config.electionType
  )
  const electionName = useAppSelector(
    (state) => state.election.config.electionName
  )

  const compareMode = useAppSelector(
    (state) => state.election.compare.info.compareMode
  )
  const currentSubType = useAppSelector(
    (state) => state.election.control.subtype
  )
  const device = useAppSelector((state) => state.ui.device)
  const currentSelectedOptionName =
    selectorType === 'electionSubType'
      ? options.find((options) => options.key === currentSubType?.key)?.name
      : options.find((options) => options.electionType === electionType)
          ?.electionName
  const dispatch = useAppDispatch()

  const [shouldShowOptions, setShouldShowOptions] = useState(false)
  const wrapperRef = useRef(null)
  useClickOutside(wrapperRef, () => {
    setShouldShowOptions(false)
  })
  const handleSelectedButtonOnClick = () => {
    setShouldShowOptions((pre) => !pre)
  }
  const handleOptionOnSelected = (option) => {
    if (selectorType === 'electionType') {
      if (option.electionType !== electionType) {
        dispatch(electionActions.changeElection(option.electionType))
        // only PC should reset the map and panels
        if (device === 'desktop') {
          dispatch(mapActions.resetMapFeature())
          dispatch(mapActions.resetUiDistrictNames())
        }
        gtag.sendGAEvent('Click', {
          project: `選舉類別一：${option.electionName} / ${device}`,
        })
      }
    } else if (selectorType === 'electionSubType') {
      if (currentSubType.key !== option.key) {
        dispatch(electionActions.changeSubtype(option))
        // only PC legislator should reset the map and panels
        if (device === 'desktop' && electionType === 'legislator') {
          dispatch(mapActions.resetMapFeature())
          dispatch(mapActions.resetUiDistrictNames())
        }
        gtag.sendGAEvent('Click', {
          project: `選舉類別二：${electionName} - ${option.name} / ${device}`,
        })
      }
    }

    setShouldShowOptions(false)
  }

  return (
    <Wrapper ref={wrapperRef} className={className}>
      <SelectedButton
        isOptionsOpen={shouldShowOptions}
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
  )
}
