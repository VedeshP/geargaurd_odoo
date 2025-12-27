import { useEquipmentStore } from '@/stores/equipment-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useTeamsStore } from '@/stores/teams-store'
import { useMemo, useState } from 'react'

export interface TeamWorkloadMetric {
  teamId: string
  teamName: string
  totalRequests: number
  activeRequests: number
  completedRequests: number
  overdueRequests: number
  avgCompletionTime: number
  workloadLevel: 'healthy' | 'busy' | 'overloaded'
}

export interface CategoryMetric {
  categoryId: string
  categoryName: string
  requestCount: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
  color: string
}

export interface MonthlyScrapData {
  month: string
  year: number
  monthIndex: number
  count: number
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4']

export function useReportingData() {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 7) // Default: last 7 days
    return { start, end }
  })

  const requests = useMaintenanceStore((state) => state.requests)
  const equipment = useEquipmentStore((state) => state.equipment)
  const teams = useTeamsStore((state) => state.teams)

  // Filter requests by date range
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (!req.isActive) return false
      const reqDate = new Date(req.createdAt)
      return reqDate >= dateRange.start && reqDate <= dateRange.end
    })
  }, [requests, dateRange])

  // Calculate team workload
  const teamWorkload = useMemo((): TeamWorkloadMetric[] => {
    return teams.map((team) => {
      const teamRequests = filteredRequests.filter((req) => req.teamId === team.id)
      const totalRequests = teamRequests.length
      const activeRequests = teamRequests.filter((req) => req.status === 'in-progress').length
      const completedRequests = teamRequests.filter((req) => req.status === 'completed').length
      const overdueRequests = teamRequests.filter((req) => {
        if (req.status === 'completed' || !req.scheduledDate) return false
        const scheduled = new Date(req.scheduledDate)
        return scheduled < new Date()
      }).length

      // Calculate average completion time (using updatedAt as completion date)
      const completedWithDates = teamRequests.filter(
        (req) => req.status === 'completed' && req.scheduledDate
      )
      const avgCompletionTime =
        completedWithDates.length > 0
          ? completedWithDates.reduce((sum, req) => {
              if (!req.scheduledDate) return sum
              const start = new Date(req.scheduledDate)
              const end = new Date(req.updatedAt)
              const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
              return sum + Math.max(0, days)
            }, 0) / completedWithDates.length
          : 0

      // Determine workload level
      let workloadLevel: 'healthy' | 'busy' | 'overloaded' = 'healthy'
      if (overdueRequests > 5) workloadLevel = 'overloaded'
      else if (overdueRequests > 2 || activeRequests > 10) workloadLevel = 'busy'

      return {
        teamId: team.id,
        teamName: team.name,
        totalRequests,
        activeRequests,
        completedRequests,
        overdueRequests,
        avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
        workloadLevel,
      }
    })
  }, [teams, filteredRequests])

  // Calculate category distribution
  const categoryDistribution = useMemo((): CategoryMetric[] => {
    const categoryMap = new Map<string, number>()

    filteredRequests.forEach((req) => {
      const equip = equipment.find((e) => e.id === req.equipmentId)
      if (equip) {
        const count = categoryMap.get(equip.category) || 0
        categoryMap.set(equip.category, count + 1)
      }
    })

    const total = filteredRequests.length || 1 // Avoid division by zero
    const metrics: CategoryMetric[] = Array.from(categoryMap.entries()).map(
      ([categoryName, count], index) => ({
        categoryId: categoryName,
        categoryName,
        requestCount: count,
        percentage: Math.round((count / total) * 100),
        trend: 'stable' as const, // TODO: Calculate trend when we have historical data
        color: COLORS[index % COLORS.length],
      })
    )

    return metrics.sort((a, b) => b.requestCount - a.requestCount)
  }, [filteredRequests, equipment])

  // Calculate overdue count
  const overdueCount = useMemo(() => {
    return requests.filter((req) => {
      if (!req.isActive || req.status === 'completed' || !req.scheduledDate) return false
      const scheduled = new Date(req.scheduledDate)
      return scheduled < new Date()
    }).length
  }, [requests])

  // Calculate scrapped trend (last 12 months)
  const scrappedTrend = useMemo((): MonthlyScrapData[] => {
    const now = new Date()
    const monthsData: MonthlyScrapData[] = []

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      const count = equipment.filter((eq) => {
        if (eq.status !== 'Retired' && eq.status !== 'Lost/Damaged') return false
        const updatedDate = new Date(eq.updatedAt)
        return (
          updatedDate.getFullYear() === date.getFullYear() &&
          updatedDate.getMonth() === date.getMonth()
        )
      }).length

      monthsData.push({
        month: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
        count,
      })
    }

    return monthsData
  }, [equipment])

  // Summary metrics
  const summaryMetrics = useMemo(() => {
    const totalRequests = filteredRequests.length
    const activeRequests = filteredRequests.filter((req) => req.status === 'in-progress').length
    
    const completedWithDates = filteredRequests.filter(
      (req) => req.status === 'completed' && req.scheduledDate
    )
    const avgCompletionTime =
      completedWithDates.length > 0
        ? completedWithDates.reduce((sum, req) => {
            if (!req.scheduledDate) return sum
            const start = new Date(req.scheduledDate)
            const end = new Date(req.updatedAt)
            const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            return sum + Math.max(0, days)
          }, 0) / completedWithDates.length
        : 0

    return {
      totalRequests,
      activeRequests,
      overdueRequests: overdueCount,
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
    }
  }, [filteredRequests, overdueCount])

  return {
    dateRange,
    setDateRange,
    teamWorkload,
    categoryDistribution,
    overdueCount,
    scrappedTrend,
    summaryMetrics,
  }
}
