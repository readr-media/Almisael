import { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { electionActions } from '../store/election-slice'
import { useAppSelector, useAppDispatch } from '../hook/useRedux'
import { mapActions } from '../store/map-slice'
import gtag from '../utils/gtag'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

const SliderWrapper = styled.div`
  width: 307px;
`

const Slider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  background: #b9b9b9;
  border-radius: 5px;
  outline: none;
  ${({ compare }) => compare && `visibility: hidden;`}

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background-color: #ffc7bb;
    cursor: pointer;
    border: 1px solid #000000;
    border-radius: 50%;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background-color: #ffc7bb;
    cursor: pointer;
    border: 1px solid #000;
    border-radius: 50%;
  }
`

const SpotWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 58px;
`

const Spot = styled.span`
  position: relative;
  width: 16px;
  height: 16px;
  background-color: #fff;
  cursor: pointer;
  border: 1px solid #000;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:before {
    display: ${({ selected }) => (selected ? 'block' : 'none')};
    content: '';
    width: 12px;
    height: 12px;
    border: 1px solid #000;
    border-radius: 50%;
    background-color: #ffc7bb;
  }

  &:after {
    content: '${({ content }) => content}';
    display: block;
    position: absolute;
    font-size: 16px;
    font-weight: 700;
    line-height: 35px;
    top: 23px;
  }

  ${({ compare, cand1, cand2 }) => {
    if (compare) {
      return `
        ${
          !cand1 &&
          `
            border: 1px solid #cdcdcd;
            &:after {
              color: #cdcdcd;
            }
            &:hover {
              border: 1px solid #000;
              &:before {
                background-color: #000;
              }
              &:after {
                color: #000;
              }  
            }
          `
        }
        ${
          cand2 &&
          `
            border: 1px solid #000;
            &:before {
              background-color: #000;
            }
            &:after {
              color: #000;
            }
          `
        }
      `
    }
  }}
`

const ButtonWrapper = styled.div`
  margin-left: 47px;
`
const ActionButton = styled.button`
  width: 80px;
  height 32px;
  border-radius: 12px;
  border: 1px solid #000;
  background-color: #ffc7bb;
  font-weight: 500;
  &:disabled {
    background-color: #e0e0e0;
  }
  &:nth-of-type(2) {
    margin-left: 12px;
  }
  ${
    /**
     * @param {Object} props
     * @param {boolean} [props.cancel]
     */
    ({ cancel }) => cancel && 'background-color: #e0e0e0;'
  }
`

/**
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @returns
 */
export const YearSelect = ({ className }) => {
  const compareMode = useAppSelector(
    (state) => state.election.compare.info.compareMode
  )
  const year = useAppSelector((state) => state.election.control.year)
  const years = useAppSelector((state) => state.election.config.years)
  const device = useAppSelector((state) => state.ui.device)
  const electionName = useAppSelector(
    (state) => state.election.config.electionName
  )
  const subtype = useAppSelector((state) => state.election.control.subtype)
  const dispatch = useAppDispatch()
  const [compare, setCompare] = useState(false)
  const [compareCandidates, setCompareCandidates] = useState([
    years.find((y) => y === year),
    null,
  ])
  const compareYear = compareCandidates[1]
  const selectedIndex = years.indexOf(years.find((y) => y === year))

  const submitCompareCandidates = useCallback(() => {
    const [year, compareYear] = compareCandidates
    dispatch(electionActions.changeYear(year))
    dispatch(
      electionActions.startCompare({
        compareYearKey: compareYear.key,
      })
    )
  }, [compareCandidates, dispatch])

  const submitCompareEnd = () => {
    dispatch(electionActions.stopCompare())
    dispatch(mapActions.resetMapFeature())
  }

  useEffect(() => {
    // submit again if compareCandidates changes
    if (compareMode) {
      submitCompareCandidates()
    }
  }, [
    compare,
    // compareCandidates,
    compareMode,
    submitCompareCandidates,
    year,
    years,
  ])

  return (
    <Wrapper className={className}>
      <SliderWrapper>
        {compare ? (
          <SpotWrapper>
            {years.map((y) => (
              <Spot
                key={y.key}
                content={y.key}
                compare={compare}
                selected={
                  (compareCandidates[0] && y === compareCandidates[0]) ||
                  (compareCandidates[1] && y === compareCandidates[1])
                }
                cand1={compareCandidates[0] && y === compareCandidates[0]}
                cand2={compareCandidates[1] && y === compareCandidates[1]}
                onClick={() => {
                  if (y !== compareCandidates[0]) {
                    setCompareCandidates(([cand1]) => [cand1, y])
                  }
                }}
              />
            ))}
          </SpotWrapper>
        ) : (
          <SpotWrapper>
            {years.map((y) => (
              <Spot
                key={y.key}
                content={y.key}
                selected={y === year}
                onClick={() => {
                  dispatch(electionActions.changeYear(y))
                }}
              />
            ))}
          </SpotWrapper>
        )}
        <Slider
          type="range"
          min="0"
          max={years.length - 1}
          step="1"
          value={selectedIndex}
          onChange={(e) => {
            const index = e.target.value
            const year = years[index]
            dispatch(electionActions.changeYear(year))
          }}
          compare={compare}
        />
      </SliderWrapper>
      <ButtonWrapper>
        {compare ? (
          <>
            {!compareMode && (
              <ActionButton
                cancel={true}
                onClick={() => {
                  setCompare(false)
                  setCompareCandidates([years.find((y) => y === year), null])
                }}
              >
                取消
              </ActionButton>
            )}
            <ActionButton
              disabled={!compareYear}
              onClick={() => {
                if (compareMode) {
                  submitCompareEnd()
                  setCompare(false)
                  setCompareCandidates([years.find((y) => y === year), null])
                  document.body.scrollTop = 0 // For Safari
                  document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
                } else {
                  submitCompareCandidates()
                  const [year, compareYear] = compareCandidates
                  gtag.sendGAEvent('Click', {
                    project: `比較確定：${electionName}${
                      subtype ? ` - ${subtype.name}` : ''
                    } / ${year.key} - ${compareYear.key} / ${device}`,
                  })
                }
              }}
            >
              {compareMode ? '返回' : '確定'}
            </ActionButton>
          </>
        ) : (
          <ActionButton
            onClick={() => {
              setCompare(true)
              gtag.sendGAEvent('Click', {
                project: `比較 / ${device}`,
              })
            }}
          >
            比較
          </ActionButton>
        )}
      </ButtonWrapper>
    </Wrapper>
  )
}
