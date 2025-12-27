import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { CategoryMetric } from '../hooks/use-reporting-data'

interface RequestsByCategoryChartProps {
  data: CategoryMetric[]
}

export function RequestsByCategoryChart({ data }: RequestsByCategoryChartProps) {
  const chartData = data.map((category) => ({
    name: category.categoryName,
    value: category.requestCount,
    percentage: category.percentage,
  }))

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Requests by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label={(entry: any) => `${entry.percentage?.toFixed(0) || 0}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: number | undefined, name: string | undefined, props: any) => [
              `${value || 0} requests (${props.payload?.percentage || 0}%)`,
              name || '',
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
