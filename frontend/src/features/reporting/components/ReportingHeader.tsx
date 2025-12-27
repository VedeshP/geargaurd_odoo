import { Calendar } from 'lucide-react';

interface ReportingHeaderProps {
  dateRange: { start: Date; end: Date }
  onDateRangeChange: (range: { start: Date; end: Date }) => void
}

export function ReportingHeader({ dateRange }: ReportingHeaderProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Reporting Dashboard</h1>
        <p className="text-slate-400">System health and performance metrics</p>
      </div>
      
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2">
        <Calendar className="h-4 w-4 text-slate-400" />
        <span className="text-sm text-slate-300">
          {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
        </span>
      </div>
    </div>
  )
}
