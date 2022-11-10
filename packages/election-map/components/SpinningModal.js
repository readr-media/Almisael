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

const SpinningIcon = styled.div`
  width: 60px;
  height: 60px;
  animation: rotate 1s ease-in-out infinite;

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`

const spinningSvg = (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50.0002 32.5591H60V27.4408H50.0002V32.5591ZM33.8028 50.2638L36.8928 60L41.6481 58.4181L38.5581 48.6819L33.8028 50.2638ZM21.4418 48.6819L18.3518 58.4181L23.1071 60L26.1971 50.2638L21.4418 48.6819ZM12.3503 39.9646L4.26018 45.9817L7.19909 50.1227L15.2892 44.1056L12.3503 39.9646ZM9.99979 27.4408H0V32.5591H9.99979V27.4408ZM15.2891 15.8944L7.19898 9.87726L4.26008 14.0183L12.3502 20.0354L15.2891 15.8944ZM26.1972 9.73621L23.1072 0L18.3519 1.58186L21.4419 11.3181L26.1972 9.73621ZM38.5582 11.3181L41.6482 1.58186L36.8929 0L33.8029 9.73621L38.5582 11.3181ZM47.6497 20.0354L55.7398 14.0183L52.8009 9.87726L44.7108 15.8944L47.6497 20.0354Z"
      fill="black"
    />
  </svg>
)

export const SpinningModal = () => {
  return (
    <SpinningWrapper>
      <SpinningIcon>{spinningSvg}</SpinningIcon>
    </SpinningWrapper>
  )
}
