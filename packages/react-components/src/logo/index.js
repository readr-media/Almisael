import React from 'react' // eslint-disable-line
import styled from 'styled-components'

import { ReadrIcon } from './react-components/icon'

const ReadrLogo = styled.a`
  display: inline-block;
  margin: 12px 20px;
  width: 42px;

  svg {
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
 * @param {string} [props.pathColor='']
 * @param {string} [props.href='https://www.readr.tw/']
 * @param {boolean} [props.openNewTab=true]
 * @param {string} [props.className='readr-logo']
 * @param {import("react").MouseEventHandler} [props.onClick]
 * @return {JSX.Element}
 */

export default function Logo({
  href = 'https://www.readr.tw/',
  pathColor = '',
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
      <ReadrIcon pathColor={pathColor} />
    </ReadrLogo>
  )
}
