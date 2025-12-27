import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type SignInFormData = z.infer<typeof signInSchema>

interface SignInFormProps {
  onSignIn: (data: SignInFormData) => void
  onForgotPassword: () => void
  onSwitchToSignUp: () => void
}

export function SignInForm({ onSignIn, onForgotPassword, onSwitchToSignUp }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSignIn)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-200">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-slate-200">Password</Label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            {...register('password')}
            className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>

      <div className="text-center text-sm text-slate-400">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-blue-400 hover:text-blue-300 hover:underline font-medium cursor-pointer transition-colors"
        >
          Sign up
        </button>
      </div>
    </form>
  )
}
