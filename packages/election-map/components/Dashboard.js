import styled from 'styled-components'
import { electionMapColor } from '../consts/colors'
import { MapContainer } from './MapContainer'
import { Panels } from './Panels'
import { Tutorial } from './Tutorial'

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
  return (
    <Wrapper>
      <Panels onEvcSelected={onEvcSelected} />
      <MapContainer
        showLoading={showLoading}
        dashboardInView={dashboardInView}
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
