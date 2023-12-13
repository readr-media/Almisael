import styled from 'styled-components'
import { CollapsibleWrapper } from './collapsible/CollapsibleWrapper'
import widgets from '@readr-media/react-election-widgets'
const SeatsChart = widgets.SeatChart.ReactComponent
import { useAppSelector } from '../hook/useRedux'
import { useEffect, useState } from 'react'
import { countyMappingData } from '../consts/electionsConifg'

const SeatsChartWrapper = styled(CollapsibleWrapper)`
  width: 320px;
  background-color: white;
  pointer-events: auto;
  margin: 9px 0 0;
`

const StyledSeatsChart = styled(SeatsChart)`
  max-height: 317px;
  overflow: auto;
`

/**
 * Control seats chart from @readr-media/react-election-widgets
 */
export const SeatsPanel = () => {
  const [switchOn, setSwitchOn] = useState(false)
  const electionType = useAppSelector(
    (state) => state.election.config.electionType
  )
  const subtype = useAppSelector((state) => state.election.control.subtype)
  const seatMeta = useAppSelector((state) => state.election.config.meta.seat)
  const seatData = useAppSelector((state) => state.election.data.seatData)
  const control = useAppSelector((state) => state.election.control)
  const countyCode = control.level.countyCode
  const year = control.year

  const onSwitchChange = (switchOn) => {
    setSwitchOn(switchOn)
  }

  const initialSwitchInfo = {
    onText: '',
    offText: '',
    isOn: switchOn,
    onChange: onSwitchChange,
  }

  let meta = {
    wrapperTitle: '',
    componentTitle: '',
    year: year.key,
    switchInfo: null,
  }
  const location = countyMappingData.find(
    (countyData) => countyData.countyCode === countyCode
  )?.countyName
  let data

  // For council member, only provide each county parties data and the titles for the SeatsChart to show
  if (electionType === 'councilMember') {
    data = seatData[1][countyCode]
    meta.wrapperTitle = seatMeta.wrapperTitle
    meta.componentTitle = location + seatMeta.componentTitle
  } else if (electionType === 'legislator') {
    /**
     * For legislator, there will be switch mode for pc version SeatsChart to show and response when switch is changed.
     * Check @readr-media/react-election-widgets/seat-chart/index.js jsDoc for more detail.
     */
    const offText = '立法院總席次'
    meta.switchInfo = initialSwitchInfo
    if (subtype.key === 'normal') {
      data = switchOn ? seatData.all : seatData[1][countyCode]
      meta.wrapperTitle = seatMeta.wrapperTitle[subtype.key]
      meta.componentTitle = `${
        seatMeta.componentTitle[subtype.key]
      } (${location})`
      meta.switchInfo.onText = '區域'
      meta.switchInfo.offText = offText
    } else {
      data = switchOn ? seatData.all : seatData[0]
      meta.wrapperTitle = seatMeta.wrapperTitle[subtype.key]
      meta.componentTitle = seatMeta.componentTitle[subtype.key]
      meta.switchInfo.onText =
        subtype.key === 'party'
          ? '不分區'
          : subtype.key === 'mountainIndigenous'
          ? '山地原住民'
          : '平地原住民'
      meta.switchInfo.offText = offText
    }
  }

  useEffect(() => {
    setSwitchOn(false)
  }, [control])

  return (
    <>
      {data && (
        <SeatsChartWrapper title={meta.wrapperTitle}>
          <StyledSeatsChart data={data} meta={meta} />
        </SeatsChartWrapper>
      )}
    </>
  )
}
