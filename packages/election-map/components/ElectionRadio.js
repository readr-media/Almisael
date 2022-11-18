import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

const Label = styled.label`
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  font-size: 24px;
  font-weight: 900;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &:first-of-type {
    margin-right: 5px;
  }
  & span:after {
    width: 16px;
    height: 16px;
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
  height: 24px;
  width: 24px;
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

export const ElectionRadio = ({ className, subtypeInfo }) => {
  const { subtype: selectedType, subtypes, onSubtypeChange } = subtypeInfo

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
              onSubtypeChange(newSubtype)
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
