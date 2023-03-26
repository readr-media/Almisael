import React from 'react' // eslint-disable-line
import styled from '../styled-components.js'

import { ReadrIcon } from './react-components/icon.js'

const ReadrLogo = styled.a`
  margin: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 42px;
  height: auto;

  > svg,
  img {
    width: 100%;
    height: 100%;
    display: block;
  }

  @media (min-width: 576px) {
    margin: 16px 24px;
    width: 48px;
  }
`

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.href='https://www.readr.tw/']
 * @param {string} [props.iconStyle='original']
 * @param {boolean} [props.openNewTab=true]
 * @param {string} [props.className='readr-logo']
 * @param {import("react").MouseEventHandler} [props.onClick]
 * @return {JSX.Element}
 */

export default function Logo({
  children,
  href = 'https://www.readr.tw/',
  iconStyle = 'original',
  openNewTab = true,
  className = 'readr-logo',
  onClick,
}) {
  let iconColor

  switch (iconStyle) {
    case 'original':
      break
    case 'black':
      iconColor = '#000000'
      break
    case 'white':
      iconColor = '#ffffff'
      break
    default:
      break
  }

  return (
    <ReadrLogo
      className={className}
      href={href}
      target={openNewTab ? '_blank' : '_self'}
      rel="noopener noreferrer"
      onClick={onClick}
      aria-label="前往 READr 首頁"
    >
      {children ?? <ReadrIcon iconColor={iconColor} />}
    </ReadrLogo>
  )
}
