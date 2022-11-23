import { useState, useCallback } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

const closeSvg = (
  <svg
    width="12"
    height="15"
    viewBox="0 0 12 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.34 15H2.28L4.4 11.04C4.76 10.32 5.14 9.58 5.56 8.68H5.64C6.14 9.58 6.54 10.32 6.92 11.04L9.08 15H11.12L6.84 7.52L10.84 0.339999H8.9L6.92 4.1C6.56 4.78 6.28 5.38 5.88 6.24H5.8C5.34 5.38 5.02 4.78 4.64 4.1L2.66 0.339999H0.6L4.62 7.44L0.34 15Z"
      fill="black"
    />
  </svg>
)

const GlobalStyle = createGlobalStyle`
  body {
    overflow: hidden;
    position: fixed;
    width: 100vw;
  }
`

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #fff;
  padding-top: 15vh;
`

const CloseButton = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
`

const SpotWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Spot = styled.span`
  position: relative;
  width: 22px;
  height: 22px;
  margin-top: 45px;
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
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    top: 22px;
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

const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 74px;
`
const ActionTitle = styled.div`
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 12px;
`

const ActionButton = styled.button`
  padding: 6px 12px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  border: 1px solid #000;
  border-radius: 12px;
  background: #ffc7bb;
  &:nth-of-type(2) {
    margin-top: 24px;
  }
  &:disabled {
    background-color: #e0e0e0;
  }
  ${({ cancel }) => cancel && 'background-color: #e0e0e0;'}
`

export const MobileYearSelect = ({
  hideYearSelect,
  yearInfo,
  compareInfo,
  compare,
}) => {
  const { onCompareInfoChange } = compareInfo
  const { years, year, onYearChange } = yearInfo
  const [selectedYear, setSelectedYear] = useState(year)
  const [compareCandidates, setCompareCandidates] = useState([
    years.find((y) => y === year),
    null,
  ])
  const compareYear = compareCandidates[1]

  const submitCompareCandidates = useCallback(() => {
    const [year, compareYear] = compareCandidates
    onYearChange(year)
    onCompareInfoChange({
      compareMode: true,
      compareYearKey: compareYear.key,
    })
  }, [compareCandidates, onCompareInfoChange, onYearChange])

  useState(() => {
    setSelectedYear(year)
  }, [year])

  return (
    <Wrapper>
      <GlobalStyle />
      <CloseButton
        onClick={() => {
          hideYearSelect()
        }}
      >
        {closeSvg}
      </CloseButton>
      {!compare ? (
        <>
          <SpotWrapper>
            {years.map((y) => (
              <Spot
                key={y.key}
                content={y.key}
                selected={y === selectedYear}
                onClick={() => setSelectedYear(y)}
              />
            ))}
          </SpotWrapper>
          <ActionWrapper>
            <ActionTitle>選擇年份</ActionTitle>
            <ActionButton
              onClick={() => {
                hideYearSelect()
              }}
              cancel="true"
            >
              取消
            </ActionButton>
            <ActionButton
              onClick={() => {
                onYearChange(selectedYear)
                hideYearSelect()
              }}
            >
              確定
            </ActionButton>
          </ActionWrapper>
        </>
      ) : (
        <>
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
          <ActionWrapper>
            <ActionTitle>選擇兩個年份</ActionTitle>
            <ActionButton
              onClick={() => {
                hideYearSelect()
              }}
              cancel="true"
            >
              取消
            </ActionButton>
            <ActionButton
              disabled={!compareYear}
              onClick={() => {
                submitCompareCandidates()
                hideYearSelect()
              }}
            >
              確定
            </ActionButton>
          </ActionWrapper>
        </>
      )}
    </Wrapper>
  )
}
