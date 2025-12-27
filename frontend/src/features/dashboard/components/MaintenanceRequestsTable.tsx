import { EntityLink } from '@/components/shared/EntityLink'
import { MaintenanceRequestModal } from '@/features/maintenance/components/MaintenanceRequestModal'
import { useEquipmentStore } from '@/stores/equipment-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useTeamsStore } from '@/stores/teams-store'
import { useMemo, useState } from 'react'

interface MaintenanceRequestsTableProps {
  onNavigateToTeams?: () => void
  onNavigateToEquipment?: (equipmentId?: string) => void
}

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
}

const statusColors = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'in-progress': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const statusLabels = {
  new: 'New Request',
  'in-progress': 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
}

export function MaintenanceRequestsTable({ onNavigateToTeams, onNavigateToEquipment }: MaintenanceRequestsTableProps) {
  // Get data from stores
  const allRequests = useMaintenanceStore((state) => state.requests)
  const requests = useMemo(() => allRequests.filter((r) => r.isActive), [allRequests])

  const equipment = useEquipmentStore((state) => state.equipment)
  const allMembers = useTeamsStore((state) => state.getAllMembers)
  const teams = useTeamsStore((state) => state.teams)

  const members = useMemo(() => allMembers(), [allMembers])

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Helper functions to get display names
  const getEquipmentName = (equipmentId: string) => {
    const eq = equipment.find((e) => e.id === equipmentId)
    return eq?.name || 'Unknown Equipment'
  }

  const getTechnicianName = (technicianId?: string) => {
    if (!technicianId) return 'Unassigned'
    const member = members.find((m) => m.userId === technicianId)
    return member?.name || 'Unknown'
  }

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId)
    return team?.name || 'Unknown Team'
  }

  const handleRowClick = (requestId: string) => {
    setSelectedRequestId(requestId)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">Priority</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">Equipment</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">Maintainer</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">Category</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">Status</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">Company</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr
                key={request.id}
                onClick={() => handleRowClick(request.id)}
                className={`
                  border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer
                  ${index === requests.length - 1 ? 'border-b-0' : ''}
                  ${request.status === 'overdue' ? 'bg-red-950/20' : ''}
                `}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${priorityColors[request.priority]}`} />
                    <span className="text-sm text-slate-300 capitalize">{request.priority}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <EntityLink
                    type="equipment"
                    id={request.equipmentId}
                    onClick={() => onNavigateToEquipment?.(request.equipmentId)}
                    className="text-sm font-medium"
                  >
                    {getEquipmentName(request.equipmentId)}
                  </EntityLink>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <EntityLink
                      type="teams"
                      id={request.technicianId || ''}
                      onClick={() => onNavigateToTeams?.()}
                      className="text-sm"
                    >
                      {getTechnicianName(request.technicianId)}
                    </EntityLink>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-slate-300">
                    {getTeamName(request.teamId)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                      ${statusColors[request.status]}
                    `}
                  >
                    {statusLabels[request.status]}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-slate-400">{request.subject}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {requests.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-400">No maintenance requests found</p>
          </div>
        )}
      </div>

      {/* Maintenance Request Modal */}
      <MaintenanceRequestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedRequestId(null)
        }}
        request={requests.find((r) => r.id === selectedRequestId)}
        mode="edit"
        onNavigateToTeams={onNavigateToTeams}
      />
    </>
  )
}
