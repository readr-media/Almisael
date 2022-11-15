import { useCallback, useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  overflow: hidden;
  border: 1px solid #000;
  border-radius: ${({ collapse }) => (collapse ? `0 0 16px 16px;` : `unset`)};
`
const CollapseButton = styled.div`
  position: relative;
  padding: 0 11px 0 23px;
  height: 40px;
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`
const CollapseButtonTitle = styled.p`
  font-size: 16px;
  margin: 0;
`

const CollapseButtonIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CollapseButtonSpecialTitle = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CollapseContent = styled.div`
  max-height: ${({ collapse, scrollHeight }) =>
    collapse ? `${scrollHeight}px` : '0'};

  ${({ collapse, scrollHeight }) =>
    collapse
      ? `
        max-height: ${scrollHeight}px;
      `
      : `
        max-height: 0;
      `}
`

const downTriangle = (
  <svg
    width="14"
    height="12"
    viewBox="0 0 14 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 12L0.0717975 -1.30507e-06L13.9282 -9.36995e-08L7 12Z"
      fill="white"
    />
  </svg>
)

const upTriangle = (
  <svg
    width="14"
    height="12"
    viewBox="0 0 14 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 0L13.9282 12H0.0717969L7 0Z" fill="white" />
  </svg>
)

export const CollapsibleWrapper = ({
  children,
  title,
  className,
  preventCollapse,
  centerTitle,
}) => {
  const [collapse, setCollapse] = useState(true)
  const [scrollHeight, setScrollHeight] = useState(0)
  const buttonRef = useCallback((node) => {
    if (node && node.nextElementSibling) {
      const contentNode = node.nextElementSibling
      const resizeObserver = new ResizeObserver(() => {
        if (scrollHeight !== contentNode.scrollHeight) {
          setScrollHeight(contentNode.scrollHeight)
        }
      })

      resizeObserver.observe(node)
    }
  }, [])

  return (
    <Wrapper className={className} collapse={collapse}>
      <CollapseButton
        className="collapseBtn"
        onClick={() => {
          !preventCollapse && setCollapse((v) => !v)
        }}
        ref={buttonRef}
      >
        <CollapseButtonTitle>{title}</CollapseButtonTitle>
        <CollapseButtonIcon>
          {preventCollapse ? null : collapse ? downTriangle : upTriangle}
        </CollapseButtonIcon>
        {centerTitle && (
          <CollapseButtonSpecialTitle>{centerTitle}</CollapseButtonSpecialTitle>
        )}
      </CollapseButton>
      <CollapseContent collapse={collapse} scrollHeight={scrollHeight}>
        {children}
      </CollapseContent>
    </Wrapper>
  )
}
