import { useNavigation } from '@/hooks/use-navigation'
import { useEffect, useRef, useState } from 'react'
import { MaintenanceCalendarPage } from '../maintenance-calendar/MaintenanceCalendarPage';
import type { EquipmentCategoriesPageRef } from '../equipment-categories/EquipmentCategoriesPage'
import { EquipmentCategoriesPage } from '../equipment-categories/EquipmentCategoriesPage'
import type { EquipmentPageRef } from '../equipment/EquipmentPage'
import { EquipmentPage } from '../equipment/EquipmentPage'
import { MaintenanceRequestModal } from '../maintenance/components/MaintenanceRequestModal'
import type { TeamsPageRef } from '../teams/TeamsPage'
import { TeamsPage } from '../teams/TeamsPage'
import { DashboardHeader } from './components/DashboardHeader'
import { DashboardMetrics } from './components/DashboardMetrics'
import { DashboardReports } from './components/DashboardReports'
import { MaintenanceRequestsTable } from './components/MaintenanceRequestsTable'

export function DashboardPage() {
  const { currentView, navigationParams, navigate } = useNavigation()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const teamsPageRef = useRef<TeamsPageRef>(null)
  const equipmentPageRef = useRef<EquipmentPageRef>(null)
  const equipmentCategoriesPageRef = useRef<EquipmentCategoriesPageRef>(null)

  console.log('DashboardPage render - activeTab:', activeTab)

  const handleNewClick = () => {
    if (activeTab === 'teams') {
      teamsPageRef.current?.openCreateModal()
    } else if (activeTab === 'equipment') {
      equipmentPageRef.current?.openCreateModal()
    } else if (activeTab === 'equipment-categories') {
      equipmentCategoriesPageRef.current?.openCreateModal()
    } else {
      setIsCreateModalOpen(true)
    }
  }

  const handleNavigateToTeams = () => {
    setActiveTab('teams')
    setIsCreateModalOpen(false)
  }

  const handleNavigateToCategories = () => {
    setActiveTab('equipment-categories')
    setIsCreateModalOpen(false)
  }

  const handleNavigateToEquipment = (equipmentId?: string) => {
    setActiveTab('equipment')
    // Equipment page will handle opening the modal if equipmentId is provided
  }

  const handleNavigateToCalendar = () => {
    setActiveTab('calendar');
    setIsCreateModalOpen(false);
  };

  // Listen to navigation service events
  useEffect(() => {
    if (currentView && currentView !== activeTab) {
      console.log('Navigation service changed view to:', currentView)
      setActiveTab(currentView)
      
      // Handle specific actions based on navigation params
      if (navigationParams?.action === 'create') {
        // Open create modal for the current view
        if (currentView === 'teams') {
          teamsPageRef.current?.openCreateModal()
        } else if (currentView === 'equipment') {
          equipmentPageRef.current?.openCreateModal()
        } else if (currentView === 'equipment-categories') {
          equipmentCategoriesPageRef.current?.openCreateModal()
        } else if (currentView === 'maintenance') {
          setIsCreateModalOpen(true)
        }
      }
    }
  }, [currentView, navigationParams, activeTab])

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          console.log('Tab changed to:', tab)
          setActiveTab(tab)
          // Update navigation service to keep them in sync
          navigate(tab as any)
        }}
        onNewRequest={handleNewClick}
      />

      {activeTab === 'teams' ? (
        <TeamsPage ref={teamsPageRef} />
      ) : activeTab === 'equipment' ? (
        <EquipmentPage ref={equipmentPageRef} onNavigateToCategories={handleNavigateToCategories} />
      ) : activeTab === 'equipment-categories' ? (
        <EquipmentCategoriesPage ref={equipmentCategoriesPageRef} />
      ) : activeTab === 'reporting' ? (
        <main className="p-6 max-w-7xl mx-auto">
          <DashboardReports />
        </main>
      ) : activeTab === 'calendar' ? (
        <MaintenanceCalendarPage />
      ) : activeTab === 'dashboard' || activeTab === 'maintenance' ? (
        <main className="p-6 max-w-7xl mx-auto">
          <DashboardMetrics />
          <MaintenanceRequestsTable 
            onNavigateToTeams={handleNavigateToTeams}
            onNavigateToEquipment={handleNavigateToEquipment}
          />
          <DashboardReports />
        </main>
      ) : null}

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
