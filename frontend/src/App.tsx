import { useState } from 'react'
import { AuthPage } from './features/auth/AuthPage'
import { DashboardPage } from './features/dashboard/DashboardPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Set to true to show dashboard by default

  if (!isAuthenticated) {
    return <AuthPage />
  }

  return <DashboardPage />
}

export default App
