import styled from 'styled-components'
import { CollapsibleWrapper } from './collapsible/CollapsibleWrapper'
import { SeatsChart } from './seats-chart/SeatsChart'

const SeatsChartWrapper = styled(CollapsibleWrapper)`
  width: 320px;
  background-color: white;
  pointer-events: auto;
  margin: 9px 0 0 48px;
`

export const SeatsPanel = ({ seats }) => {
  return (
    <>
      {seats && (
        <SeatsChartWrapper title={seats.title}>
          <SeatsChart />
        </SeatsChartWrapper>
      )}
    </>
  )
}
