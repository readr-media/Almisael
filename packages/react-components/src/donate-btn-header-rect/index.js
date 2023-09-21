import React from 'react'
import styled from 'styled-components'

const DonateLink = styled.a`
  font-family: 'Noto Sans TC', sans-serif;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: #000928;
  background-color: #fff;
  border: 1px solid #000928;
  border-radius: 2px;
  height: 40px;
  width: 104px;
  transition: background-color 0.2s ease-in-out;

  &:hover,
  &:active,
  &:focus {
    background-color: #ebf02c;
  }
`

/**
 * @param {Object} props
 * @param {string} [props.href='https://www.readr.tw/donate']
 * @param {string} [props.title='贊助我們']
 * @param {boolean} [props.openNewTab=true]
 * @param {string} [props.className='readr-donate-button']
 * @param {import("react").MouseEventHandler} [props.onClick]
 * @return {JSX.Element}
 */

export default function DonateBtnRect({
  href = 'https://www.readr.tw/donate',
  title = '贊助我們',
  openNewTab = true,
  className = 'readr-donate-button',
  onClick,
}) {
  return (
    <DonateLink
      href={href}
      target={openNewTab ? '_blank' : '_self'}
      rel="external nofollow"
      onClick={onClick}
      className={className}
      aria-label="前往 READr 贊助頁面"
    >
      {title}
    </DonateLink>
  )
}
