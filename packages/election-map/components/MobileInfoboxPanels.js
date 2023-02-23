import styled from 'styled-components'
import { currentYear } from './helper/election'
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
  year,
  numberInfo,
}) => {
  const { compareMode, filter } = compareInfo
  let compareNames
  if (compareMode) {
    compareNames = [
      numberInfo?.number
        ? numberInfo.number.year + numberInfo.number.name
        : year.key,
      compareInfo?.filter?.number
        ? compareInfo?.filter.number.year + compareInfo?.filter.number.name
        : compareInfo?.filter.year.key,
    ]
  }

  return (
    <Wrapper className={className} compareMode={compareMode}>
      <Infobox
        data={data}
        subtype={subtype}
        isCurrentYear={year.key === currentYear}
        compareMode={compareMode}
        compareName={compareNames && compareNames[0]}
        year={year.key}
      />
      {compareMode && (
        <Infobox
          data={compareData}
          subtype={filter.subtype}
          isCurrentYear={filter.year.key === currentYear}
          compareMode={compareMode}
          compareName={compareNames && compareNames[1]}
          year={year.key}
        />
      )}
    </Wrapper>
  )
}
