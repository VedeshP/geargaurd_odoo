import { create } from 'zustand'

export type MaintenancePriority = 'high' | 'medium' | 'low'
export type MaintenanceStatus = 'new' | 'in-progress' | 'completed' | 'overdue'
export type MaintenanceType = 'corrective' | 'preventive'

export interface MaintenanceRequest {
  id: string
  subject: string

  // Normalized references (IDs only)
  equipmentId: string
  teamId: string
  technicianId?: string
  categoryId?: string
  companyId?: string

  // Request details
  maintenanceFor: 'equipment' | 'work-center'
  workCenter?: string
  maintenanceType: MaintenanceType
  priority: MaintenancePriority
  status: MaintenanceStatus

  // Scheduling
  requestDate: string
  scheduledDate?: string
  duration?: string

  // Content
  notes?: string
  instructions?: string

  // Metadata
  isBlocked?: boolean
  isArchived?: boolean
  createdAt: string
  updatedAt: string
  isActive: boolean
}

interface MaintenanceStore {
  requests: MaintenanceRequest[]

  // CRUD operations
  addRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => void
  updateRequest: (id: string, updates: Partial<MaintenanceRequest>) => void
  deleteRequest: (id: string) => void
  getRequest: (id: string) => MaintenanceRequest | undefined

  // Query methods
  getRequestsByEquipment: (equipmentId: string) => MaintenanceRequest[]
  getRequestsByTeam: (teamId: string) => MaintenanceRequest[]
  getRequestsByTechnician: (technicianId: string) => MaintenanceRequest[]
  getActiveRequestForEquipment: (equipmentId: string) => MaintenanceRequest | undefined
  searchRequests: (query: string) => MaintenanceRequest[]

  // Statistics
  getRequestCountByStatus: (status: MaintenanceStatus) => number
  getRequestCountByTeam: (teamId: string) => number
  getRequestCountByTechnician: (technicianId: string) => number
}

// Mock data with normalized references
const mockRequests: MaintenanceRequest[] = [
  {
    id: 'req-1',
    subject: 'Critical Alert - Monitor Flickering',
    equipmentId: 'eq-1', // Reference to Samsung Monitor
    teamId: '1', // Internal Maintenance
    technicianId: '1', // Jose Mukari
    maintenanceFor: 'equipment',
    maintenanceType: 'corrective',
    priority: 'high',
    status: 'new',
    requestDate: '2024-12-27',
    notes: 'Monitor started flickering during important presentation',
    createdAt: '2024-12-27T08:00:00Z',
    updatedAt: '2024-12-27T08:00:00Z',
    isActive: true,
  },
  {
    id: 'req-2',
    subject: 'Routine Maintenance - Laptop',
    equipmentId: 'eq-2', // Reference to Acer Laptop
    teamId: '1',
    technicianId: '1', // Jose Mukari (changed from Mitchell Admin which doesn't exist)
    maintenanceFor: 'equipment',
    maintenanceType: 'preventive',
    priority: 'medium',
    status: 'in-progress',
    requestDate: '2024-12-26',
    scheduledDate: '2024-12-28T10:00',
    duration: '02:00',
    notes: 'Quarterly maintenance check',
    createdAt: '2024-12-26T09:00:00Z',
    updatedAt: '2024-12-27T09:00:00Z',
    isActive: true,
  },
  {
    id: 'req-3',
    subject: 'CNC Machine Calibration Overdue',
    equipmentId: 'eq-5', // Reference to CNC Machine
    teamId: '2', // Metrology
    technicianId: '2', // Marc Demo
    maintenanceFor: 'equipment',
    maintenanceType: 'preventive',
    priority: 'high',
    status: 'overdue',
    requestDate: '2024-12-20',
    scheduledDate: '2024-12-25T14:00',
    notes: 'Annual calibration is past due',
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-27T10:00:00Z',
    isActive: true,
  },
]

export const useMaintenanceStore = create<MaintenanceStore>((set, get) => ({
  requests: mockRequests,

  addRequest: (request) => {
    const now = new Date().toISOString()
    const newRequest: MaintenanceRequest = {
      ...request,
      id: `req-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      isActive: true,
    }
    set((state) => ({
      requests: [...state.requests, newRequest],
    }))
  },

  updateRequest: (id, updates) => {
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id
          ? { ...req, ...updates, updatedAt: new Date().toISOString() }
          : req
      ),
    }))
  },

  deleteRequest: (id) => {
    // Soft delete
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id
          ? { ...req, isActive: false, updatedAt: new Date().toISOString() }
          : req
      ),
    }))
  },

  getRequest: (id) => {
    return get().requests.find((req) => req.id === id && req.isActive)
  },

  getRequestsByEquipment: (equipmentId) => {
    return get().requests.filter(
      (req) => req.equipmentId === equipmentId && req.isActive
    )
  },

  getRequestsByTeam: (teamId) => {
    return get().requests.filter(
      (req) => req.teamId === teamId && req.isActive
    )
  },

  getRequestsByTechnician: (technicianId) => {
    return get().requests.filter(
      (req) => req.technicianId === technicianId && req.isActive
    )
  },

  getActiveRequestForEquipment: (equipmentId) => {
    return get().requests.find(
      (req) =>
        req.equipmentId === equipmentId &&
        req.status === 'in-progress' &&
        req.isActive
    )
  },

  searchRequests: (query) => {
    const lowerQuery = query.toLowerCase()
    return get().requests.filter(
      (req) =>
        req.isActive &&
        (req.subject.toLowerCase().includes(lowerQuery) ||
          req.notes?.toLowerCase().includes(lowerQuery) ||
          req.instructions?.toLowerCase().includes(lowerQuery))
    )
  },

  getRequestCountByStatus: (status) => {
    return get().requests.filter(
      (req) => req.status === status && req.isActive
    ).length
  },

  getRequestCountByTeam: (teamId) => {
    return get().requests.filter(
      (req) => req.teamId === teamId && req.isActive && req.status !== 'completed'
    ).length
  },

  getRequestCountByTechnician: (technicianId) => {
    return get().requests.filter(
      (req) =>
        req.technicianId === technicianId &&
        req.isActive &&
        req.status !== 'completed'
    ).length
  },
}))
