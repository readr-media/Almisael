import styled from 'styled-components'
import { getPartyColor } from '../../consts/colors'
import { useState } from 'react'

const SeatsChartWrapper = styled.div`
  font-size: 24px;
  line-height: 29px;
`

const SeatsChartYear = styled.div`
  padding: 18px 0 6px;
  text-align: center;
`

const SeartsChartTitle = styled.div`
  padding: 20px 0;
  text-align: center;
  background-color: #afafaf;
`

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 40px 39px 74px;
`

const SeatWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`

const Seat = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${({ bgColor }) => bgColor || '#fff'};
  border: solid 1px #000;
  border-radius: 50%;
`

const SeatInfo = styled.div`
  position: fixed;
  border-radius: 6px;
  max-width: 68px;
  padding: 4px;
  background-color: #000;
  color: #fff;
  font-size: 12px;
  line-height: 17.8px;
  top: 501px;
  left: 91px;

  ${({ coordinate }) =>
    coordinate.length
      ? `
      top: ${coordinate[1]}px;
      left: ${coordinate[0]}px;
    `
      : `
      top: 0;
      left: 0;
    `}
`

export const SeatsChart = ({ data, meta }) => {
  const [hoverParty, setHoverParty] = useState({
    show: false,
    party: '',
    coordinate: [],
  })
  return (
    <SeatsChartWrapper>
      <SeatsChartYear>{meta.year}</SeatsChartYear>
      <SeartsChartTitle>{meta.location + meta.componentTitle}</SeartsChartTitle>
      <Wrapper>
        {hoverParty.show && (
          <SeatInfo coordinate={hoverParty.coordinate}>
            {hoverParty.party}
          </SeatInfo>
        )}
        {data.parties.reduce((total, party) => {
          const color = getPartyColor(party.label)
          return total.concat(
            [...Array(party.seats)].map((empty, i) => {
              return (
                <SeatWrapper
                  key={party.label + i}
                  onMouseOver={() => {
                    setHoverParty((value) => ({
                      ...value,
                      show: true,
                      party: party.label,
                    }))
                  }}
                  onMouseMove={(e) => {
                    setHoverParty((value) => ({
                      ...value,
                      coordinate: [e.clientX + 15, e.clientY],
                    }))
                  }}
                  onMouseLeave={() => {
                    setHoverParty({
                      show: false,
                      party: '',
                      coordinate: [],
                    })
                  }}
                >
                  <Seat bgColor={color} />
                </SeatWrapper>
              )
            })
          )
        }, [])}
      </Wrapper>
    </SeatsChartWrapper>
  )
}
