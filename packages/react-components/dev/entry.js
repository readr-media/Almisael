import React from 'react' // eslint-disable-line
import styled from 'styled-components'
import { createRoot } from 'react-dom/client'
import {
  Logo,
  DonateButton,
  SubscribeButton,
  RelatedReport,
} from '../src/index.js'
import { reportsData } from './mock-reports.js'
import LogoTest from './icons/logo.js'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const Header = styled.div`
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
`

const PostClick = (post) => {
  console.log(post.name)
}

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
        <img src="./imgs/logo.png" />
      </Logo>

      <Logo className="logo-with-svg-component">
        <LogoTest />
      </Logo>
    </Header>

    <DonateButton />
    <SubscribeButton />
    <RelatedReport
      postData={reportsData}
      defaultImage="./imgs/default-post.svg"
      header="自訂大標"
      ariaLevel={2}
      headerClassName="自訂headerClassName"
      titleClassName="自訂titleClassName"
      highlightColor="red"
      postClickHandler={PostClick}
    />
  </>
)
