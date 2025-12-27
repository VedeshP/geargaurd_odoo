import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlyScrapData } from '../hooks/use-reporting-data'

interface ScrappedTrendChartProps {
  data: MonthlyScrapData[]
}

export function ScrappedTrendChart({ data }: ScrappedTrendChartProps) {
  const chartData = data.map((item) => ({
    month: item.month.split(' ')[0], // Show only month name
    count: item.count,
    fullMonth: item.month,
  }))

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Scrapped Equipment Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.fullMonth
              }
              return label
            }}
            formatter={(value: number | undefined) => [`${value || 0} equipment`, 'Scrapped']}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#818cf8"
            strokeWidth={3}
            dot={{ fill: '#818cf8', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-500 mt-4">
        Last 12 months • Equipment marked as Retired or Lost/Damaged
      </p>
    </div>
  )
}
