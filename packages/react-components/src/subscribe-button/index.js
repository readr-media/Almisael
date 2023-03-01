import React from 'react' // eslint-disable-line
import styled from 'styled-components'

const Button = styled.a`
  font-family: 'Source Han Sans Traditional', sans-serif;
  width: 100%;
  max-width: 568px;
  display: block;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 2.5px;
  text-align: center;
  border: 1px solid #fff;
  color: #fff;
  border-radius: 2px;
  padding: 12px 24px;
  text-decoration: none;
  background-color: #04295e;
  margin: 48px auto;

  &:hover {
    background: #000928;
  }
`

/**
 * @param {Object} props
 * @param {string} [props.href='http://eepurl.com/gk-FF1']
 * @param {string} [props.title='訂閱電子報']
 * @param {boolean} [props.openNewTab=true]
 * @param {string} [props.className='readr-subscribe-button']
 * @param {import("react").MouseEventHandler} [props.onClick]
 * @return {JSX.Element}
 */

export default function SubscribeButton({
  href = 'http://eepurl.com/gk-FF1',
  title = '訂閱電子報',
  openNewTab = true,
  className = 'readr-subscribe-button',
  onClick,
}) {
  return (
    <Button
      className={className}
      href={href}
      target={openNewTab ? '_blank' : '_self'}
      rel="noopener noreferrer"
      onClick={onClick}
      aria-label="前往訂閱 READr 電子報頁面"
    >
      {title}
    </Button>
  )
}
