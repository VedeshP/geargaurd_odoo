import { AlertTriangle } from 'lucide-react'

interface OverdueMetricCardProps {
  count: number
}

export function OverdueMetricCard({ count }: OverdueMetricCardProps) {
  const getStatus = () => {
    if (count === 0) return { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: '✓ Healthy', icon: 'text-green-400' }
    if (count <= 2) return { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: '✓ On Track', icon: 'text-green-400' }
    if (count <= 5) return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: '⚠ Warning', icon: 'text-yellow-400' }
    return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: '⚠ Critical', icon: 'text-red-400' }
  }

  const status = getStatus()

  return (
    <div className={`bg-slate-900 border ${status.border} rounded-xl p-6 flex flex-col items-center justify-center h-full`}>
      <h3 className="text-lg font-semibold text-slate-100 mb-6">Overdue Tickets</h3>
      
      <div className={`${status.bg} rounded-full p-8 mb-6`}>
        <AlertTriangle className={`h-16 w-16 ${status.icon}`} />
      </div>
      
      <p className={`text-6xl font-bold ${status.color} mb-4`}>{count}</p>
      
      <div className="text-center">
        <p className="text-slate-400 text-sm mb-2">
          {count === 0 ? 'No overdue tickets' : count === 1 ? '1 ticket overdue' : `${count} tickets overdue`}
        </p>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
          {status.label}
        </span>
      </div>
    </div>
  )
}
