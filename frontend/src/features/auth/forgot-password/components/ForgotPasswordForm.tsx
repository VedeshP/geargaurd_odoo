import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => void
  onBackToSignIn: () => void
}

export function ForgotPasswordForm({ onSubmit, onBackToSignIn }: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <button
        type="button"
        onClick={onBackToSignIn}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 cursor-pointer transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to sign in
      </button>

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-500/10 p-2 rounded-lg">
            <Mail className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Reset your password</h3>
            <p className="text-sm text-slate-400">
              Enter your email and we'll send you a reset link
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-200">Email address</Label>
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
        <p className="text-xs text-slate-500 mt-2">
          We'll send you an email with instructions to reset your password
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
      </Button>

      <div className="text-center">
        <p className="text-sm text-slate-400">
          Remember your password?{' '}
          <button
            type="button"
            onClick={onBackToSignIn}
            className="text-blue-400 hover:text-blue-300 hover:underline font-medium cursor-pointer transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  )
}
