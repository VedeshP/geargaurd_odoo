import { cn } from '@/lib/utils'
import type { AppView } from '@/services/navigation-service'
import type { ReactNode } from 'react'

interface EntityLinkProps {
  type: AppView
  id?: string
  children: ReactNode
  className?: string
  onClick?: () => void
  showIcon?: boolean
  disabled?: boolean
}

export function EntityLink({
  type,
  id,
  children,
  className,
  onClick,
  showIcon = false,
  disabled = false,
}: EntityLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return

    e.stopPropagation()

    if (onClick) {
      onClick()
    }
  }

  const getHoverColor = () => {
    switch (type) {
      case 'equipment':
        return 'hover:text-blue-400'
      case 'teams':
        return 'hover:text-green-400'
      case 'maintenance':
        return 'hover:text-purple-400'
      case 'equipment-categories':
        return 'hover:text-orange-400'
      default:
        return 'hover:text-blue-400'
    }
  }

  if (!id || disabled) {
    return <span className={cn('text-slate-400', className)}>{children}</span>
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'text-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1 hover:underline',
        getHoverColor(),
        className
      )}
    >
      {children}
      {showIcon && (
        <svg
          className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </button>
  )
}
