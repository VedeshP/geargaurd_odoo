interface ChartData {
  label: string
  value: number
  color: string
}

interface BarChartProps {
  title: string
  data: ChartData[]
}

export function BarChart({ title, data }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
      
      <div className="space-y-4">
        {data.map((item) => {
          const percentage = (item.value / maxValue) * 100

          return (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className="text-slate-400">{item.value} requests</span>
              </div>
              
              <div className="relative h-8 bg-slate-800 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                >
                  {percentage > 15 && (
                    <span className="text-xs font-semibold text-white">
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500">No data available</p>
        </div>
      )}
    </div>
  )
}

interface DonutChartProps {
  title: string
  data: ChartData[]
  totalLabel?: string
}

export function DonutChart({ title, data, totalLabel = 'Total Requests' }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* Center circle with total */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{total}</div>
              <div className="text-sm text-slate-400">{totalLabel}</div>
            </div>
          </div>

          {/* Outer ring segments */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const previousPercentages = data
                .slice(0, index)
                .reduce((sum, d) => sum + (d.value / total) * 100, 0)
              
              const circumference = 2 * Math.PI * 40
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
              const strokeDashoffset = -((previousPercentages / 100) * circumference)

              return (
                <circle
                  key={item.label}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              )
            })}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((item) => {
          const percentage = ((item.value / total) * 100).toFixed(1)
          
          return (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-300">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{item.value}</span>
                <span className="text-xs text-slate-500">({percentage}%)</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
