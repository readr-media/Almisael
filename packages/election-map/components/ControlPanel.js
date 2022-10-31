import styled from 'styled-components'

const Wrapper = styled.div`
  & * {
    pointer-events: auto;
  }
`

const ElectionSelect = styled.select`
  margin: 36px 0 0 60px;
`

const MapReverseButton = styled.button`
  display: block;
  margin: 20px 0 0 48px;
  border: 1px solid #000;
  background-color: #686868;
  color: #fff1db;
  border-radius: 8px;
  line-height: 23px;
  text-align: center;
  width: 80px;
  height: 32px;

  &:hover,
  &:active {
    background-color: #000;
  }
`

const LocationsWrapper = styled.div`
  margin: 13px 0 0 48px;
`

const Location = styled.span`
  margin-right: 16px;
  font-size: 24px;
  line-height: 34.75px;
  &:last-of-type {
    font-weight: 900;
    margin-right: unset;
  }
`

const locations = ['台南市', '七股區', '莊敬里']
export const ControlPanel = ({ electionNamePairs, onElectionChange }) => {
  return (
    <Wrapper>
      <ElectionSelect name="election-type" onChange={onElectionChange}>
        {electionNamePairs.map((electionNamePair) => (
          <option
            value={electionNamePair.electionType}
            key={electionNamePair.electionType}
          >
            {electionNamePair.electionName}
          </option>
        ))}
      </ElectionSelect>
      <MapReverseButton>回上層</MapReverseButton>
      <LocationsWrapper>
        {locations.map((location, i) => (
          <Location key={i}>{location}</Location>
        ))}
      </LocationsWrapper>
    </Wrapper>
  )
}
