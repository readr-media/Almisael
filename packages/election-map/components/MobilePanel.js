import styled from 'styled-components'
import { CollapsibleWrapper } from './collapsible/CollapsibleWrapper'
import { countyMappingData } from './helper/election'
import { MapLocations } from './MapLocations'
import { MapNavigateButton } from './MapNavigateButton'
import { MobileInfoboxPanels } from './MobileInfoboxPanels'
import widgets from '@readr-media/react-election-widgets'
const SeatsChart = widgets.SeatChart.ReactComponent

const StyledCollapsibleWrapper = styled(CollapsibleWrapper)`
  position: relative;
  width: 100%;
  background: #fff;
`

// height: ${({ showInfobox }) => (showInfobox ? '130px' : '347px')};
const InformationWrapper = styled.div``

const Border = styled.div`
  margin: 0 36px;
  border-bottom: 1px solid #000;
`

const MapInfos = styled.div`
  height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 36px 5px 0;

  @media (max-width: 375px) {
    padding-right: 30px;
  }
`

export const MobilePanel = ({
  showInfobox,
  seatData,
  infoboxData,
  compareInfoboxData,
  election,
  yearInfo,
  compareInfo,
  subtypeInfo,
  mapObject,
}) => {
  const { countyName, townName, constituencyName, villageName } = mapObject
  const locations = [
    countyName,
    townName,
    constituencyName,
    villageName,
  ].filter((name) => !!name)
  if (!locations.length) locations.push('全國')

  const title = election.electionName

  return (
    <StyledCollapsibleWrapper
      title={title}
      compareMode={compareInfo?.compareMode}
      locations={locations}
    >
      <InformationWrapper showInfobox={showInfobox}>
        {!showInfobox && seatData && (
          <SeatsChart
            data={seatData}
            meta={{
              ...election.meta.seat,
              year: yearInfo.year?.key,
              location: countyMappingData.find(
                (countyData) => countyData.countyCode === mapObject.countyId
              )?.countyName,
            }}
          />
        )}
        {showInfobox && (
          <MobileInfoboxPanels
            data={infoboxData}
            subtypeInfo={subtypeInfo}
            compareInfo={compareInfo}
            compareData={compareInfoboxData}
            year={yearInfo.year}
          ></MobileInfoboxPanels>
        )}
      </InformationWrapper>
      <Border />
      <MapInfos>
        {compareInfo.compareMode ? (
          <div />
        ) : (
          <MapLocations locations={locations} />
        )}
        <MapNavigateButton mapObject={mapObject} />
      </MapInfos>
    </StyledCollapsibleWrapper>
  )
}
