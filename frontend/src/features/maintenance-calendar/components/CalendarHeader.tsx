import { Button } from '@/components/ui/button'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDateRange, getWeekNumber } from '../utils/calendarHelpers'

interface CalendarHeaderProps {
  currentDate: Date
  view: 'timeGridWeek' | 'timeGridDay' | 'dayGridMonth'
  onViewChange: (view: 'timeGridWeek' | 'timeGridDay' | 'dayGridMonth') => void
  onNavigate: (action: 'prev' | 'next' | 'today') => void
  onDateSelect: (date: Date) => void
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onNavigate,
}: CalendarHeaderProps) {
  const weekNumber = getWeekNumber(currentDate)
  
  // Calculate date range based on view
  const getDateRangeText = () => {
    if (view === 'timeGridDay') {
      return currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric' 
      })
    }
    
    if (view === 'timeGridWeek') {
      const start = new Date(currentDate)
      const day = start.getDay()
      const diff = start.getDate() - day + (day === 0 ? -6 : 1)
      start.setDate(diff)
      
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      
      return `Week ${weekNumber} • ${formatDateRange(start, end)}`
    }
    
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-slate-400" />
          <h1 className="text-2xl font-bold text-slate-100">Maintenance Calendar</h1>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('prev')}
            className="h-8 w-8 text-slate-400 hover:text-slate-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => onNavigate('today')}
            className="px-3 h-8 text-sm text-slate-300 hover:text-slate-100"
          >
            Today
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('next')}
            className="h-8 w-8 text-slate-400 hover:text-slate-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-slate-300 font-medium">
          {getDateRangeText()}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex bg-slate-800 rounded-lg border border-slate-700 p-1">
          <Button
            variant={view === 'timeGridDay' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('timeGridDay')}
            className={view === 'timeGridDay' ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-400 hover:text-slate-200'}
          >
            Day
          </Button>
          <Button
            variant={view === 'timeGridWeek' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('timeGridWeek')}
            className={view === 'timeGridWeek' ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-400 hover:text-slate-200'}
          >
            Week
          </Button>
          <Button
            variant={view === 'dayGridMonth' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('dayGridMonth')}
            className={view === 'dayGridMonth' ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-400 hover:text-slate-200'}
          >
            Month
          </Button>
        </div>
      </div>
    </div>
  )
}
