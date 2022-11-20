import styled from 'styled-components'
import { InfoboxPanel } from './InfoboxPanel'

const Wrapper = styled.div``

export const InfoboxPanels = ({
  infoboxData,
  subtypeInfo,
  compareInfo,
  election,
  numberInfo,
  yearInfo,
  compareInfoboxData,
}) => {
  return (
    <Wrapper>
      <InfoboxPanel
        data={infoboxData}
        subtype={subtypeInfo?.subtype}
        compareInfo={compareInfo}
        election={election}
        number={numberInfo?.number}
        year={yearInfo?.year}
      />
      {compareInfo?.compareMode && (
        <InfoboxPanel
          compare={!!compareInfoboxData}
          data={compareInfoboxData}
          subtype={compareInfo.filter?.subtype}
          compareInfo={compareInfo}
          election={election}
          number={compareInfo.filter?.number}
          year={compareInfo.filter?.year}
        />
      )}
    </Wrapper>
  )
}
