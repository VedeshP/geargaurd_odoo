import { forwardRef, useImperativeHandle, useState } from 'react'
import { MaintenanceFilters } from './components/MaintenanceFilters'
import { MaintenanceRequestModal } from './components/MaintenanceRequestModal'
import { MaintenanceRequestsTable } from './components/MaintenanceRequestsTable'
import { MaintenanceStats } from './components/MaintenanceStats'

export interface MaintenancePageRef {
  openCreateModal: () => void
}

export const MaintenancePage = forwardRef<MaintenancePageRef>((_props, ref) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    teamId: '',
    search: '',
  })

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    openCreateModal: () => setIsCreateModalOpen(true),
  }))

  const handleNavigateToTeams = () => {
    // This will be handled by parent (DashboardPage)
  }

  const handleNavigateToEquipment = (_equipmentId?: string) => {
    // This will be handled by parent (DashboardPage)
  }

  return (
    <main className="p-6 max-w-7xl mx-auto">
      {/* Statistics Cards */}
      <MaintenanceStats />

      {/* Filters */}
      <MaintenanceFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Maintenance Requests Table */}
      <MaintenanceRequestsTable
        filters={filters}
        onNavigateToTeams={handleNavigateToTeams}
        onNavigateToEquipment={handleNavigateToEquipment}
      />

      {/* Create New Request Modal */}
      <MaintenanceRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onNavigateToTeams={handleNavigateToTeams}
      />
    </main>
  )
})
