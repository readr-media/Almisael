import { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 627px;
  display: flex;
`

const SliderWrapper = styled.div`
  width: 555px;
  margin: 0 28px 0 40px;
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
    width: 22px;
    height: 22px;
    background-color: #ffc7bb;
    cursor: pointer;
    border: 1px solid #000000;
    border-radius: 50%;
  }

  &::-moz-range-thumb {
    width: 22px;
    height: 22px;
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
  width: 22px;
  height: 22px;
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
    width: 16px;
    height: 16px;
    border: 1px solid #000;
    border-radius: 50%;
    background-color: #ffc7bb;
  }

  &:after {
    content: '${({ content }) => content}';
    display: block;
    position: absolute;
    width: 59px;
    font-size: 24px;
    font-weight: 900;
    line-height: 35px;
    top: 23px;
    left: -18px;
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

const ActionButton = styled.button`
  margin-top: 11px;
  width: 72px;
  height 39px;
  border-radius: 12px;
  border: 1px solid #000;
  background-color: #ffc7bb;
  font-size: 18px;
  font-weight: 500;
  &:disabled {
    background-color: #e0e0e0;
  }
`

export const YearSelect = ({ className, yearInfo, compareInfo }) => {
  const { compareMode, onCompareInfoChange } = compareInfo

  const { years, year, onYearChange } = yearInfo
  const [compare, setCompare] = useState(false)
  const [compareCandidates, setCompareCandidates] = useState([
    years.find((y) => y === year),
    null,
  ])
  const compareYear = compareCandidates[1]
  const selectedIndex = years.indexOf(years.find((y) => y === year))

  const submitCompareCandidates = useCallback(() => {
    console.log('submit compareCandidates', compareCandidates)
    const [year, compareYear] = compareCandidates
    onYearChange(year)
    onCompareInfoChange({
      compareMode: true,
      compareYearKey: compareYear.key,
    })
  }, [compareCandidates, onCompareInfoChange, onYearChange])

  const submitCompareEnd = useCallback(() => {
    onCompareInfoChange({ compareMode: false })
  }, [onCompareInfoChange])

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
                  onYearChange(y)
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
            const year = years[index].key
            onYearChange(year)
          }}
          compare={compare}
        />
      </SliderWrapper>
      {compare ? (
        <ActionButton
          disabled={!compareYear}
          onClick={() => {
            if (compareMode) {
              submitCompareEnd()
              setCompare(false)
              setCompareCandidates([years.find((y) => y === year), null])
            } else {
              submitCompareCandidates()
            }
          }}
        >
          {compareMode ? '返回' : '確定'}
        </ActionButton>
      ) : (
        <ActionButton
          onClick={() => {
            setCompare(true)
          }}
        >
          比較
        </ActionButton>
      )}
    </Wrapper>
  )
}
