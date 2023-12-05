import styled from 'styled-components'
import InfoBox from './InfoBox'
import { Fragment } from 'react'
import { useAppSelector } from '../../hook/useRedux'

const YearWrapper = styled.div`
  display: block;
  border-radius: 8px;
  border: 1px solid black;
  padding: 4px 7px;
  background-color: #fff;
  font-size: 14px;
  line-height: 20.27px;
  font-weight: 500;
  width: fit-content;
  margin: 17px 0 6px;
`

export default function InfoboxContainer() {
  const compareInfo = useAppSelector((state) => state.election.compare.info)
  const { compareMode, filter } = compareInfo
  const compareInfoboxData = useAppSelector(
    (state) => state.election.compare.infoboxData
  )
  const infoboxData = useAppSelector((state) => state.election.data.infoboxData)

  const year = useAppSelector((state) => state.election.control.year)
  const electionsType = useAppSelector(
    (state) => state.election.config.electionType
  )
  if (electionsType === 'referendum') {
    return null
  }
  return (
    <>
      {compareMode && <YearWrapper>{year.key}</YearWrapper>}
      <InfoBox infoboxData={infoboxData}></InfoBox>

      {compareMode && (
        <>
          {compareMode && <YearWrapper>{filter.year.key}</YearWrapper>}
          <InfoBox infoboxData={compareInfoboxData}></InfoBox>
        </>
      )}
    </>
  )
}
