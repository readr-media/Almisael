import styled from 'styled-components'
import ReactGA from 'react-ga'
import { electionActions } from '../store/election-slice'
import { useAppSelector, useAppDispatch } from '../hook/useRedux'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

const Label = styled.label`
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &:first-of-type {
    margin-right: 5px;
  }
  & span:after {
    width: 13.3px;
    height: 13.3px;
    border-radius: 50%;
    background: #000;
  }
`

const Input = styled.input`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  &:checked ~ span:after {
    display: block;
  }
`

const Radio = styled.span`
  height: 20px;
  width: 20px;
  margin-right: 5px;
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  &:after {
    content: '';
    display: none;
  }
`

export const ElectionRadio = ({ className }) => {
  const dispatch = useAppDispatch()
  const selectedType = useAppSelector((state) => state.election.control.subtype)
  const electionConfig = useAppSelector((state) => state.election.config)
  const subtypes = electionConfig.subtypes

  return (
    <Wrapper className={className}>
      {subtypes.map((subtype) => (
        <Label key={subtype.key}>
          <Input
            type="radio"
            checked={subtype.key === selectedType.key}
            onChange={(e) => {
              const newKey = e.target.value
              const newSubtype = subtypes.find(
                (subtype) => subtype.key === newKey
              )
              const device = window.innerWidth > 1024 ? '桌機' : '手機平板'
              ReactGA.event({
                category: 'Projects',
                action: 'Click',
                label: `縣市議員切換： ${newSubtype.name} / ${device}`,
              })

              dispatch(electionActions.changeSubtype(newSubtype))
            }}
            value={subtype.key}
          />
          <Radio />
          {subtype.name}
        </Label>
      ))}
    </Wrapper>
  )
}
