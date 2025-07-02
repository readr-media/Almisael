import styled from 'styled-components'

const ChartWrapper = styled.div`
  font-family: 'Noto Sans TC', sans-serif;
  background-color: #000;
  color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
`

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 700;
  color: #b5b5b5;

  .threshold-text {
    margin-left: 24px;
  }

  .threshold-value {
    color: #fff;
    margin-left: 8px;
  }
`

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;

  .color-box {
    width: 16px;
    height: 16px;
    background-color: ${(props) => props.color};
  }
`

const BarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const BarRow = styled.div`
  position: relative;
  width: 100%;
  background-color: #d9d9d9;
  height: 40px;
  display: flex;
  align-items: center;
`

const Bar = styled.div`
  height: 100%;
  width: ${(props) => props.width}%;
  background-color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 12px;
  position: relative;
  transition: width 0.5s ease-in-out;
  white-space: nowrap;
  overflow: hidden;
`

const BarLabel = styled.span`
  font-weight: 700;
  font-size: 18px;
  color: #fff;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
`

const PercentageLabel = styled.span`
  position: absolute;
  right: 12px;
  font-weight: 700;
  font-size: 18px;
  color: #4a4a4a;
`

const ThresholdLine = styled.div`
  position: absolute;
  left: ${(props) => props.left}%;
  top: 0;
  bottom: 0;
  border-left: 2px dotted #000;
  transform: translateX(-1px);
`

/**
 * A reusable bar chart component with a threshold line.
 * @param {Object} props
 * @param {string} props.title - The title displayed above the threshold value.
 * @param {number} props.thresholdValue - The numerical value for the threshold.
 * @param {number} props.totalValue - The total value for calculating percentages.
 * @param {Array<{label: string, value: number, color: string}>} props.data - The data for the bars.
 * @param {string} [props.unit='票'] - The unit to display after the values.
 */
export const ThresholdBarChart = ({
  title,
  thresholdValue,
  totalValue,
  data,
  unit = '票',
}) => {
  if (!data || data.length === 0 || !totalValue) {
    return null
  }

  const thresholdPercentage = (thresholdValue / totalValue) * 100

  return (
    <ChartWrapper>
      <Header>
        <Legend>
          {data.map((item) => (
            <LegendItem key={item.label} color={item.color}>
              <div className="color-box" />
            </LegendItem>
          ))}
        </Legend>
        <div className="threshold-text">
          {title}：
          <span className="threshold-value">
            {thresholdValue.toLocaleString()} {unit}
          </span>
        </div>
      </Header>
      <BarList>
        {data.map((item) => {
          const percentage = (item.value / totalValue) * 100
          return (
            <BarRow key={item.label}>
              <Bar width={percentage} color={item.color}>
                {percentage > 15 && (
                  <BarLabel>
                    {item.value.toLocaleString()} {unit}
                  </BarLabel>
                )}
              </Bar>
              <PercentageLabel>{percentage.toFixed(1)}%</PercentageLabel>
              <ThresholdLine left={thresholdPercentage} />
            </BarRow>
          )
        })}
      </BarList>
    </ChartWrapper>
  )
}
