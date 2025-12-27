import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTeamsStore } from '@/stores/teams-store'
import { Search, X } from 'lucide-react'
import { useMemo } from 'react'

interface MaintenanceFiltersProps {
  filters: {
    status: string[]
    priority: string[]
    teamId: string
    search: string
  }
  onFiltersChange: (filters: MaintenanceFiltersProps['filters']) => void
}

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-blue-500' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-yellow-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
  { value: 'overdue', label: 'Overdue', color: 'bg-red-500' },
]

const priorityOptions = [
  { value: 'high', label: 'High', color: 'bg-red-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'low', label: 'Low', color: 'bg-green-500' },
]

export function MaintenanceFilters({ filters, onFiltersChange }: MaintenanceFiltersProps) {
  const allTeams = useTeamsStore((state) => state.teams)
  const teams = useMemo(() => allTeams.filter((t) => t.isActive), [allTeams])

  const toggleStatus = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status]
    onFiltersChange({ ...filters, status: newStatus })
  }

  const togglePriority = (priority: string) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority]
    onFiltersChange({ ...filters, priority: newPriority })
  }

  const clearFilters = () => {
    onFiltersChange({
      status: [],
      priority: [],
      teamId: '',
      search: '',
    })
  }

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.teamId ||
    filters.search

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 mb-6">
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search by equipment, technician, or subject..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10 bg-slate-800 border-slate-700 text-slate-100"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 font-medium">Status:</span>
          <div className="flex gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleStatus(option.value)}
                className={`
                  px-3 py-1 rounded-full text-xs font-medium border transition-all
                  ${
                    filters.status.includes(option.value)
                      ? `${option.color} text-white border-transparent`
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 font-medium">Priority:</span>
          <div className="flex gap-2">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => togglePriority(option.value)}
                className={`
                  px-3 py-1 rounded-full text-xs font-medium border transition-all
                  ${
                    filters.priority.includes(option.value)
                      ? `${option.color} text-white border-transparent`
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Team Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 font-medium">Team:</span>
          <select
            value={filters.teamId}
            onChange={(e) => onFiltersChange({ ...filters, teamId: e.target.value })}
            className="px-3 py-1 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
