import React from 'react' // eslint-disable-line
import styled from '../styled-components.js'

import { ReadrIcon } from './react-components/icon.js'

const ReadrLogo = styled.a`
  margin: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  height: 40px;

  > svg,
  img {
    width: 100%;
    height: 100%;
    display: block;
  }

  @media (min-width: 576px) {
    margin: 16px 24px;
    height: 48px;
  }
`

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.href='https://www.readr.tw/']
 * @param {'original' | 'black' | 'white'} [props.iconStyle='original']
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
  return (
    <ReadrLogo
      className={className}
      href={href}
      target={openNewTab ? '_blank' : '_self'}
      rel="noopener noreferrer"
      onClick={onClick}
      aria-label="前往 READr 首頁"
    >
      {children ?? <ReadrIcon iconStyle={iconStyle} />}
    </ReadrLogo>
  )
}
