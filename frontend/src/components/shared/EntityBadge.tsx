import { cn } from '@/lib/utils'
import type { AppView } from '@/services/navigation-service'

interface EntityBadgeProps {
  type: AppView
  id?: string
  label: string
  count?: number
  className?: string
  onClick?: () => void
  variant?: 'default' | 'outline' | 'secondary'
}

export function EntityBadge({
  type,
  id,
  label,
  count,
  className,
  onClick,
  variant = 'default',
}: EntityBadgeProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (!onClick) return
    e.stopPropagation()
    onClick()
  }

  const getColorClasses = () => {
    const base = {
      equipment: {
        default: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        outline: 'border-blue-500/40 text-blue-400 hover:bg-blue-500/10',
        secondary: 'bg-blue-500/5 text-blue-400 border-blue-500/10',
      },
      teams: {
        default: 'bg-green-500/10 text-green-400 border-green-500/20',
        outline: 'border-green-500/40 text-green-400 hover:bg-green-500/10',
        secondary: 'bg-green-500/5 text-green-400 border-green-500/10',
      },
      maintenance: {
        default: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        outline: 'border-purple-500/40 text-purple-400 hover:bg-purple-500/10',
        secondary: 'bg-purple-500/5 text-purple-400 border-purple-500/10',
      },
      'equipment-categories': {
        default: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        outline: 'border-orange-500/40 text-orange-400 hover:bg-orange-500/10',
        secondary: 'bg-orange-500/5 text-orange-400 border-orange-500/10',
      },
      dashboard: {
        default: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        outline: 'border-slate-500/40 text-slate-400 hover:bg-slate-500/10',
        secondary: 'bg-slate-500/5 text-slate-400 border-slate-500/10',
      },
    }

    return base[type]?.[variant] || base.dashboard[variant]
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border transition-colors',
        getColorClasses(),
        onClick && 'cursor-pointer hover:opacity-80',
        !onClick && 'cursor-default',
        className
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <>
          <span className="opacity-40">•</span>
          <span className="font-semibold">{count}</span>
        </>
      )}
    </button>
  )
}
