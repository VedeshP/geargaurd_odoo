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