/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/api'
import type { MaintenancePriority, MaintenanceRequest, MaintenanceStatus } from '@/stores/maintenance-store'

// Priority mapping: Frontend (string) ↔ Backend (number)
const PRIORITY_MAP: Record<MaintenancePriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
}

const PRIORITY_REVERSE_MAP: Record<number, MaintenancePriority> = {
  1: 'low',
  2: 'medium',
  3: 'high',
}

// Status mapping: Frontend ↔ Backend
const STATUS_MAP: Record<MaintenanceStatus, string> = {
  'new': 'new',
  'in-progress': 'in_progress',
  'completed': 'repaired',
  'overdue': 'new', // Overdue is computed on backend
}

const STATUS_REVERSE_MAP: Record<string, MaintenanceStatus> = {
  'new': 'new',
  'in_progress': 'in-progress',
  'repaired': 'completed',
}

interface MaintenanceFilters {
  status?: MaintenanceStatus
  priority?: MaintenancePriority
  equipmentId?: string
  teamId?: string
  isActive?: boolean
  page?: number
  limit?: number
}

interface MaintenanceRequestPayload {
  subject: string
  equipment_id: string
  team_id: string
  technician_id?: string
  category_id?: string
  company_id?: string
  maintenance_for: 'equipment' | 'work_center'
  work_center?: string
  maintenance_type: 'corrective' | 'preventive'
  priority: number
  stage: string
  request_date: string
  scheduled_date?: string
  duration_hours?: number
  description?: string
  instructions?: string
  is_blocked?: boolean
  is_archived?: boolean
}

