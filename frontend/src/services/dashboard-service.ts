import api from '@/lib/api'

interface DashboardMetrics {
  criticalEquipment: {
    count: number
    items: Array<{
      id: string
      name: string
      status: string
    }>
  }
  technicianLoad: {
    percentage: number
    totalTechnicians: number
    activeRequests: number
  }
  openRequests: {
    total: number
    overdue: number
    new: number
    inProgress: number
  }
}

export const dashboardService = {
  // Get dashboard metrics
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await api.get('/dashboard/metrics')
    return response.data.data
  },

  // Get dashboard statistics
  async getStatistics() {
    const response = await api.get('/dashboard/statistics')
    return response.data.data
  },
}
