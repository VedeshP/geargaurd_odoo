import { authService } from '@/services/auth-service'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'manager' | 'technician' | 'user'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  company?: string
}

interface UserStore {
  currentUser: User | null
  isAuthenticated: boolean
  setCurrentUser: (user: User) => void
  logout: () => void
  hasRole: (role: UserRole) => boolean
  isManager: () => boolean
  isTechnician: () => boolean
  initializeAuth: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      
      setCurrentUser: (user) => set({ 
        currentUser: user,
        isAuthenticated: !!user,
      }),
      
      logout: () => {
        authService.logout()
        set({ 
          currentUser: null,
          isAuthenticated: false,
        })
      },
      
      hasRole: (role) => {
        const { currentUser } = get()
        return currentUser?.role === role
      },
      
      isManager: () => {
        const { currentUser } = get()
        return currentUser?.role === 'manager'
      },
      
      isTechnician: () => {
        const { currentUser } = get()
        return currentUser?.role === 'technician'
      },

      initializeAuth: () => {
        const user = authService.getCurrentUser()
        const isAuth = authService.isAuthenticated()
        if (user && isAuth) {
          set({
            currentUser: {
              id: user.id,
              name: user.full_name,
              email: user.email,
              role: user.role === 'employee' ? 'user' : user.role,
              company: 'My Company (San Francisco)',
            },
            isAuthenticated: true,
          })
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
)