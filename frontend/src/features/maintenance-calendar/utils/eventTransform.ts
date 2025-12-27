import type { MaintenanceRequest } from '@/stores/maintenance-store'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  backgroundColor: string
  borderColor: string
  textColor: string
  extendedProps: {
    requestId: string
    equipmentId: string
    technicianId?: string
    priority: string
    status: string
    equipmentName: string
    technicianName: string
    subject: string
    notes?: string
  }
}

const priorityColors = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
}

const statusBorderColors = {
  new: '#3b82f6',
  'in-progress': '#f59e0b',
  completed: '#10b981',
  overdue: '#ef4444',
}

/**
 * Calculate end time from start date and duration
 * Duration format: "HH:MM" (e.g., "02:30" = 2 hours 30 minutes)
 */
export const calculateEndTime = (startDate: string, duration?: string): Date => {
  const start = new Date(startDate)
  
  if (!duration) {
    // Default to 1 hour if no duration specified
    return new Date(start.getTime() + 60 * 60000)
  }

  const [hours, minutes] = duration.split(':').map(Number)
  return new Date(start.getTime() + (hours * 60 + minutes) * 60000)
}

/**
 * Transform maintenance request to FullCalendar event
 */
export const requestToCalendarEvent = (
  request: MaintenanceRequest,
  equipmentName: string,
  technicianName: string
): CalendarEvent | null => {
  // Only show scheduled requests on calendar
  if (!request.scheduledDate) {
    return null
  }

  return {
    id: request.id,
    title: `${request.subject}`,
    start: new Date(request.scheduledDate),
    end: calculateEndTime(request.scheduledDate, request.duration),
    backgroundColor: priorityColors[request.priority],
    borderColor: statusBorderColors[request.status],
    textColor: '#ffffff',
    extendedProps: {
      requestId: request.id,
      equipmentId: request.equipmentId,
      technicianId: request.technicianId,
      priority: request.priority,
      status: request.status,
      equipmentName,
      technicianName,
      subject: request.subject,
      notes: request.notes,
    },
  }
}

/**
 * Get priority color
 */
export const getPriorityColor = (priority: string): string => {
  return priorityColors[priority as keyof typeof priorityColors] || priorityColors.medium
}

/**
 * Get status color
 */
export const getStatusColor = (status: string): string => {
  return statusBorderColors[status as keyof typeof statusBorderColors] || statusBorderColors.new
}
