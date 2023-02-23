import { useState, useCallback } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { ReferendumSelect } from './ReferendumSelect'
import ReactGA from 'react-ga'

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
  padding-top: 11vh;
`

const CloseButton = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
`

const Referendums = styled.div`
  width: 236px;
  max-height: 61%;
  overflow: scroll;
  margin: 0 auto;
`

const ReferendumWrapper = styled.div`
  ${({ selected }) => selected && `color: #DD6F57;`}
  text-align: center;
  font-size: 14px;
`

const ReferendumTitle = styled.div`
  margin-bottom: 8px;
  font-weight: 500;
  line-height: 20px;
`
const ReferendumDetail = styled.div`
  margin-bottom: 20px;
  line-height: 1.5;
`

const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${({ compare }) => (compare ? '10vh' : '8.1vh')};
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

const StyledReferendumSelect = styled(ReferendumSelect)`
  margin: 0 auto 20px;
`

export const MobileReferendumControl = ({
  compare,
  numberInfo,
  compareInfo,
  hideReferendumSelect,
}) => {
  const { number, numbers, onNumberChange } = numberInfo
  const { onCompareInfoChange } = compareInfo

  const [selectedNumber, setSeletedNumber] = useState(number)
  const [compareCandidates, setCompareCandidates] = useState([
    number,
    numbers?.length > 1 ? numbers.filter((n) => n.key !== number.key)[0] : null,
  ])

  const submitCompareCandidates = useCallback(() => {
    const [number, compareNumber] = compareCandidates
    onNumberChange(number)
    onCompareInfoChange({
      compareMode: true,
      compareYearKey: compareNumber.year,
      compareNumber: compareNumber,
    })
  }, [compareCandidates, onCompareInfoChange, onNumberChange])

  return (
    <Wrapper>
      <GlobalStyle />
      <CloseButton
        onClick={() => {
          hideReferendumSelect()
        }}
      >
        {closeSvg}
      </CloseButton>
      {!compare ? (
        <>
          <Referendums>
            {numbers.map((number) => (
              <ReferendumWrapper
                key={number.key}
                selected={number === selectedNumber}
                onClick={() => {
                  setSeletedNumber(number)
                }}
              >
                <ReferendumTitle>{`${number.year} ${number.name}`}</ReferendumTitle>
                <ReferendumDetail>{number.detail}</ReferendumDetail>
              </ReferendumWrapper>
            ))}
          </Referendums>
          <ActionWrapper compare={compare}>
            <ActionTitle>選擇公投</ActionTitle>
            <ActionButton
              onClick={() => {
                hideReferendumSelect()
              }}
              cancel="true"
            >
              取消
            </ActionButton>
            <ActionButton
              onClick={() => {
                onNumberChange(selectedNumber)
                hideReferendumSelect()
              }}
            >
              確定
            </ActionButton>
          </ActionWrapper>
        </>
      ) : (
        <>
          <StyledReferendumSelect
            selectedNumber={compareCandidates[0]}
            numbers={numbers}
            onNumberChange={(number) => {
              setCompareCandidates(([, cand2]) => {
                if (number === cand2) {
                  return [
                    number,
                    numbers.filter((n) => n.key !== number.key)[0],
                  ]
                } else {
                  return [number, cand2]
                }
              })
            }}
          />
          <StyledReferendumSelect
            selectedNumber={compareCandidates[1]}
            numbers={numbers}
            onNumberChange={(number) => {
              setCompareCandidates(([cand1]) => {
                if (number === cand1) {
                  return [
                    numbers.filter((n) => n.key !== number.key)[0],
                    number,
                  ]
                } else {
                  return [cand1, number]
                }
              })
            }}
          />
          <ActionWrapper compare={compare}>
            <ActionTitle>選擇兩個公投</ActionTitle>
            <ActionButton
              onClick={() => {
                hideReferendumSelect()
                ReactGA.event({
                  category: 'Projects',
                  action: 'Click',
                  label: `比較取消：公投 / 手機平板`,
                })
              }}
              cancel="true"
            >
              取消
            </ActionButton>
            <ActionButton
              onClick={() => {
                submitCompareCandidates()
                hideReferendumSelect()
                ReactGA.event({
                  category: 'Projects',
                  action: 'Click',
                  label: `比較確定：公投 / 手機平板`,
                })
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
