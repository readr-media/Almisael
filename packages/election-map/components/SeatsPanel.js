import styled from 'styled-components'
import { CollapsibleWrapper } from './collapsible/CollapsibleWrapper'
import widgets from '@readr-media/react-election-widgets'
const SeatsChart = widgets.SeatChart.ReactComponent

const SeatsChartWrapper = styled(CollapsibleWrapper)`
  width: 320px;
  background-color: white;
  pointer-events: auto;
  margin: 9px 0 0;
`

export const SeatsPanel = ({ meta, data }) => {
  return (
    <>
      {data && (
        <SeatsChartWrapper title={meta.wrapperTitle}>
          <SeatsChart data={data} meta={meta} />
        </SeatsChartWrapper>
      )}
    </>
  )
}
