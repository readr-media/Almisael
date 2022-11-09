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

const CollapseButtonIcon = styled.img`
  width: 16px;
  height: 16px;
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

export const CollapsibleWrapper = ({ children, title, className }) => {
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
        onClick={() => {
          setCollapse((v) => !v)
        }}
        ref={buttonRef}
      >
        <CollapseButtonTitle>{title}</CollapseButtonTitle>
        <CollapseButtonIcon
          src={
            collapse ? '/images/down_triangle.svg' : '/images/up_triangle.svg'
          }
        />
      </CollapseButton>
      <CollapseContent collapse={collapse} scrollHeight={scrollHeight}>
        {children}
      </CollapseContent>
    </Wrapper>
  )
}
