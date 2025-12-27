export type AppView =
  | 'dashboard'
  | 'maintenance'
  | 'calendar'
  | 'equipment'
  | 'equipment-categories'
  | 'teams'
  | 'reporting'

export interface NavigationParams {
  // Entity IDs for direct navigation
  equipmentId?: string
  teamId?: string
  memberId?: string
  requestId?: string
  categoryId?: string

  // Filters for list views
  teamFilter?: string
  statusFilter?: string
  categoryFilter?: string

  // Action to perform
  action?: 'create' | 'edit' | 'view'

  // Highlight specific item in list
  highlightId?: string
}

export interface NavigationContext {
  sourceView: AppView
  targetView: AppView
  params?: NavigationParams
  timestamp: number
  onReturn?: (result?: any) => void
}

type NavigationListener = (context: NavigationContext) => void

class NavigationService {
  private listeners: NavigationListener[] = []
  private history: NavigationContext[] = []
  private currentContext: NavigationContext | null = null

  /**
   * Navigate to a new view with context
   */
  navigate(context: Omit<NavigationContext, 'timestamp'>): void {
    const fullContext: NavigationContext = {
      ...context,
      timestamp: Date.now(),
    }

    // Store in history
    if (this.currentContext) {
      this.history.push(this.currentContext)
    }
    this.currentContext = fullContext

    // Notify all listeners
    this.listeners.forEach((listener) => {
      try {
        listener(fullContext)
      } catch (error) {
        console.error('Navigation listener error:', error)
      }
    })
  }

  /**
   * Go back to previous view
   */
  goBack(result?: any): void {
    const previousContext = this.history.pop()

    if (previousContext) {
      // Call onReturn callback if it exists
      if (previousContext.onReturn) {
        previousContext.onReturn(result)
      }

      // Navigate back
      this.currentContext = previousContext
      this.listeners.forEach((listener) => listener(previousContext))
    }
  }

  /**
   * Register a listener for navigation events
   * Returns an unsubscribe function
   */
  registerListener(callback: NavigationListener): () => void {
    this.listeners.push(callback)

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * Get current navigation context
   */
  getCurrentContext(): NavigationContext | null {
    return this.currentContext
  }

  /**
   * Get navigation history
   */
  getHistory(): NavigationContext[] {
    return [...this.history]
  }

  /**
   * Clear navigation history
   */
  clearHistory(): void {
    this.history = []
    this.currentContext = null
  }

  /**
   * Check if we can go back
   */
  canGoBack(): boolean {
    return this.history.length > 0
  }
}

// Export singleton instance
export const navigationService = new NavigationService()
