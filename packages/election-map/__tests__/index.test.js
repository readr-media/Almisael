import { render, screen } from '@testing-library/react'
jest.mock('d3', () => ({}))

const intersectionObserverMock = () => ({
  observe: () => null,
})
window.IntersectionObserver = jest
  .fn()
  .mockImplementation(intersectionObserverMock)

import Home from '../pages'
import '@testing-library/jest-dom'

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { name: 'First testing' })

    expect(heading).toBeInTheDocument()
  })
})
