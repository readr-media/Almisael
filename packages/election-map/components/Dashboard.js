import styled from 'styled-components'
import { electionMapColor } from '../consts/colors'
import { MapContainer } from './MapContainer'
import { Panels } from './Panels'
import { Tutorial } from './Tutorial'
import { useAppDispatch, useAppSelector } from '../hook/useRedux'
import { mapActions } from '../store/map-slice'
import { electionActions } from '../store/election-slice'
import { defaultElectionType } from '../consts/electionsConfig'

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
  dashboardInView,
  hasAnchor,
}) => {
  const showTutorial = useAppSelector((state) => state.map.ui.showTutorial)
  const dispatch = useAppDispatch()
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
            dispatch(mapActions.changeUiShowTutorial(false))
            dispatch(electionActions.changeElection(defaultElectionType))
            dispatch(mapActions.resetUiDistrictNames())
            dispatch(mapActions.resetMapFeature())
          }}
        />
      )}
      {!showTutorial && <MoreHint>往下滑看最新選情</MoreHint>}
    </Wrapper>
  )
}
