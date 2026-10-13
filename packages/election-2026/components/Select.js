import { useState, useRef } from 'react'
import * as RadixSelect from '@radix-ui/react-select'
import styled from 'styled-components'

const StyledTrigger = styled(RadixSelect.Trigger)`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 110px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #1b3f5c;
  background-color: white;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    box-shadow: 0 0 0 2px rgba(32, 116, 213, 0.2);
  }

  svg {
    display: block;
    transition: transform 0.2s ease-in-out;
    transform: rotate(180deg);
  }

  &[data-state='open'] svg {
    transform: rotate(0deg);
  }
`

const StyledContent = styled(RadixSelect.Content)`
  width: 200px;
  max-height: 320px;
  overflow: hidden;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #d8d8d8;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  z-index: 999;
`

const StyledViewport = styled(RadixSelect.Viewport)`
  max-height: inherit;
`

const StyledItem = styled(RadixSelect.Item)`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 15px;
  line-height: 24px;
  color: #4a4a4a;
  cursor: pointer;

  transition: background-color 0.1s, color 0.1s;

  &[data-highlighted] {
    background-color: #2074d5;
    color: white;
  }
  user-select: none;
  outline: none;
`

const DesignerArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
  >
    <path d="M0 6H10L5 0L0 6Z" fill="#2074D5" />
  </svg>
)

export default function Select({
  options = [],
  placeholder = '臺北市',
  value,
  onValueChange,
}) {
  const [open, setOpen] = useState(false)
  const isClosingRef = useRef(false)
  const triggerRef = useRef(null)

  return (
    <RadixSelect.Root
      value={value}
      onValueChange={onValueChange}
      open={open}
      onOpenChange={(nextOpen) => {
        if (isClosingRef.current) return
        setOpen(nextOpen)
      }}
    >
      <StyledTrigger
        ref={triggerRef}
        onPointerDown={() => {
          if (open) {
            isClosingRef.current = true
            setOpen(false)
            setTimeout(() => {
              isClosingRef.current = false
            }, 350)
          }
        }}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <DesignerArrow />
        </RadixSelect.Icon>
      </StyledTrigger>

      <RadixSelect.Portal>
        <StyledContent
          align="end"
          position="popper"
          sideOffset={4}
          onPointerDownOutside={(event) => {
            const originalEvent = event.detail?.originalEvent
            const rect = triggerRef.current?.getBoundingClientRect()
            const clientX = originalEvent?.clientX
            const clientY = originalEvent?.clientY

            if (rect && clientX !== undefined && clientY !== undefined) {
              const isInsideTrigger =
                clientX >= rect.left &&
                clientX <= rect.right &&
                clientY >= rect.top &&
                clientY <= rect.bottom

              if (isInsideTrigger) {
                event.preventDefault()
                isClosingRef.current = true
                setOpen(false)
                setTimeout(() => {
                  isClosingRef.current = false
                }, 350)
              }
            }
          }}
        >
          <StyledViewport>
            {options.map((opt) => (
              <StyledItem key={opt.value} value={opt.value}>
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
              </StyledItem>
            ))}
          </StyledViewport>
        </StyledContent>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}
