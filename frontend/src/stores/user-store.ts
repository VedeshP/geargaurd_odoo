import { create } from 'zustand'

export type UserRole = 'user' | 'technician' | 'manager'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  company: string
}

interface UserStore {
  currentUser: User | null
  setCurrentUser: (user: User) => void
  logout: () => void
  hasRole: (role: UserRole) => boolean
  isManager: () => boolean
  isTechnician: () => boolean
}

// Mock user - change this when backend is integrated
const mockManager: User = {
  id: 'user-1',
  name: 'John Manager',
  email: 'john@company.com',
  role: 'manager',
  company: 'My Company (San Francisco)',
}

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: mockManager, // Default to manager for development
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  logout: () => set({ currentUser: null }),
  
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
}))
