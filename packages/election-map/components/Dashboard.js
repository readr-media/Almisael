import styled from 'styled-components'
import { electionMapColor } from '../consts/colors'
import { MapContainer } from './MapContainer'
import { Panels } from './Panels'
import { Tutorial } from './Tutorial'
import { useState } from 'react'
import {
  defaultMapUpperLevelId,
  defaultRenderingDistrictNames,
} from '../consts/election-module-pc'
import { useSelector } from 'react-redux'

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  background-color: ${electionMapColor};
`

const MoreHint = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background-color: #000;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`

export const Dashboard = ({
  onEvcSelected,
  showLoading,
  showTutorial,
  setShowTutorial,
  onTutorialEnd,
  dashboardInView,
  hasAnchor,
}) => {
  const [renderingDistrictNames, setRenderingDistrictNames] = useState(
    defaultRenderingDistrictNames
  )
  const [mapUpperLevelId, setMapUpperLevelId] = useState(defaultMapUpperLevelId)
  const electionConfig = useSelector((state) => state.election.config)

  return (
    <Wrapper>
      <Panels
        onEvcSelected={onEvcSelected}
        mapUpperLevelId={mapUpperLevelId}
        renderingDistrictNames={renderingDistrictNames}
      />
      <MapContainer
        showLoading={showLoading}
        dashboardInView={dashboardInView}
        mapColor={electionConfig.meta?.map?.mapColor}
        setMapUpperLevelId={setMapUpperLevelId}
        setRenderingDistrictNames={setRenderingDistrictNames}
      />
      {!hasAnchor && showTutorial && (
        <Tutorial
          show={showTutorial}
          onClick={() => {
            setShowTutorial(false)
            onTutorialEnd()
          }}
        />
      )}
      {!showTutorial && <MoreHint>往下滑看最新選情</MoreHint>}
    </Wrapper>
  )
}
