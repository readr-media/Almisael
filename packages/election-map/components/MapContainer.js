import { useMapData } from '../hook/useMapData'
import { CollapsibleWrapper } from './collapsible/CollapsibleWrapper'
import { MapControl } from './MapControl'
import styled from 'styled-components'
import { Infobox } from './infobox/Infobox'
import { SeatsChart } from './seats-chart/SeatsChart'

const InfoboxWrapper = styled(CollapsibleWrapper)`
  width: 320px;
  position: absolute;
  top: 80px;
  left: 48px;
  background-color: white;
`
const SeatsChartWrapper = styled(CollapsibleWrapper)`
  width: 320px;
  position: absolute;
  top: 280px;
  left: 49px;
  background-color: white;
`

export const MapContainer = () => {
  const mapData = useMapData()
  const elections = [
    { type: 'president' },
    { type: 'mayor' },
    {
      type: 'legislator',
      seats: { title: '立法委員席次圖' },
    },
    {
      type: 'councilman',
      seats: { title: '縣市議員席次圖' },
    },
  ]
  // const election = elections[Math.floor(Math.random() * elections.length)]
  const election = elections[3]

  if (!mapData) {
    return <p>Loading...</p>
  }

  return (
    <>
      <MapControl mapData={mapData} />
      <InfoboxWrapper title={'詳細資訊'}>
        <Infobox type={election.type} />
      </InfoboxWrapper>
      {election.seats && (
        <SeatsChartWrapper title={election.seats.title}>
          <SeatsChart />
        </SeatsChartWrapper>
      )}
    </>
  )
}
