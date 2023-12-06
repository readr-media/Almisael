import { useState } from 'react'
import styled from 'styled-components'
import { useElementDimension } from '../hook/useElementDimension'
import useWindowDimensions from '../hook/useWindowDimensions'
import { Map } from './Map'
import { MapTooltip } from './MapTooltip'
import { useSelector } from 'react-redux'
import { useAppSelector } from '../hook/useRedux'
import { useGeoJsons } from '../hook/useGeoJsons'

// margin-left: 368px;
// width: ${({ compareMode }) =>
//   compareMode ? 'calc(100vw - 368px)' : 'calc(100vw - 368px - 340px)'};

const Wrapper = styled.div`
  width: 100vw;
  top: 0;
  height: 100vh;
  position: fixed;

  @media (min-width: 1025px) {
    ${({ dashboardInView }) => !dashboardInView && `display: none;`}
    ${({ compareMode }) =>
      compareMode &&
      `
      width: calc(100vw - 368px);
      left: 368px;
    `}
  }

  @media (max-width: 1024px) {
    position: absolute;
    ${({ compareMode }) =>
      compareMode &&
      `
        svg:first-of-type {
          border-bottom: 1px solid #000;
        } 
    `}
  }
`

const CompareInfo = styled.div`
  position: absolute;
  top: 16px;
  left: ${({ left }) => (left ? '0' : 'calc(50vw - 184px)')};
  font-size: 24px;
  font-weight: 700;
  @media (max-width: 1024px) {
    top: ${({ left }) => (left ? '74px' : 'calc(50vh - 20px + 8px)')};
    left: 8px;
    font-size: 12px;
  }
`

const defaultTooltip = {
  show: false,
  text: '',
  coordinate: [],
}

export const MapContainer = ({
  dashboardInView,
  mapColor,
  setMapUpperLevelId,
  setRenderingDistrictNames,
}) => {
  useGeoJsons()
  const [tooltip, setTooltip] = useState(defaultTooltip)
  const { elementRef, dimension } = useElementDimension()
  const { width } = useWindowDimensions()
  const compareInfo = useSelector((state) => state.election.compare.info)
  const year = useSelector((state) => state.election.control.year)
  const number = useSelector((state) => state.election.control.number)
  const electionData = useSelector((state) => state.election.data.mapData)
  const geoJsons = useAppSelector((state) => state.map.geoJsons)

  const compareElectionData = useSelector(
    (state) => state.election.compare.mapData
  )
  const hasGeoJsons = !!geoJsons.villages

  const { compareMode } = compareInfo
  // if any level of map not exist
  if (!hasGeoJsons) {
    return <div></div>
  }

  if (compareMode && mapColor) {
    const splitDimension =
      width > 1024
        ? {
            width: dimension?.width / 2,
            height: dimension?.height,
          }
        : {
            width: dimension?.width,
            height: dimension?.height / 2 - 20,
          }
    return (
      <Wrapper
        ref={elementRef}
        compareMode={compareMode}
        dashboardInView={dashboardInView}
      >
        {dimension && (
          <>
            <Map
              dimension={splitDimension}
              geoJsons={geoJsons}
              id="first"
              setTooltip={setTooltip}
              electionData={electionData}
              mapColor={mapColor}
              setMapUpperLevelId={setMapUpperLevelId}
              setRenderingDistrictNames={setRenderingDistrictNames}
            />
            <CompareInfo left={true}>
              {number ? number.year + number.name : year.key}
            </CompareInfo>
            <Map
              dimension={splitDimension}
              geoJsons={geoJsons}
              id="second"
              setTooltip={setTooltip}
              electionData={compareElectionData}
              mapColor={mapColor}
              setMapUpperLevelId={setMapUpperLevelId}
              setRenderingDistrictNames={setRenderingDistrictNames}
            />
            <CompareInfo left={false}>
              {compareInfo?.filter?.number
                ? compareInfo?.filter.number.year +
                  compareInfo?.filter.number.name
                : compareInfo?.filter.year.key}
            </CompareInfo>
          </>
        )}
        <MapTooltip tooltip={tooltip} />
      </Wrapper>
    )
  } else {
    return (
      <Wrapper ref={elementRef} dashboardInView={dashboardInView}>
        {dimension && (
          <Map
            dimension={dimension}
            geoJsons={geoJsons}
            id="first"
            setTooltip={setTooltip}
            electionData={electionData}
            mapColor={mapColor}
            setMapUpperLevelId={setMapUpperLevelId}
            setRenderingDistrictNames={setRenderingDistrictNames}
          />
        )}
        <MapTooltip tooltip={tooltip} />
      </Wrapper>
    )
  }
}
