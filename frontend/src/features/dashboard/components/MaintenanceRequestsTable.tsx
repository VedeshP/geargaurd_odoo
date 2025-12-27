import { MaintenanceRequestModal } from '@/features/maintenance/components/MaintenanceRequestModal'
import { useState } from 'react'

interface MaintenanceRequest {
  id: string
  priority: 'high' | 'medium' | 'low'
  equipment: string
  maintainer: string
  category: string
  status: 'new' | 'in-progress' | 'completed' | 'overdue'
  company: string
}

interface MaintenanceRequestsTableProps {
  onNavigateToTeams?: () => void
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

const mockRequests: MaintenanceRequest[] = [
  {
    id: '1',
    priority: 'high',
    equipment: 'Critical Alert',
    maintainer: 'Joe Foster',
    category: 'Computer',
    status: 'new',
    company: 'Any Request',
  },
  {
    id: '2',
    priority: 'medium',
    equipment: 'Task activity',
    maintainer: 'Joe Foster',
    category: 'Generator',
    status: 'in-progress',
    company: 'Any Request',
  },
  {
    id: '3',
    priority: 'high',
    equipment: 'CNC Machine',
    maintainer: 'Sarah Johnson',
    category: 'Production',
    status: 'overdue',
    company: 'Production Dept',
  },
  {
    id: '4',
    priority: 'low',
    equipment: 'Office Printer',
    maintainer: 'Mike Chen',
    category: 'Office Equipment',
    status: 'completed',
    company: 'Administration',
  },
  {
    id: '5',
    priority: 'medium',
    equipment: 'HVAC System',
    maintainer: 'Joe Foster',
    category: 'Building',
    status: 'new',
    company: 'Facilities',
  },
]

export function MaintenanceRequestsTable({ onNavigateToTeams }: MaintenanceRequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRowClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request)
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
            {mockRequests.map((request, index) => (
              <tr
                key={request.id}
                onClick={() => handleRowClick(request)}
                className={`
                  border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer
                  ${index === mockRequests.length - 1 ? 'border-b-0' : ''}
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
                  <span className="text-sm text-slate-200 font-medium">{request.equipment}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-300">
                      {request.maintainer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-slate-300">{request.maintainer}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-slate-300">{request.category}</span>
                </td>
                <td className="py-4 px-6">
                  <span className={`
                    inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                    ${statusColors[request.status]}
                  `}>
                    {statusLabels[request.status]}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-slate-400">{request.company}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      
        {/* Empty state if no data */}
        {mockRequests.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-400">No maintenance requests found</p>
          </div>
        )}
      </div>

      {/* Maintenance Request Modal */}
      <MaintenanceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        mode="edit"
        onNavigateToTeams={onNavigateToTeams}
      />
    </>
  )
}
