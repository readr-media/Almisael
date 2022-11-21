import styled from 'styled-components'

const LocationsWrapper = styled.div`
  margin: 13px 0 0;
`

const Location = styled.span`
  margin-right: 16px;
  font-size: 24px;
  line-height: 34.75px;
  &:last-of-type {
    font-weight: 700;
    margin-right: unset;
  }
`

export const MapLocations = ({ locations }) => {
  return (
    <LocationsWrapper>
      {locations.map((location, i) => (
        <Location key={i}>{location}</Location>
      ))}
    </LocationsWrapper>
  )
}
