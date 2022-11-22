import styled from 'styled-components'
import { Infobox } from './infobox/Infobox'

const Wrapper = styled.div`
  background: #fff;
  max-height: 130px;
  overflow: scroll;
  padding-top: 16px;
  margin: 0 36px;
  ${({ compareMode }) =>
    compareMode &&
    `
    display: flex;
    >div {
      width: 50%;
    }
  `}
`

export const MobileInfoboxPanels = ({
  className,
  data,
  subtype,
  compareData,
  compareInfo,
}) => {
  const isRunning = data.isRunning

  const { compareMode, filter } = compareInfo

  return (
    <Wrapper className={className} compareMode={compareMode}>
      <Infobox
        data={data}
        subtype={subtype}
        isRunning={isRunning}
        compareMode={compareMode}
      />
      {compareMode && (
        <Infobox
          data={compareData}
          subtype={filter.subtype}
          isRunning={compareData.isRunning}
          compareMode={compareMode}
        />
      )}
    </Wrapper>
  )
}
