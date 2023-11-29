import styled from 'styled-components'
import { InfoboxPanel } from './InfoboxPanel'
import { useSelector } from 'react-redux'

const Wrapper = styled.div``

export const InfoboxPanels = () => {
  const infoboxData = useSelector((state) => state.election.data.infoboxData)
  const compareInfoboxData = useSelector(
    (state) => state.election.compare.infoboxData
  )
  const compareInfo = useSelector((state) => state.election.compare.info)
  const year = useSelector((state) => state.election.control.year)
  const number = useSelector((state) => state.election.control.number)
  const subtype = useSelector((state) => state.election.control.subtype)

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
