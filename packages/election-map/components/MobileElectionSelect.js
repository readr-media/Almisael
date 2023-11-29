import { useRef } from 'react'
import styled from 'styled-components'
import useClickOutside from '../hook/useClickOutside'
import { electionNamePairs } from './helper/election'
import ReactGA from 'react-ga'
import { useDispatch } from 'react-redux'
import { electionActions } from '../store/election-slice'

const closeSvg = (
  <svg
    width="12"
    height="15"
    viewBox="0 0 12 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.34 15H2.28L4.4 11.04C4.76 10.32 5.14 9.58 5.56 8.68H5.64C6.14 9.58 6.54 10.32 6.92 11.04L9.08 15H11.12L6.84 7.52L10.84 0.339999H8.9L6.92 4.1C6.56 4.78 6.28 5.38 5.88 6.24H5.8C5.34 5.38 5.02 4.78 4.64 4.1L2.66 0.339999H0.6L4.62 7.44L0.34 15Z"
      fill="white"
    />
  </svg>
)

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 203px;
  height: 100%;
  z-index: 1;
  background: rgba(11, 11, 11, 0.8);
`

const CloseButton = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
`

const Elections = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 46px;
`

const Election = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 21px;
  &:active {
    font-weight: 700;
  }
  ${({ selected }) => selected && `font-weight: 700;`}
`

export const MobileElectionSelect = ({ electionType, hideElectionSelect }) => {
  const wrapperRef = useRef(null)
  const dispatch = useDispatch()
  useClickOutside(wrapperRef, () => {
    hideElectionSelect()
  })
  return (
    <Wrapper ref={wrapperRef}>
      <CloseButton
        onClick={() => {
          hideElectionSelect()
        }}
      >
        {closeSvg}
      </CloseButton>
      <Elections>
        {electionNamePairs.map((electionNamePair) => (
          <Election
            key={electionNamePair.electionType}
            selected={electionNamePair.electionType === electionType}
            onClick={() => {
              if (electionNamePair.electionType !== electionType) {
                ReactGA.event({
                  category: 'Projects',
                  action: 'Click',
                  label: `選舉類別：${electionNamePair.electionName} / 手機平板`,
                })

                dispatch(
                  electionActions.changeElection(electionNamePair.electionType)
                )
              }
              hideElectionSelect()
            }}
          >
            {electionNamePair.electionName}
          </Election>
        ))}
      </Elections>
    </Wrapper>
  )
}
