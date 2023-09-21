import React from 'react' // eslint-disable-line
import { createRoot } from 'react-dom/client'
import styled from 'styled-components'
import {
  DonateBtnRect,
  DonateButton,
  Logo,
  RelatedReport,
  SubscribeButton,
} from '../src/index.js'
import LogoTest from './icons/logo.js'
import { reportsData } from './mock-reports.js'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const Header = styled.div`
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;

  .donate-btn {
    width: 102px;
  }
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
      <DonateBtnRect href="/donate" openNewTab={false} className="donate-btn" />
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
