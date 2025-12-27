import { forwardRef } from 'react'
import { MetricsSummary } from './components/MetricsSummary'
import { OverdueMetricCard } from './components/OverdueMetricCard'
import { ReportingHeader } from './components/ReportingHeader'
import { RequestsByCategoryChart } from './components/RequestsByCategoryChart'
import { RequestsByTeamChart } from './components/RequestsByTeamChart'
import { ScrappedTrendChart } from './components/ScrappedTrendChart'
import { useReportingData } from './hooks/use-reporting-data'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ReportingPageRef {
  // No actions needed - view only
}

export const ReportingPage = forwardRef<ReportingPageRef, object>(() => {
  const {
    dateRange,
    setDateRange,
    teamWorkload,
    categoryDistribution,
    overdueCount,
    scrappedTrend,
    summaryMetrics,
  } = useReportingData()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ReportingHeader dateRange={dateRange} onDateRangeChange={setDateRange} />
      
      <MetricsSummary
        totalRequests={summaryMetrics.totalRequests}
        activeRequests={summaryMetrics.activeRequests}
        overdueRequests={summaryMetrics.overdueRequests}
        avgCompletionTime={summaryMetrics.avgCompletionTime}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RequestsByTeamChart data={teamWorkload} />
        <RequestsByCategoryChart data={categoryDistribution} />
        <OverdueMetricCard count={overdueCount} />
        <ScrappedTrendChart data={scrappedTrend} />
      </div>
    </div>
  )
})

ReportingPage.displayName = 'ReportingPage'
