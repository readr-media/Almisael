import React from 'react' // eslint-disable-line
import styled from '../styled-components.js'

const Button = styled.a`
  font-family: 'Source Han Sans Traditional', sans-serif;
  width: 100%;
  max-width: 396px;
  display: block;
  letter-spacing: 2.5px;
  font-size: 15px;
  font-weight: 700;
  padding: 12px 10px 12px;
  border-radius: 2px;
  text-align: center;
  transition: 0.3s;
  box-shadow: 3px 3px 0px 0px #04295e;
  border: 1px solid #f5ebff;
  text-decoration: none;
  color: #000928;
  background-color: #ebf02c;
  margin: 48px auto 52px;

  &:hover {
    background: #04295e;
    color: #ffffff;
  }

  @media (min-width: 576px) {
    margin: 60px auto 64px;
  }
`

/**
 * @param {Object} props
 * @param {string} [props.href='https://www.readr.tw/donate']
 * @param {string} [props.title='贊助 READr 一起媒體實驗改革']
 * @param {boolean} [props.openNewTab=true]
 * @param {string} [props.className='readr-donate-button']
 * @param {import("react").MouseEventHandler} [props.onClick]
 * @return {JSX.Element}
 */

export default function DonateButton({
  href = 'https://www.readr.tw/donate',
  title = '贊助 READr 一起媒體實驗改革',
  openNewTab = true,
  className = 'readr-donate-button',
  onClick,
}) {
  return (
    <Button
      className={className}
      href={href}
      target={openNewTab ? '_blank' : '_self'}
      rel="noopener noreferrer"
      onClick={onClick}
      aria-label="前往 READr 贊助頁面"
    >
      {title}
    </Button>
  )
}
