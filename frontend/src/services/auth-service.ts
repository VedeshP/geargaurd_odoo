import api from '@/lib/api'

const COMPANY_ID = import.meta.env.VITE_COMPANY_ID || '49f3e36c-7eab-4840-92a4-7cc50a81cf62'

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  full_name: string
  company_id: string
  department_id?: string
  role?: 'manager' | 'technician' | 'employee'
}

export interface User {
  id: string
  email: string
  full_name: string
  role: 'manager' | 'technician' | 'employee'
  company_id: string
  department_id?: string
}

export interface LoginResponse {
  success: boolean
  data: {
    user: User
    token: string
    refreshToken: string
  }
}

export interface SignupResponse {
  id: string
  email: string
  full_name: string
  role: string
  company_id: string
  department_id?: string
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials)
      
      // Store tokens and user
      if (response.data.success && response.data.data) {
        localStorage.setItem('access_token', response.data.data.token)
        localStorage.setItem('refresh_token', response.data.data.refreshToken)
        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('refreshToken', response.data.data.refreshToken)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))
      }

      return response.data
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.')
    }
  }

  async signup(data: Omit<SignupRequest, 'company_id'>): Promise<SignupResponse> {
    try {
      const signupData: SignupRequest = {
        ...data,
        company_id: COMPANY_ID,
        role: data.role || 'employee',
      }
      
      const response = await api.post<SignupResponse>('/auth/signup', signupData)
      return response.data
    } catch (error: any) {
      console.error('Signup error:', error)
      throw new Error(error.response?.data?.message || 'Signup failed. Please try again.')
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token')
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token')
  }
}

export const authService = new AuthService()
