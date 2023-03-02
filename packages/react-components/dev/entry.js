import React from 'react' // eslint-disable-line
import styled from 'styled-components'
import { createRoot } from 'react-dom/client'
import { Logo, DonateButton, SubscribeButton, RelatedReport } from '../src'
import { reportsData } from './mock-reports'
import { Test } from './icons/test'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const Header = styled.div`
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;

  .default-logo {
    outline: 1px solid red;
    background: black;
  }
`

root.render(
  <>
    <Header>
      <Logo
        className="default-logo"
        iconStyle="black"
        href="/"
        openNewTab={false}
      />

      <Logo className="logo-with-img">
        <img src="./imgs/test.png" />
      </Logo>

      <Logo className="logo-with-svg-component">
        <Test />
      </Logo>
    </Header>

    <DonateButton />
    <SubscribeButton />
    <RelatedReport relatedData={reportsData} ariaLevel={3} />
  </>
)
