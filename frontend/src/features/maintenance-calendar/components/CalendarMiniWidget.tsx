import { useMemo } from 'react'
import { isSameDay } from '../utils/calendarHelpers'

interface CalendarMiniWidgetProps {
  currentDate: Date
  scheduledDates: Date[]
  onDateSelect: (date: Date) => void
}

export function CalendarMiniWidget({
  currentDate,
  scheduledDates,
  onDateSelect,
}: CalendarMiniWidgetProps) {
  const today = new Date()
  
  // Get current month and year
  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()
  
  // Generate calendar grid
  const days = useMemo(() => {
    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    
    const daysArray: (number | null)[] = []
    
    // Add empty slots for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(null)
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day)
    }
    
    return daysArray
  }, [month, year])

  const hasScheduledMaintenance = (day: number): boolean => {
    const date = new Date(year, month, day)
    return scheduledDates.some((scheduledDate) => isSameDay(scheduledDate, date))
  }

  const isToday = (day: number): boolean => {
    const date = new Date(year, month, day)
    return isSameDay(date, today)
  }

  const isSelected = (day: number): boolean => {
    const date = new Date(year, month, day)
    return isSameDay(date, currentDate)
  }

  const handleDayClick = (day: number) => {
    const date = new Date(year, month, day)
    onDateSelect(date)
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
      <div className="text-center mb-3">
        <h3 className="text-sm font-semibold text-slate-300">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-slate-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const scheduled = hasScheduledMaintenance(day)
          const today = isToday(day)
          const selected = isSelected(day)

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`
                aspect-square flex items-center justify-center text-xs rounded-md transition-colors relative
                ${selected ? 'bg-red-500 text-white font-bold' : ''}
                ${today && !selected ? 'bg-blue-500/20 text-blue-400 font-semibold' : ''}
                ${!selected && !today ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : ''}
              `}
            >
              {day}
              {scheduled && !selected && (
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-sm" />
          <span className="text-slate-400">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500/20 border border-blue-500 rounded-sm" />
          <span className="text-slate-400">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-800 rounded-sm flex items-center justify-center">
            <div className="w-1 h-1 bg-blue-500 rounded-full" />
          </div>
          <span className="text-slate-400">Has maintenance</span>
        </div>
      </div>
    </div>
  )
}
