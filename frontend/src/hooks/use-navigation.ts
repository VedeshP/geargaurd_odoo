import type { AppView, NavigationParams } from '@/services/navigation-service'
import { navigationService } from '@/services/navigation-service'
import { useEffect, useState } from 'react'

export function useNavigation() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  const [navigationParams, setNavigationParams] = useState<NavigationParams | undefined>()
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    // Subscribe to navigation events
    const unsubscribe = navigationService.registerListener((context) => {
      setCurrentView(context.targetView)
      setNavigationParams(context.params)
      setCanGoBack(navigationService.canGoBack())
    })

    return unsubscribe
  }, [])

  const navigate = (targetView: AppView, params?: NavigationParams, onReturn?: (result?: any) => void) => {
    navigationService.navigate({
      sourceView: currentView,
      targetView,
      params,
      onReturn,
    })
  }

  const navigateToEquipment = (equipmentId?: string, action: 'create' | 'edit' | 'view' = 'view') => {
    navigate('equipment', {
      equipmentId,
      action: equipmentId ? action : 'create',
    })
  }

  const navigateToTeam = (teamId?: string, memberId?: string, action: 'create' | 'edit' | 'view' = 'view') => {
    navigate('teams', {
      teamId,
      memberId,
      action: teamId ? action : 'create',
      highlightId: memberId || teamId,
    })
  }

  const navigateToMaintenance = (requestId?: string, action: 'create' | 'edit' | 'view' = 'view') => {
    navigate('maintenance', {
      requestId,
      action: requestId ? action : 'create',
    })
  }

  const navigateToCategories = (categoryId?: string, action: 'create' | 'edit' | 'view' = 'view') => {
    navigate('equipment-categories', {
      categoryId,
      action: categoryId ? action : 'create',
    })
  }

  const navigateToDashboard = () => {
    navigate('dashboard')
  }

  const goBack = (result?: any) => {
    navigationService.goBack(result)
  }

  return {
    // Current state
    currentView,
    navigationParams,
    canGoBack,

    // Generic navigation
    navigate,

    // Specific navigation helpers
    navigateToEquipment,
    navigateToTeam,
    navigateToMaintenance,
    navigateToCategories,
    navigateToDashboard,

    // Navigation controls
    goBack,
  }
}
