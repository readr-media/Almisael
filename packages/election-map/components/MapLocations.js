import styled from 'styled-components'

const LocationsWrapper = styled.div`
  margin: 13px 0 0;
  @media (max-width: 1024px) {
    margin: 0 6px 0 0;
    padding-left: 36px;
    ${
      /**
       * @param {Object} props
       * @param {boolean} props.expand
       * @param {boolean} props.shrink
       */
      ({ expand, shrink }) => {
        if (shrink) {
          return `padding-left: 36px;`
        }
        if (expand) {
          return `padding-left: 24px;`
        }
      }
    }
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
    ${
      /**
       * @param {Object} props
       * @param {boolean} props.shrink
       */
      ({ shrink }) => (shrink ? `font-size: 14px` : `font-size: 18px;`)
    }}
  }
`

/**
 *
 * @param {Object} props
 * @param {Array<string>} props.locations
 * @returns
 */
export const MapLocations = ({ locations }) => {
  const words = locations.reduce((words, location) => words + location, '')
  const expand = words.length > 9
  const shrink = words.length > 10
  return (
    <LocationsWrapper expand={expand} shrink={shrink}>
      {locations.map((location, i) => (
        <Location key={i} shrink={shrink}>
          {location}
        </Location>
      ))}
    </LocationsWrapper>
  )
}
