import { useState, useCallback } from 'react'
import { useAppDispatch } from '../../hook/useRedux'
import { useAppSelector } from '../../hook/useRedux'
import { electionActions } from '../../store/election-slice'
import { ReferendumSelect } from '../ReferendumSelect'
import { getReferendumNumbers } from '../../utils/election'
import styled from 'styled-components'
const Wrapper = styled.div`
  position: fixed;
  z-index: 999;
  width: 100%;
  background-color: #fff;
  height: 100dvh;
  padding: 40px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .hint {
    margin-bottom: 12px;
  }
`

const Spot = styled.span`
  position: relative;
  width: 22px;
  height: 22px;
  background-color: #fff;
  cursor: pointer;
  border: 1px solid #cdcdcd;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 45px;

  &:after {
    display: block;
    position: absolute;
    color: #cdcdcd;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    top: 50%;
    transform: translateY(50%);
    content: '${
      /**
       *
       * @param {Object} props
       * @param {number} props.yearName
       */
      ({ yearName }) => yearName && `${yearName}`
    }';
  }

  &.selected,
  &.selected2 {
    border: 1px solid #000;
    &:before {
      content: '';
      width: 16px;
      height: 16px;
      border: 1px solid #000;
      border-radius: 50%;
    }
    &:after {
      color: #000;
    }
  }
  &.selected {
    &:before {
      background-color: #ffc7bb;
    }
  }
  &.selected2 {
    &:before {
      background-color: #000;
    }
  }
`
const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 0 0 8px 8px;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
`
const DecideBtn = styled.button`
  border-radius: 8px;
  border: 1px solid black;
  padding: 6px 12px;
  background-color: #dd6f57;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
`
const CancelBtn = styled(DecideBtn)`
  background-color: #e0e0e0;
  margin-bottom: 24px;
`

const StyledReferendumSelect = styled(ReferendumSelect)`
  margin: 20px 0 100px;
`

const OtherTypeComparison = ({ setShouldOpenYearComparisonMenuBar }) => {
  const dispatch = useAppDispatch()
  const years = useAppSelector((state) => state.election.config.years)
  const year = useAppSelector((state) => state.election.control.year)

  const [compareCandidates, setCompareCandidates] = useState([
    years.find((y) => y === year),
    null,
  ])

  const [firstYear, compareYear] = compareCandidates

  const handleOnChooseYears = (year) => {
    if (firstYear.key === year.key) {
      return
    }
    const result = [firstYear, year]

    setCompareCandidates(result)
  }
  const handleOnDecide = () => {
    const [year, compareYear] = compareCandidates
    if (!compareYear?.key) {
      return
    }
    setShouldOpenYearComparisonMenuBar(false)

    dispatch(electionActions.changeYear(year))
    dispatch(
      electionActions.startCompare({
        compareYearKey: compareYear.key,
      })
    )
  }
  const itemJsx = years.map((year) => {
    let itemClassName = 'radio-button'
    if (firstYear.key === year.key) {
      itemClassName = 'radio-button selected'
    } else if (compareYear?.key === year.key) {
      itemClassName = `radio-button selected2`
    }

    return (
      <Spot
        key={year.key}
        yearName={year.key}
        className={itemClassName}
        onClick={() => handleOnChooseYears(year)}
      ></Spot>
    )
  })
  return (
    <>
      {itemJsx}
      <span className="hint">選擇兩個年份</span>
      <CancelBtn onClick={() => setShouldOpenYearComparisonMenuBar(false)}>
        取消
      </CancelBtn>
      <DecideBtn disabled={!compareYear?.key} onClick={handleOnDecide}>
        決定
      </DecideBtn>
    </>
  )
}

const ReferendumComparison = ({ setShouldOpenYearComparisonMenuBar }) => {
  const number = useAppSelector((state) => state.election.control.number)
  const electionConfig = useAppSelector((state) => state.election.config)
  const numbers = getReferendumNumbers(electionConfig)
  const dispatch = useAppDispatch()

  const [compareCandidates, setCompareCandidates] = useState([
    number,
    numbers?.length > 1 ? numbers.filter((n) => n.key !== number.key)[0] : null,
  ])
  const [first, second] = compareCandidates
  const handleSelectFirstReferendum = (number) => {
    setCompareCandidates(([, cand2]) => {
      if (number === cand2) {
        return [number, numbers.filter((n) => n.key !== number.key)[0]]
      } else {
        return [number, cand2]
      }
    })
  }

  const handleSelectSecondReferendum = (number) => {
    setCompareCandidates(([cand1]) => {
      if (number === cand1) {
        return [numbers.filter((n) => n.key !== number.key)[0], number]
      } else {
        return [cand1, number]
      }
    })
  }
  const submitCompareCandidates = useCallback(() => {
    dispatch(electionActions.changeNumber(first))
    dispatch(
      electionActions.startCompare({
        compareYearKey: second.year,
        compareNumber: second,
      })
    )
    setShouldOpenYearComparisonMenuBar(false)
  }, [dispatch, setShouldOpenYearComparisonMenuBar, first, second])
  return (
    <>
      <ReferendumSelect
        selectedNumber={first}
        numbers={numbers}
        onNumberChange={(number) => {
          handleSelectFirstReferendum(number)
        }}
      />
      <StyledReferendumSelect
        selectedNumber={second}
        numbers={numbers}
        onNumberChange={(number) => {
          handleSelectSecondReferendum(number)
        }}
      />
      <span className="hint">選擇兩個公投案</span>
      <CancelBtn onClick={() => setShouldOpenYearComparisonMenuBar(false)}>
        取消
      </CancelBtn>
      <DecideBtn onClick={submitCompareCandidates}>決定</DecideBtn>
    </>
  )
}

/**
 * Note: 有公投ui（比較案件）跟選舉ui（比較年份）
 * @returns
 */
export default function YearComparisonMenuBar({
  setShouldOpenYearComparisonMenuBar,
}) {
  const electionsType = useAppSelector(
    (state) => state.election.config.electionType
  )

  return (
    <Wrapper>
      <CloseBtn onClick={() => setShouldOpenYearComparisonMenuBar(false)}>
        X
      </CloseBtn>

      {electionsType === 'referendum' ? (
        <ReferendumComparison
          setShouldOpenYearComparisonMenuBar={
            setShouldOpenYearComparisonMenuBar
          }
        ></ReferendumComparison>
      ) : (
        <OtherTypeComparison
          setShouldOpenYearComparisonMenuBar={
            setShouldOpenYearComparisonMenuBar
          }
        />
      )}
    </Wrapper>
  )
}
