import { useState } from 'react'

import styled from 'styled-components'
const Wrapper = styled.div`
  position: fixed;
  z-index: 10;
  width: 100%;
  background-color: #fff;
  height: 100dvh;
  padding: 40px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .radio-button {
    display: inline-block;
    padding: 10px 20px;
    margin: 5px;
    cursor: pointer;
    border: 2px solid #000; /* 預設邊框顏色 */
    border-radius: 5px;
    &.selected {
      background-color: #000;
      color: #fff;
    }
    &.selected2 {
      background-color: #ffc7bb;
      color: #fff;
    }
  }
`
/**
 * Note: 有公投ui（比較案件）跟選舉ui（比較年份）
 * @returns
 */
export default function YearComparisonMenuBar({
  years = [{ key: 2024 }],
  selectedYears = [{ key: 2024 }],
  setSelectedYears,
  setShouldOpenYearComparisonMenuBar,
}) {
  const [selectedYearsNew, setSelectedYearsNew] = useState(selectedYears)
  const [firstYear, secondYear] = selectedYearsNew

  const handleOnChooseYears = (year) => {
    const result = [firstYear, year]
    setSelectedYearsNew(result)
  }
  const handleOnDecide = () => {
    setShouldOpenYearComparisonMenuBar(false)
    setSelectedYears([...selectedYearsNew])
  }
  const itemJsx = years.map((year) => {
    let itemClassName = 'radio-button'
    if (firstYear.key === year.key) {
      itemClassName = 'radio-button selected'
    } else if (secondYear?.key === year.key) {
      itemClassName = `radio-button selected2`
    }

    return (
      <div
        key={year.key}
        className={itemClassName}
        onClick={() => handleOnChooseYears(year)}
      >
        {year.key}
      </div>
    )
  })
  return (
    <Wrapper>
      <button onClick={() => setShouldOpenYearComparisonMenuBar(false)}>
        關閉按鈕
      </button>
      {itemJsx}

      <button onClick={handleOnDecide}>決定</button>
    </Wrapper>
  )
}
