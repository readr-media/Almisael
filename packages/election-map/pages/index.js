import { Dashboard } from '../components/Dashboard'
import { LandingPage } from '../components/LandingPage'
import { NavBar } from '../components/NavBar'

export default function Home() {
  return (
    <>
      <NavBar />
      <LandingPage />
      <Dashboard />
    </>
  )
}
