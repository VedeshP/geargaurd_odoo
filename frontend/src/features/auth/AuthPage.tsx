import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authService } from '@/services/auth-service'
import { useUserStore } from '@/stores/user-store'
import { Cog, Shield } from 'lucide-react'
import { useState } from 'react'
import { ForgotPasswordForm } from './forgot-password/components/ForgotPasswordForm'
import { SignInForm } from './sign-in/components/SignInForm'
import { SignUpForm } from './sign-up/components/SignUpForm'

type AuthMode = 'signin' | 'signup' | 'forgot-password'

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [error, setError] = useState<string | null>(null)
  const setCurrentUser = useUserStore((state) => state.setCurrentUser)

  const handleSignIn = async (data: any) => {
    try {
      setError(null)
      const response = await authService.login({
        email: data.email,
        password: data.password,
      })

      // Update user store
      setCurrentUser({
        id: response.data.user.id,
        name: response.data.user.full_name,
        email: response.data.user.email,
        role: response.data.user.role === 'employee' ? 'user' : response.data.user.role,
        company: 'My Company (San Francisco)',
      })

      // Reload to show dashboard
      window.location.reload()
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.'
      setError(errorMessage)
    }
  }

  const handleSignUp = async (data: any) => {
    try {
      setError(null)
      await authService.signup({
        email: data.email,
        password: data.password,
        full_name: data.name,
        role: 'employee',
      })

      // Show success and redirect to sign-in
      alert('Account created successfully! Please sign in with your credentials.')
      setMode('signin')
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Signup failed. Please try again.'
      setError(errorMessage)
    }
  }

  const handleForgotPassword = () => {
    setMode('forgot-password')
  }

  const handleForgotPasswordSubmit = async (data: any) => {
    // TODO: Implement actual forgot password logic
    alert(`Password reset link sent to ${data.email}. Please check your email.`)
    setMode('signin')
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white p-12 border-r border-slate-800">
        <div className="max-w-md space-y-8">
          <div className="flex items-center gap-3">
            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
              <Shield className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">GearGaurd</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold leading-tight">
              Equipment Management Made Simple
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Track, maintain, and optimize your equipment lifecycle with powerful tools designed for modern teams.
            </p>
          </div>

          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-3">
              <div className="bg-white/5 p-2 rounded-lg mt-1 border border-white/10">
                <Cog className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-time Tracking</h3>
                <p className="text-slate-400 text-sm">
                  Monitor equipment status and maintenance schedules in real-time
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-white/5 p-2 rounded-lg mt-1 border border-white/10">
                <Cog className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Team Collaboration</h3>
                <p className="text-slate-400 text-sm">
                  Seamlessly coordinate maintenance tasks across your team
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-white/5 p-2 rounded-lg mt-1 border border-white/10">
                <Cog className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Smart Analytics</h3>
                <p className="text-slate-400 text-sm">
                  Get insights into equipment performance and maintenance costs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="flex items-center justify-center p-8 bg-slate-900">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">GearGaurd</h1>
          </div>

          <Card className="border border-slate-800 shadow-2xl bg-slate-900/50 backdrop-blur">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-2xl font-bold text-center text-white">
                {mode === 'signin' 
                  ? 'Welcome back' 
                  : mode === 'signup' 
                  ? 'Create an account'
                  : 'Reset password'}
              </CardTitle>
              <CardDescription className="text-center text-slate-400">
                {mode === 'signin'
                  ? 'Enter your credentials to access your account'
                  : mode === 'signup'
                  ? 'Enter your information to get started'
                  : 'We\'ll help you get back into your account'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-900/30 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
              {mode === 'signin' ? (
                <SignInForm
                  onSignIn={handleSignIn}
                  onForgotPassword={handleForgotPassword}
                  onSwitchToSignUp={() => {
                    setMode('signup')
                    setError(null)
                  }}
                />
              ) : mode === 'signup' ? (
                <SignUpForm
                  onSignUp={handleSignUp}
                  onSwitchToSignIn={() => {
                    setMode('signin')
                    setError(null)
                  }}
                />
              ) : (
                <ForgotPasswordForm
                  onSubmit={handleForgotPasswordSubmit}
                  onBackToSignIn={() => {
                    setMode('signin')
                    setError(null)
                  }}
                />
              )}
            </CardContent>
          </Card>

          <p className="text-center text-sm text-slate-500 mt-6">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-400 hover:underline cursor-pointer hover:text-blue-300 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-400 hover:underline cursor-pointer hover:text-blue-300 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
