import { useNavigation } from '@/hooks/use-navigation'
import { useEffect, useRef, useState } from 'react'
import type { EquipmentCategoriesPageRef } from '../equipment-categories/EquipmentCategoriesPage'
import { EquipmentCategoriesPage } from '../equipment-categories/EquipmentCategoriesPage'
import type { EquipmentPageRef } from '../equipment/EquipmentPage'
import { EquipmentPage } from '../equipment/EquipmentPage'
import type { MaintenanceCalendarPageRef } from '../maintenance-calendar/MaintenanceCalendarPage'
import { MaintenanceCalendarPage } from '../maintenance-calendar/MaintenanceCalendarPage'
import type { MaintenancePageRef } from '../maintenance/MaintenancePage'
import { MaintenancePage } from '../maintenance/MaintenancePage'
import { ProfilePage } from '../profile/ProfilePage'
import type { ReportingPageRef } from '../reporting/ReportingPage'
import { ReportingPage } from '../reporting/ReportingPage'
import type { TeamsPageRef } from '../teams/TeamsPage'
import { TeamsPage } from '../teams/TeamsPage'
import { DashboardHeader } from './components/DashboardHeader'
import { DashboardMetrics } from './components/DashboardMetrics'
import { DashboardReports } from './components/DashboardReports'
import { MaintenanceRequestsTable } from './components/MaintenanceRequestsTable'

export function DashboardPage() {
  const { currentView, navigationParams, navigate } = useNavigation()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showProfile, setShowProfile] = useState(false)
  const teamsPageRef = useRef<TeamsPageRef>(null)
  const equipmentPageRef = useRef<EquipmentPageRef>(null)
  const equipmentCategoriesPageRef = useRef<EquipmentCategoriesPageRef>(null)
  const maintenancePageRef = useRef<MaintenancePageRef>(null)
  const calendarPageRef = useRef<MaintenanceCalendarPageRef>(null)
  const reportingPageRef = useRef<ReportingPageRef>(null)

  const handleNewClick = () => {
    if (activeTab === 'teams') {
      teamsPageRef.current?.openCreateModal()
    } else if (activeTab === 'equipment') {
      equipmentPageRef.current?.openCreateModal()
    } else if (activeTab === 'equipment-categories') {
      equipmentCategoriesPageRef.current?.openCreateModal()
    } else if (activeTab === 'maintenance') {
      maintenancePageRef.current?.openCreateModal()
    } else if (activeTab === 'calendar') {
      calendarPageRef.current?.openCreateModal()
    }
  }

  const handleNavigateToTeams = () => {
    setActiveTab('teams')
    navigate('teams')
  }

  const handleNavigateToCategories = () => {
    setActiveTab('equipment-categories')
    navigate('equipment-categories' as any)
  }

  const handleNavigateToEquipment = (_equipmentId?: string) => {
    setActiveTab('equipment')
    navigate('equipment')
    // Equipment page will handle opening the modal if equipmentId is provided
  }

  // Listen to navigation service events
  useEffect(() => {
    if (currentView && currentView !== activeTab) {
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
          maintenancePageRef.current?.openCreateModal()
        } else if (currentView === 'calendar') {
          calendarPageRef.current?.openCreateModal()
        }
      }
    }
  }, [currentView, navigationParams, activeTab])

  // Show profile page if requested
  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} />
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          // Update navigation service to keep them in sync
          navigate(tab as any)
        }}
        onNewRequest={handleNewClick}
        onProfileClick={() => setShowProfile(true)}
      />

      {activeTab === 'teams' ? (
        <TeamsPage ref={teamsPageRef} />
      ) : activeTab === 'equipment' ? (
        <EquipmentPage ref={equipmentPageRef} onNavigateToCategories={handleNavigateToCategories} />
      ) : activeTab === 'equipment-categories' ? (
        <EquipmentCategoriesPage ref={equipmentCategoriesPageRef} />
      ) : activeTab === 'reporting' ? (
        <ReportingPage ref={reportingPageRef} />
      ) : activeTab === 'calendar' ? (
        <MaintenanceCalendarPage ref={calendarPageRef} />
      ) : activeTab === 'maintenance' ? (
        <MaintenancePage ref={maintenancePageRef} />
      ) : activeTab === 'dashboard' ? (
        <main className="p-6 max-w-7xl mx-auto">
          <DashboardMetrics />
          <MaintenanceRequestsTable 
            onNavigateToTeams={handleNavigateToTeams}
            onNavigateToEquipment={handleNavigateToEquipment}
          />
          <DashboardReports />
        </main>
      ) : null}
    </div>
  )
}
