import { useEffect, useState } from 'react'
import { AuthPage } from './features/auth/AuthPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { useUserStore } from './stores/user-store'

function App() {
  const { currentUser, isAuthenticated, initializeAuth } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state from localStorage on app load
    initializeAuth()
    setIsLoading(false)
  }, [initializeAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !currentUser) {
    return <AuthPage />
  }

  return <DashboardPage />
}

export default App
