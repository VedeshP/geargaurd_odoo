<<<<<<< HEAD
import { useEquipmentStore } from '@/stores/equipment-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useTeamsStore } from '@/stores/teams-store'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { MaintenanceRequestModal } from '../maintenance/components/MaintenanceRequestModal'
import { CalendarHeader } from './components/CalendarHeader'
import { CalendarMiniWidget } from './components/CalendarMiniWidget'
import './styles/calendar.css'
import { requestToCalendarEvent } from './utils/eventTransform'

export interface MaintenanceCalendarPageRef {
  openCreateModal: () => void
}

export const MaintenanceCalendarPage = forwardRef<MaintenanceCalendarPageRef>((_props, ref) => {
  const calendarRef = useRef<FullCalendar>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'timeGridWeek' | 'timeGridDay' | 'dayGridMonth'>('timeGridWeek')
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [prefilledDate, setPrefilledDate] = useState<string | undefined>(undefined)

  // Get data from stores
  const allRequests = useMaintenanceStore((state) => state.requests)
  const equipment = useEquipmentStore((state) => state.equipment)
  const allMembers = useTeamsStore((state) => state.getAllMembers)

  const members = useMemo(() => allMembers(), [allMembers])

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    openCreateModal: () => setIsCreateModalOpen(true),
  }))

  // Transform requests to calendar events
  const events = useMemo(() => {
    return allRequests
      .filter((request) => request.isActive && request.scheduledDate)
      .map((request) => {
        const eq = equipment.find((e) => e.id === request.equipmentId)
        const tech = members.find((m) => m.userId === request.technicianId)
        
        return requestToCalendarEvent(
          request,
          eq?.name || 'Unknown Equipment',
          tech?.name || 'Unassigned'
        )
      })
      .filter((event): event is NonNullable<typeof event> => event !== null)
  }, [allRequests, equipment, members])

  // Get unique scheduled dates for mini calendar
  const scheduledDates = useMemo(() => {
    return events.map((event) => new Date(event.start))
  }, [events])

  // Count unscheduled requests
  const unscheduledCount = useMemo(() => {
    return allRequests.filter((r) => r.isActive && !r.scheduledDate).length
  }, [allRequests])

  const handleNavigate = (action: 'prev' | 'next' | 'today') => {
    const calendarApi = calendarRef.current?.getApi()
    if (!calendarApi) return

    if (action === 'prev') {
      calendarApi.prev()
    } else if (action === 'next') {
      calendarApi.next()
    } else {
      calendarApi.today()
    }

    setCurrentDate(calendarApi.getDate())
  }

  const handleViewChange = (newView: 'timeGridWeek' | 'timeGridDay' | 'dayGridMonth') => {
    setView(newView)
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.changeView(newView)
    }
  }

  const handleDateSelect = (date: Date) => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.gotoDate(date)
      setCurrentDate(date)
    }
  }

  const handleEventClick = (info: { event: { extendedProps: Record<string, unknown> } }) => {
    const requestId = info.event.extendedProps.requestId as string
    setSelectedRequest(requestId)
    setIsModalOpen(true)
  }

  const handleDateClick = (info: { dateStr: string }) => {
    // When user clicks on a time slot, open create modal with pre-filled date/time
    setPrefilledDate(info.dateStr)
    setIsCreateModalOpen(true)
  }

  const handleDatesSet = (info: { view: { currentStart: Date } }) => {
    setCurrentDate(info.view.currentStart)
  }

  const handleNavigateToTeams = () => {
    // This will be handled by parent (DashboardPage)
  }

  return (
    <div className="flex gap-6 p-6 max-w-450 mx-auto h-[calc(100vh-80px)] bg-slate-950 overflow-hidden">
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={handleViewChange}
          onNavigate={handleNavigate}
          onDateSelect={handleDateSelect}
        />

        {/* Unscheduled Requests Notice */}
        {unscheduledCount > 0 && (
          <div className="mb-4 p-3 bg-amber-900/20 border border-amber-900/30 rounded-lg">
            <p className="text-sm text-amber-400">
              <strong>{unscheduledCount}</strong> maintenance {unscheduledCount === 1 ? 'request' : 'requests'} without scheduled date.
              View them in the Maintenance page.
            </p>
          </div>
        )}

        {/* Calendar */}
        <div className="flex-1 bg-slate-950 rounded-xl border border-slate-900 overflow-hidden">
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={false}
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            datesSet={handleDatesSet}
            height="100%"
            slotMinTime="11:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            nowIndicator={true}
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            slotDuration="01:00:00"
            slotLabelInterval="01:00"
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }}
            eventContent={(eventInfo) => {
              const { extendedProps } = eventInfo.event
              return (
                <div className="fc-event-main-content p-1">
                  <div className="text-xs font-semibold truncate">{eventInfo.timeText}</div>
                  <div className="text-xs truncate">{eventInfo.event.title}</div>
                  <div className="text-xs opacity-75 truncate">{extendedProps.technicianName}</div>
                </div>
              )
            }}
          />
        </div>
      </div>

      {/* Mini Calendar Sidebar */}
      <div className="w-80 shrink-0 flex flex-col gap-6 overflow-y-auto max-h-full">
        <CalendarMiniWidget
          currentDate={currentDate}
          scheduledDates={scheduledDates}
          onDateSelect={handleDateSelect}
        />

        {/* Legend */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Priority</h3>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-sm text-slate-400">High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span className="text-sm text-slate-400">Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-sm text-slate-400">Low Priority</span>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-slate-300 mt-3 mb-2">Status</h3>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 rounded" />
              <span className="text-sm text-slate-400">New</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-yellow-500 rounded" />
              <span className="text-sm text-slate-400">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-500 rounded" />
              <span className="text-sm text-slate-400">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-red-500 rounded" />
              <span className="text-sm text-slate-400">Overdue</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <MaintenanceRequestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedRequest(null)
        }}
        request={allRequests.find((r) => r.id === selectedRequest)}
        mode="edit"
        onNavigateToTeams={handleNavigateToTeams}
      />

      {/* Create Modal */}
      <MaintenanceRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setPrefilledDate(undefined)
        }}
        mode="create"
        onNavigateToTeams={handleNavigateToTeams}
        prefilledScheduledDate={prefilledDate}
      />
    </div>
  )
})
=======
import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Custom dark theme overrides
import './calendar-dark.css';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// Example events (replace with real scheduled requests)
const events = [
  {
    title: 'Scheduled Maintenance',
    start: new Date(2025, 11, 18, 10, 0),
    end: new Date(2025, 11, 18, 12, 0),
    allDay: false,
  },
  {
    title: 'Inspection',
    start: new Date(2025, 11, 16, 14, 0),
    end: new Date(2025, 11, 16, 15, 30),
    allDay: false,
  },
];

export function MaintenanceCalendarPage() {
  // Memoize default date to keep calendar stable
  const defaultDate = useMemo(() => new Date(2025, 11, 18), []);
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-200 mb-4">Maintenance Calendar</h2>
      <div className="bg-slate-900 rounded-lg shadow p-2 md:p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.WEEK}
          views={[Views.WEEK, Views.DAY, Views.MONTH]}
          style={{ height: 600, background: 'transparent', color: '#fff' }}
          defaultDate={defaultDate}
          popup
          toolbar
          selectable
          components={{
            // Optionally customize toolbar, event, etc.
          }}
        />
      </div>
    </main>
  );
}
>>>>>>> a9d4ded56e0aa8e2c4f44a854443d5a906f79770
