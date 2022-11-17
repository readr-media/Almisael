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
`

const CompareButton = styled.button`
  margin-top: 11px;
  width: 72px;
  height 39px;
  border-radius: 12px;
  border: 1px solid #000;
  background-color: #ffc7bb;
  font-size: 18px;
  font-weight: 500;
`

export const YearSelect = ({ className, yearInfo }) => {
  const { years, year, setYear } = yearInfo
  const selectedIndex = years.indexOf(years.find((y) => y.year === year))

  return (
    <Wrapper className={className}>
      <SliderWrapper>
        <SpotWrapper>
          {years.map((y) => (
            <Spot
              key={y.year}
              content={y.year}
              value={y.year === year}
              selected={y.year === year}
              onClick={() => {
                setYear(y.year)
              }}
            />
          ))}
        </SpotWrapper>
        <Slider
          type="range"
          min="0"
          max={years.length - 1}
          step="1"
          value={selectedIndex}
          onChange={(e) => {
            const index = e.target.value
            const year = years[index].year
            setYear(year)
          }}
        />
      </SliderWrapper>
      <CompareButton>比較</CompareButton>
    </Wrapper>
  )
}
