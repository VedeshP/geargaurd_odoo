import { useMaintenanceStore } from '@/stores/maintenance-store'
import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
  variant: 'danger' | 'warning' | 'success' | 'info'
}

const variantStyles = {
  danger: 'bg-gradient-to-br from-red-900 to-red-950 border-red-800',
  warning: 'bg-gradient-to-br from-yellow-900 to-yellow-950 border-yellow-800',
  success: 'bg-gradient-to-br from-green-900 to-green-950 border-green-800',
  info: 'bg-gradient-to-br from-blue-900 to-blue-950 border-blue-800',
}

function StatCard({ title, value, subtitle, icon, variant }: StatCardProps) {
  return (
    <div className={`${variantStyles[variant]} rounded-xl border p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-slate-200 text-sm font-medium mb-2">{title}</h3>
          <p className="text-white text-3xl font-bold mb-1">{value}</p>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>
        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </div>
  )
}

export function MaintenanceStats() {
  const requests = useMaintenanceStore((state) => state.requests)

  const stats = useMemo(() => {
    const activeRequests = requests.filter((r) => r.isActive)
    const total = activeRequests.length
    const overdue = activeRequests.filter((r) => r.status === 'overdue').length
    const inProgress = activeRequests.filter((r) => r.status === 'in-progress').length
    const completed = requests.filter((r) => r.status === 'completed').length
    const newRequests = activeRequests.filter((r) => r.status === 'new').length

    return {
      total,
      overdue,
      inProgress,
      completed,
      newRequests,
    }
  }, [requests])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Requests"
        value={stats.total}
        subtitle={`${stats.newRequests} new requests`}
        variant="info"
        icon={<TrendingUp className="h-6 w-6 text-white" />}
      />

      <StatCard
        title="Overdue"
        value={stats.overdue}
        subtitle="Requires immediate attention"
        variant="danger"
        icon={<AlertTriangle className="h-6 w-6 text-white" />}
      />

      <StatCard
        title="In Progress"
        value={stats.inProgress}
        subtitle="Currently being worked on"
        variant="warning"
        icon={<Clock className="h-6 w-6 text-white" />}
      />

      <StatCard
        title="Completed"
        value={stats.completed}
        subtitle="Successfully resolved"
        variant="success"
        icon={<CheckCircle2 className="h-6 w-6 text-white" />}
      />
    </div>
  )
}
