import styled from 'styled-components'

const LocationsWrapper = styled.div`
  margin: 13px 0 0;
  @media (max-width: 1024px) {
    margin: 0 6px 0 0;
    padding-left: 36px;
    ${({ expand, shrink, compareMode }) => {
      if (compareMode) {
        return `
          margin: 0;
          padding: 0;
        `
      } else {
        if (shrink) {
          return `padding-left: 36px;`
        }
        if (expand) {
          return `padding-left: 24px;`
        }
      }
    }}
  }
  @media (max-width: 375px) {
    ${({ shrink }) => shrink && `padding-left: 30px;`}
  }
`

const Location = styled.span`
  margin-right: 16px;
  font-size: 24px;
  line-height: 34.75px;
  &:last-of-type {
    font-weight: 700;
    margin-right: unset;
  }

  @media (max-width: 1024px) {
    margin-right: 4px;
    font-size: 18px;
    ${({ shrink }) => shrink && 'font-size: 14px;'}

    ${({ shrink, compareMode }) => {
      if (compareMode) {
        return `
          font-size: 14px;
        `
      } else if (shrink) {
        return `font-size: 14px;`
      }
    }}}
  }
`

export const MapLocations = ({ locations, compareMode }) => {
  console.log(locations)
  const words = locations.reduce((words, location) => words + location, '')
  const expand = words.length > 9
  const shrink = words.length > 10
  return (
    <LocationsWrapper expand={expand} shrink={shrink} compareMode={compareMode}>
      {locations.map((location, i) => (
        <Location key={i} shrink={shrink} compareMode={compareMode}>
          {location}
        </Location>
      ))}
    </LocationsWrapper>
  )
}
