import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ReferendumSelect } from './ReferendumSelect'

const StyledReferendumSelect = styled(ReferendumSelect)`
  margin: 17px 0 0 12px;
`

const ActionButton = styled.button`
  display: inline-block;
  margin: 20px 0 0 12px;
  border: 1px solid #000;
  background-color: ${({ compare }) => (compare ? '#e0e0e0' : '#ffc7bb')};
  color: #000;
  border-radius: 8px;
  line-height: 23px;
  text-align: center;
  width: 80px;
  height: 32px;
  ${({ cancel }) => cancel && 'background-color: #e0e0e0;'}
`

export const ReferendumControl = ({ numberInfo, compareInfo }) => {
  const { compareMode, onCompareInfoChange } = compareInfo
  const [compare, setCompare] = useState(false)
  const { number, numbers, onNumberChange } = numberInfo

  const [compareCandidates, setCompareCandidates] = useState([
    number,
    numbers?.length > 1 ? numbers.filter((n) => n.key !== number.key)[0] : null,
  ])
  const compareNumber = compareCandidates[1]

  const submitCompareCandidates = useCallback(() => {
    console.log('submit compareCandidates', compareCandidates)
    const [number, compareNumber] = compareCandidates
    onNumberChange(number)
    onCompareInfoChange({
      compareMode: true,
      compareYearKey: compareNumber.year,
      compareNumber: compareNumber,
    })
  }, [compareCandidates, onCompareInfoChange, onNumberChange])

  const submitCompareEnd = () => {
    onCompareInfoChange({ compareMode: false })
  }

  useEffect(() => {
    // submit again if compareCandidates changes
    if (compareMode) {
      submitCompareCandidates()
    }
  }, [compareCandidates, compareMode, submitCompareCandidates])

  return (
    <>
      {compare ? (
        <>
          <StyledReferendumSelect
            selectedNumber={compareCandidates[0]}
            numbers={numbers}
            onNumberChange={(number) => {
              setCompareCandidates(([, cand2]) => {
                console.log(number)
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
          {!compareMode && (
            <ActionButton
              cancel="true"
              onClick={() => {
                setCompare(false)
                setCompareCandidates([
                  number,
                  numbers?.length > 1
                    ? numbers.filter((n) => n.key !== number.key)[0]
                    : null,
                ])
              }}
            >
              取消
            </ActionButton>
          )}
          <ActionButton
            onClick={() => {
              if (compareMode) {
                submitCompareEnd()
                setCompare(false)
                setCompareCandidates([
                  number,
                  numbers?.length > 1
                    ? numbers.filter((n) => n.key !== number.key)[0]
                    : null,
                ])
                document.body.scrollTop = 0 // For Safari
                document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
              } else {
                submitCompareCandidates()
              }
            }}
          >
            {compareMode ? '返回' : '確定'}
          </ActionButton>
        </>
      ) : (
        <>
          <StyledReferendumSelect
            selectedNumber={number}
            numbers={numbers}
            onNumberChange={onNumberChange}
          />
          {compareNumber && (
            <ActionButton
              onClick={() => {
                setCompare(true)
              }}
              compare={compare}
            >
              比較
            </ActionButton>
          )}
        </>
      )}
    </>
  )
}
