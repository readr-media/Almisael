import React from 'react' // eslint-disable-line
import styled from 'styled-components'
import { createRoot } from 'react-dom/client'
import { Logo, DonateButton, SubscribeButton, RelatedReport } from '../src'
import { reportsData } from './mock-reports'

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

root.render(
  <>
    <Header>
      <Logo className="test" />
    </Header>

    <DonateButton />
    <SubscribeButton />
    <RelatedReport relatedData={reportsData} ariaLevel={3} />
  </>
)
