import { useEquipmentStore } from '@/stores/equipment-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useTeamsStore } from '@/stores/teams-store'
import { AlertTriangle, ClipboardList, Users } from 'lucide-react'
import { useMemo } from 'react'

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
  // Get real data from stores
  const equipment = useEquipmentStore((state) => state.equipment)
  const requests = useMaintenanceStore((state) => state.requests)
  const getAllMembers = useTeamsStore((state) => state.getAllMembers)
  
  const members = useMemo(() => getAllMembers(), [getAllMembers])

  // Calculate critical equipment (Out of Service or Lost/Damaged)
  const criticalEquipment = useMemo(() => {
    return equipment.filter(eq => 
      eq.isActive && (eq.status === 'Out of Service' || eq.status === 'Lost/Damaged')
    ).length
  }, [equipment])

  // Calculate technician load (active requests / total technicians)
  const technicianLoad = useMemo(() => {
    if (members.length === 0) return 0
    const activeRequests = requests.filter(r => r.isActive && r.status === 'in-progress').length
    return Math.round((activeRequests / members.length) * 100)
  }, [requests, members])

  // Calculate open and overdue requests
  const openRequests = useMemo(() => {
    return requests.filter(r => r.isActive && (r.status === 'new' || r.status === 'in-progress')).length
  }, [requests])

  const overdueRequests = useMemo(() => {
    return requests.filter(r => r.isActive && r.status === 'overdue').length
  }, [requests])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title="Critical Equipment"
        metric={`${criticalEquipment} Units`}
        subtitle="(Out of Service / Damaged)"
        variant="critical"
        icon={<AlertTriangle className="h-6 w-6 text-white" />}
        onClick={() => console.log('View critical equipment')}
      />
      
      <MetricCard
        title="Technician Load"
        metric={`${technicianLoad}% Utilized`}
        subtitle={`${members.length} Active Technicians`}
        variant="info"
        icon={<Users className="h-6 w-6 text-white" />}
        onClick={() => console.log('View technician workload')}
      />
      
      <MetricCard
        title="Open Requests"
        metric={`${openRequests} Pending`}
        subtitle={`${overdueRequests} Overdue`}
        variant="success"
        icon={<ClipboardList className="h-6 w-6 text-white" />}
        onClick={() => console.log('View open requests')}
      />
    </div>
  )
}
