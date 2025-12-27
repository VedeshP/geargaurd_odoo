import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, User } from 'lucide-react'

interface DashboardHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onNewRequest: () => void
}

const tabs = [
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'calendar', label: 'Maintenance Calendar' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'reporting', label: 'Reporting' },
  { id: 'teams', label: 'Teams' },
]

export function DashboardHeader({ activeTab, onTabChange, onNewRequest }: DashboardHeaderProps) {
  return (
    <div className="bg-slate-900 border-b border-slate-800">
      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1 px-6 pt-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer
              ${activeTab === tab.id
                ? 'bg-slate-950 text-white border-t border-l border-r border-slate-800'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Action Bar */}
      <div className="bg-slate-950 px-6 py-4 flex items-center gap-4">
        <Button
          onClick={onNewRequest}
          variant="secondary"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          New
        </Button>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 bg-slate-900 border-slate-800"
          />
        </div>

        <button className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors cursor-pointer">
          <User className="h-5 w-5 text-slate-300" />
        </button>
      </div>
    </div>
  )
}
