import { BarChart, DonutChart } from './Charts'

// Mock data for requests per team
const requestsByTeam = [
  { label: 'Mechanics', value: 28, color: '#3b82f6' },
  { label: 'Electricians', value: 15, color: '#10b981' },
  { label: 'IT Support', value: 22, color: '#f59e0b' },
  { label: 'HVAC Team', value: 12, color: '#8b5cf6' },
  { label: 'Facilities', value: 8, color: '#ec4899' },
]

// Mock data for requests per equipment category
const requestsByCategory = [
  { label: 'Production Machines', value: 32, color: '#ef4444' },
  { label: 'Computers', value: 18, color: '#3b82f6' },
  { label: 'Vehicles', value: 14, color: '#10b981' },
  { label: 'Building Systems', value: 20, color: '#f59e0b' },
  { label: 'Office Equipment', value: 11, color: '#8b5cf6' },
]

export function DashboardReports() {
  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Analytics & Reports</h2>
        <button className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">
          View Detailed Reports →
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart 
          title="Requests per Team"
          data={requestsByTeam}
        />
        
        <DonutChart 
          title="Requests per Equipment Category"
          data={requestsByCategory}
          totalLabel="Total Requests"
        />
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
          <div className="text-sm text-slate-400 mb-1">Avg. Response Time</div>
          <div className="text-2xl font-bold text-white">2.4 hrs</div>
          <div className="text-xs text-green-400 mt-1">↓ 12% from last week</div>
        </div>

        <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
          <div className="text-sm text-slate-400 mb-1">Completion Rate</div>
          <div className="text-2xl font-bold text-white">94.2%</div>
          <div className="text-xs text-green-400 mt-1">↑ 3% from last week</div>
        </div>

        <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
          <div className="text-sm text-slate-400 mb-1">Total Requests</div>
          <div className="text-2xl font-bold text-white">85</div>
          <div className="text-xs text-slate-500 mt-1">This month</div>
        </div>

        <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
          <div className="text-sm text-slate-400 mb-1">Active Technicians</div>
          <div className="text-2xl font-bold text-white">24</div>
          <div className="text-xs text-slate-500 mt-1">On duty today</div>
        </div>
      </div>
    </div>
  )
}
