import styled from 'styled-components'
import { device } from '../utils/devices'

const ChartWrapper = styled.div`
  font-family: 'Noto Sans TC', sans-serif;
  color: #fff;
  border-radius: 8px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 400;
  color: #000;
  width: 100%;
`

const Legend = styled.div`
  display: none;
  @media ${device.tablet} {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  .color-box {
    width: 12px;
    height: 12px;
    margin-right: 4px;
    background-color: ${(props) => props.color};
  }
`
const ThresholdText = styled.p`
  display: none;
  @media ${device.tablet} {
    color: #666666;
  }
`
const ThresholdValue = styled.span`
  display: none;
  @media ${device.tablet} {
    display: unset;
  }
`

const MobileThresholdText = styled.p`
  color: #666666;
  text-align: right;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 400;
  @media ${device.tablet} {
    display: none;
  }
`
const MobileThresholdValue = styled.span`
  display: unset;
  @media ${device.tablet} {
    display: none;
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
  height: 24px;
  display: flex;
  align-items: center;
`

const Bar = styled.div`
  height: 100%;
  width: ${
    /**
     * @param {Object} props
     * @param {number} [props.width]
     */
    (props) => props.width
  }%;
  background-color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 8px;
  position: relative;
  transition: width 0.5s ease-in-out;
  white-space: nowrap;
  @media ${device.tablet} {
    padding-left: 12px;
  }
`

const BarLabel = styled.span`
  font-size: 14px;
  font-weight: 400;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
`

const PercentageLabel = styled.span`
  position: absolute;
  right: 8px;
  font-weight: 400;
  font-size: 14px;
  color: #4a4a4a;
  @media ${device.tablet} {
    right: 12px;
  }
`

const ThresholdLine = styled.div`
  position: absolute;
  left: ${
    /**
     * @param {Object} props
     * @param {number} [props.left]
     */
    (props) => props.left
  }%;
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
 * @param {boolean} props.shouldShowThresholdValue - Should show threshold or not.
 * @param {boolean} props.shouldShowThresholdBar - Should show threshold bar or not.
 * @param {Array<{label: string, value: number, color: string}>} props.data - The data for the bars.
 * @param {string} [props.unit='票'] - The unit to display after the values.
 */
export const ThresholdBarChart = ({
  title,
  thresholdValue,
  shouldShowThresholdValue,
  shouldShowThresholdBar,
  totalValue,
  data,
  unit = '票',
}) => {
  if (!data || data.length === 0 || !totalValue) {
    return null
  }

  return (
    <ChartWrapper>
      <Header>
        <Legend>
          {data.map((item) => (
            <LegendItem key={item.label} color={item.color}>
              <div className="color-box" />
              <p>{item.label}</p>
            </LegendItem>
          ))}
        </Legend>
        {shouldShowThresholdValue && (
          <ThresholdText>
            {title}：
            <ThresholdValue>
              {(thresholdValue * totalValue).toFixed(0)} {unit}
            </ThresholdValue>
          </ThresholdText>
        )}
      </Header>
      <BarList>
        {data.map((item) => {
          const percentage = (item.value / totalValue) * 100
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
              key={item.label}
            >
              <p
                style={{
                  color: '#000',
                  fontSize: '14px',
                  marginRight: '4px',
                  width: '42px',
                  minWidth: '42px',
                  textAlign: 'left',
                }}
              >
                {item.label}
              </p>
              <BarRow>
                <Bar width={percentage} color={item.color}>
                  {
                    <BarLabel>
                      {item.value.toLocaleString()} {unit}
                    </BarLabel>
                  }
                </Bar>
                <PercentageLabel>{percentage.toFixed(1)}%</PercentageLabel>
                {item.label === '同意' && shouldShowThresholdBar && (
                  <ThresholdLine left={thresholdValue} />
                )}
              </BarRow>
            </div>
          )
        })}
      </BarList>
      {shouldShowThresholdValue && (
        <MobileThresholdText>
          {title}：
          <MobileThresholdValue>
            {(thresholdValue * totalValue).toFixed(0)} {unit}
          </MobileThresholdValue>
        </MobileThresholdText>
      )}
    </ChartWrapper>
  )
}
