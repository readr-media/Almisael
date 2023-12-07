import styled from 'styled-components'
import { InfoboxPanel } from './InfoboxPanel'
import { useAppSelector } from '../hook/useRedux'

const Wrapper = styled.div``

export const InfoboxPanels = () => {
  const infoboxData = useAppSelector((state) => state.election.data.infoboxData)
  const compareInfoboxData = useAppSelector(
    (state) => state.election.compare.infoboxData
  )
  const compareInfo = useAppSelector((state) => state.election.compare.info)
  const year = useAppSelector((state) => state.election.control.year)
  const number = useAppSelector((state) => state.election.control.number)
  const subtype = useAppSelector((state) => state.election.control.subtype)

  return (
    <Wrapper>
      <InfoboxPanel
        data={infoboxData}
        subtype={subtype}
        compareInfo={compareInfo}
        number={number}
        year={year}
      />
      {compareInfo?.compareMode && (
        <InfoboxPanel
          data={compareInfoboxData}
          subtype={compareInfo.filter?.subtype}
          compareInfo={compareInfo}
          number={compareInfo.filter?.number}
          year={compareInfo.filter?.year}
        />
      )}
    </Wrapper>
  )
}
