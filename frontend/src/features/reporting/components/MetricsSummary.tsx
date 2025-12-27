import { Activity, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'

interface MetricsSummaryProps {
  totalRequests: number
  activeRequests: number
  overdueRequests: number
  avgCompletionTime: number
}

export function MetricsSummary({
  totalRequests,
  activeRequests,
  overdueRequests,
  avgCompletionTime,
}: MetricsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Requests */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm font-medium">Total Requests</span>
          <Activity className="h-5 w-5 text-blue-400" />
        </div>
        <p className="text-3xl font-bold text-white">{totalRequests}</p>
        <p className="text-xs text-slate-500 mt-1">Last 7 days</p>
      </div>

      {/* Active Requests */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm font-medium">Active</span>
          <CheckCircle2 className="h-5 w-5 text-green-400" />
        </div>
        <p className="text-3xl font-bold text-white">{activeRequests}</p>
        <p className="text-xs text-slate-500 mt-1">In progress</p>
      </div>

      {/* Overdue */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm font-medium">Overdue</span>
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <p className={`text-3xl font-bold ${overdueRequests > 5 ? 'text-red-400' : overdueRequests > 2 ? 'text-yellow-400' : 'text-green-400'}`}>
          {overdueRequests}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {overdueRequests > 5 ? '⚠ Critical' : overdueRequests > 2 ? '⚠ Warning' : '✓ Healthy'}
        </p>
      </div>

      {/* Avg Time */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm font-medium">Avg Time</span>
          <Clock className="h-5 w-5 text-purple-400" />
        </div>
        <p className="text-3xl font-bold text-white">{avgCompletionTime}d</p>
        <p className="text-xs text-slate-500 mt-1">To completion</p>
      </div>
    </div>
  )
}