export const maintenanceService = {
  // Get all maintenance requests
  async getRequests(filters?: MaintenanceFilters) {
    const params = new URLSearchParams()
    
    if (filters?.status) {
      params.append('status', filters.status)
    }
    if (filters?.priority) {
      params.append('priority', filters.priority)
    }
    if (filters?.equipmentId) {
      params.append('equipmentId', filters.equipmentId)
    }
    if (filters?.teamId) {
      params.append('teamId', filters.teamId)
    }
    if (filters?.isActive !== undefined) {
      params.append('isActive', filters.isActive.toString())
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString())
    }

    const response = await api.get(`/maintenance/requests?${params.toString()}`)
    
    // Transform backend response to frontend format
    const requests = response.data.data.requests.map((req: any) => ({
      id: req.id,
      subject: req.subject,
      equipmentId: req.equipment_id,
      teamId: req.team_id,
      technicianId: req.technician_id,
      categoryId: req.category_id,
      companyId: req.company_id,
      maintenanceFor: req.maintenance_for,
      workCenter: req.work_center,
      maintenanceType: req.maintenance_type,
      priority: PRIORITY_REVERSE_MAP[req.priority] || 'medium',
      status: STATUS_REVERSE_MAP[req.stage] || 'new',
      requestDate: req.request_date,
      scheduledDate: req.scheduled_date,
      duration: req.duration_hours ? `${String(Math.floor(req.duration_hours)).padStart(2, '0')}:${String((req.duration_hours % 1) * 60).padStart(2, '0')}` : undefined,
      notes: req.description,
      instructions: req.instructions,
      isBlocked: req.is_blocked,
      isArchived: req.is_archived,
      createdAt: req.created_at,
      updatedAt: req.updated_at,
      isActive: req.is_active,
    }))

    return {
      requests,
      pagination: response.data.data.pagination,
    }
  },

  // Get single maintenance request
  async getRequest(id: string) {
    const response = await api.get(`/maintenance/requests/${id}`)
    const req = response.data.data

    return {
      id: req.id,
      subject: req.subject,
      equipmentId: req.equipment_id,
      teamId: req.team_id,
      technicianId: req.technician_id,
      categoryId: req.category_id,
      companyId: req.company_id,
      maintenanceFor: req.maintenance_for,
      workCenter: req.work_center,
      maintenanceType: req.maintenance_type,
      priority: PRIORITY_REVERSE_MAP[req.priority] || 'medium',
      status: STATUS_REVERSE_MAP[req.stage] || 'new',
      requestDate: req.request_date,
      scheduledDate: req.scheduled_date,
      duration: req.duration_hours ? `${String(Math.floor(req.duration_hours)).padStart(2, '0')}:${String((req.duration_hours % 1) * 60).padStart(2, '0')}` : undefined,
      notes: req.description,
      instructions: req.instructions,
      isBlocked: req.is_blocked,
      isArchived: req.is_archived,
      createdAt: req.created_at,
      updatedAt: req.updated_at,
      isActive: req.is_active,
    } as MaintenanceRequest
  },

  // Create maintenance request
  async createRequest(request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) {
    // Parse duration from HH:MM to hours
    let durationHours: number | undefined
    if (request.duration) {
      const [hours, minutes] = request.duration.split(':').map(Number)
      durationHours = hours + (minutes / 60)
    }

    const payload: MaintenanceRequestPayload = {
      subject: request.subject,
      equipment_id: request.equipmentId,
      team_id: request.teamId,
      technician_id: request.technicianId,
      category_id: request.categoryId,
      company_id: request.companyId,
      maintenance_for: request.maintenanceFor === 'work-center' ? 'work_center' : 'equipment',
      work_center: request.workCenter,
      maintenance_type: request.maintenanceType,
      priority: PRIORITY_MAP[request.priority],
      stage: STATUS_MAP[request.status],
      request_date: request.requestDate,
      scheduled_date: request.scheduledDate,
      duration_hours: durationHours,
      description: request.notes,
      instructions: request.instructions,
      is_blocked: request.isBlocked,
      is_archived: request.isArchived,
    }

    const response = await api.post('/maintenance/requests', payload)
    const req = response.data.data

    return {
      id: req.id,
      subject: req.subject,
      equipmentId: req.equipment_id,
      teamId: req.team_id,
      technicianId: req.technician_id,
      categoryId: req.category_id,
      companyId: req.company_id,
      maintenanceFor: req.maintenance_for,
      workCenter: req.work_center,
      maintenanceType: req.maintenance_type,
      priority: PRIORITY_REVERSE_MAP[req.priority] || 'medium',
      status: STATUS_REVERSE_MAP[req.stage] || 'new',
      requestDate: req.request_date,
      scheduledDate: req.scheduled_date,
      duration: req.duration_hours ? `${String(Math.floor(req.duration_hours)).padStart(2, '0')}:${String((req.duration_hours % 1) * 60).padStart(2, '0')}` : undefined,
      notes: req.description,
      instructions: req.instructions,
      isBlocked: req.is_blocked,
      isArchived: req.is_archived,
      createdAt: req.created_at,
      updatedAt: req.updated_at,
      isActive: req.is_active,
    } as MaintenanceRequest
  },

  // Update maintenance request
  async updateRequest(id: string, updates: Partial<MaintenanceRequest>) {
    const payload: Record<string, any> = {}

    if (updates.subject !== undefined) payload.subject = updates.subject
    if (updates.equipmentId !== undefined) payload.equipment_id = updates.equipmentId
    if (updates.teamId !== undefined) payload.team_id = updates.teamId
    if (updates.technicianId !== undefined) payload.technician_id = updates.technicianId
    if (updates.categoryId !== undefined) payload.category_id = updates.categoryId
    if (updates.maintenanceFor !== undefined) payload.maintenance_for = updates.maintenanceFor
    if (updates.workCenter !== undefined) payload.work_center = updates.workCenter
    if (updates.maintenanceType !== undefined) payload.maintenance_type = updates.maintenanceType
    if (updates.priority !== undefined) payload.priority = PRIORITY_MAP[updates.priority]
    if (updates.status !== undefined) payload.stage = STATUS_MAP[updates.status]
    if (updates.requestDate !== undefined) payload.request_date = updates.requestDate
    if (updates.scheduledDate !== undefined) payload.scheduled_date = updates.scheduledDate
    if (updates.duration !== undefined) {
      const [hours, minutes] = updates.duration.split(':').map(Number)
      payload.duration_hours = hours + (minutes / 60)
    }
    if (updates.notes !== undefined) payload.description = updates.notes
    if (updates.instructions !== undefined) payload.instructions = updates.instructions
    if (updates.isBlocked !== undefined) payload.is_blocked = updates.isBlocked
    if (updates.isArchived !== undefined) payload.is_archived = updates.isArchived

    const response = await api.patch(`/maintenance/requests/${id}`, payload)
    const req = response.data.data

    return {
      id: req.id,
      subject: req.subject,
      equipmentId: req.equipment_id,
      teamId: req.team_id,
      technicianId: req.technician_id,
      categoryId: req.category_id,
      companyId: req.company_id,
      maintenanceFor: req.maintenance_for,
      workCenter: req.work_center,
      maintenanceType: req.maintenance_type,
      priority: PRIORITY_REVERSE_MAP[req.priority] || 'medium',
      status: STATUS_REVERSE_MAP[req.stage] || 'new',
      requestDate: req.request_date,
      scheduledDate: req.scheduled_date,
      duration: req.duration_hours ? `${String(Math.floor(req.duration_hours)).padStart(2, '0')}:${String((req.duration_hours % 1) * 60).padStart(2, '0')}` : undefined,
      notes: req.description,
      instructions: req.instructions,
      isBlocked: req.is_blocked,
      isArchived: req.is_archived,
      createdAt: req.created_at,
      updatedAt: req.updated_at,
      isActive: req.is_active,
    } as MaintenanceRequest
  },

  // Delete maintenance request
  async deleteRequest(id: string) {
    const response = await api.delete(`/maintenance/requests/${id}`)
    return response.data
  },
}
