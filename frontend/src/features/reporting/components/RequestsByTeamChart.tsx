import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TeamWorkloadMetric } from '../hooks/use-reporting-data'

interface RequestsByTeamChartProps {
  data: TeamWorkloadMetric[]
}

export function RequestsByTeamChart({ data }: RequestsByTeamChartProps) {
  const chartData = data.map((team) => ({
    name: team.teamName,
    requests: team.totalRequests,
    fill: team.workloadLevel === 'overloaded' ? '#ef4444' : team.workloadLevel === 'busy' ? '#f59e0b' : '#10b981',
  }))

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Requests by Team</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" stroke="#94a3b8" />
          <YAxis dataKey="name" type="category" stroke="#94a3b8" width={120} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
          />
          <Bar dataKey="requests" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-slate-400">Healthy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span className="text-slate-400">Busy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-slate-400">Overloaded</span>
        </div>
      </div>
    </div>
  )
}
