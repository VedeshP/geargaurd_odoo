import { AlertTriangle, ClipboardList, Users } from 'lucide-react'

interface MetricCardProps {
  title: string
  metric: string
  subtitle: string
  variant: 'critical' | 'info' | 'success'
  icon: React.ReactNode
  onClick?: () => void
}

const variantStyles = {
  critical: 'bg-gradient-to-br from-red-900 to-red-950 border-red-800 hover:from-red-800 hover:to-red-900',
  info: 'bg-gradient-to-br from-blue-900 to-blue-950 border-blue-800 hover:from-blue-800 hover:to-blue-900',
  success: 'bg-gradient-to-br from-green-900 to-green-950 border-green-800 hover:from-green-800 hover:to-green-900',
}

export function MetricCard({ title, metric, subtitle, variant, icon, onClick }: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        ${variantStyles[variant]}
        rounded-xl border p-6 transition-all duration-300 cursor-pointer
        hover:shadow-2xl hover:scale-105 hover:-translate-y-1
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-slate-200 text-sm font-medium mb-2">{title}</h3>
          <p className="text-white text-3xl font-bold mb-1">{metric}</p>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>
        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </div>
  )
}

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title="Critical Equipment"
        metric="5 Units"
        subtitle="(Health < 30%)"
        variant="critical"
        icon={<AlertTriangle className="h-6 w-6 text-white" />}
        onClick={() => console.log('View critical equipment')}
      />
      
      <MetricCard
        title="Technician Load"
        metric="86% Utilized"
        subtitle="(Assign Carefully)"
        variant="info"
        icon={<Users className="h-6 w-6 text-white" />}
        onClick={() => console.log('View technician workload')}
      />
      
      <MetricCard
        title="Open Requests"
        metric="12 Pending"
        subtitle="3 Overdue"
        variant="success"
        icon={<ClipboardList className="h-6 w-6 text-white" />}
        onClick={() => console.log('View open requests')}
      />
    </div>
  )
}
