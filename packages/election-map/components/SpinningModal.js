import styled from 'styled-components'

const SpinningWrapper = styled.div`
  z-index: 1000;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: white;
  opacity: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SpinningIcon = styled.img`
  width: 60px;
  height: 60px;
  animation: rotate 1s ease-in-out infinite;

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`

export const SpinningModal = () => {
  return (
    <SpinningWrapper>
      <SpinningIcon src={'/images/spinning.svg'} />
    </SpinningWrapper>
  )
}
