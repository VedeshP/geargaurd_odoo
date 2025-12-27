import { useRef, useState } from 'react'
import { MaintenanceRequestModal } from '../maintenance/components/MaintenanceRequestModal'
import type { TeamsPageRef } from '../teams/TeamsPage'
import { TeamsPage } from '../teams/TeamsPage'
import { DashboardHeader } from './components/DashboardHeader'
import { DashboardMetrics } from './components/DashboardMetrics'
import { DashboardReports } from './components/DashboardReports'
import { MaintenanceRequestsTable } from './components/MaintenanceRequestsTable'

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState('maintenance')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const teamsPageRef = useRef<TeamsPageRef>(null)

  const handleNewClick = () => {
    if (activeTab === 'teams') {
      teamsPageRef.current?.openCreateModal()
    } else {
      setIsCreateModalOpen(true)
    }
  }

  const handleNavigateToTeams = () => {
    setActiveTab('teams')
    setIsCreateModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewRequest={handleNewClick}
      />

      {activeTab === 'teams' ? (
        <TeamsPage ref={teamsPageRef} />
      ) : (
        <main className="p-6 max-w-7xl mx-auto">
          <DashboardMetrics />
          <MaintenanceRequestsTable onNavigateToTeams={handleNavigateToTeams} />
          <DashboardReports />
        </main>
      )}

      {/* Create New Request Modal */}
      <MaintenanceRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onNavigateToTeams={handleNavigateToTeams}
      />
    </div>
  )
}
