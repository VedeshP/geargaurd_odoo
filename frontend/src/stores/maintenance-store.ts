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
    requestDate: '2025-12-27',
    notes: 'Monitor started flickering during important presentation',
    createdAt: '2025-12-27T08:00:00Z',
    updatedAt: '2025-12-27T08:00:00Z',
    isActive: true,
  },
  {
    id: 'req-2',
    subject: 'Routine Maintenance - Laptop',
    equipmentId: 'eq-2', // Reference to Acer Laptop
    teamId: '1',
    technicianId: '1', // Jose Mukari
    maintenanceFor: 'equipment',
    maintenanceType: 'preventive',
    priority: 'medium',
    status: 'in-progress',
    requestDate: '2025-12-26',
    scheduledDate: '2025-12-28T10:00',
    duration: '02:00',
    notes: 'Quarterly maintenance check',
    createdAt: '2025-12-26T09:00:00Z',
    updatedAt: '2025-12-27T09:00:00Z',
    isActive: true,
  },
  {
    id: 'req-3',
    subject: 'CNC Machine Calibration',
    equipmentId: 'eq-5', // Reference to CNC Machine
    teamId: '2', // Metrology
    technicianId: '2', // Marc Demo
    maintenanceFor: 'equipment',
    maintenanceType: 'preventive',
    priority: 'high',
    status: 'in-progress',
    requestDate: '2025-12-20',
    scheduledDate: '2025-12-27T14:00',
    duration: '01:00',
    notes: 'Annual calibration required',
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2025-12-27T10:00:00Z',
    isActive: true,
  },
  {
    id: 'req-4',
    subject: 'Keyboard Replacement',
    equipmentId: 'eq-3', // Reference to Mechanical Keyboard
    teamId: '1',
    technicianId: '1',
    maintenanceFor: 'equipment',
    maintenanceType: 'corrective',
    priority: 'low',
    status: 'new',
    requestDate: '2025-12-27',
    scheduledDate: '2025-12-30T09:00',
    duration: '00:30',
    notes: 'Some keys are not working properly',
    createdAt: '2025-12-27T11:00:00Z',
    updatedAt: '2025-12-27T11:00:00Z',
    isActive: true,
  },
  {
    id: 'req-5',
    subject: 'Printer Maintenance',
    equipmentId: 'eq-4', // Reference to HP Printer
    teamId: '1',
    technicianId: '3', // Joel Willis
    maintenanceFor: 'equipment',
    maintenanceType: 'preventive',
    priority: 'low',
    status: 'completed',
    requestDate: '2025-12-25',
    scheduledDate: '2025-12-26T14:00',
    duration: '01:00',
    notes: 'Monthly cleaning and ink cartridge check',
    instructions: 'Replace toner if below 20%',
    createdAt: '2025-12-25T08:00:00Z',
    updatedAt: '2025-12-26T15:30:00Z',
    isActive: true,
  },
  {
    id: 'req-6',
    subject: 'Network Equipment Check',
    equipmentId: 'eq-2',
    teamId: '1',
    technicianId: '1',
    maintenanceFor: 'equipment',
    maintenanceType: 'preventive',
    priority: 'medium',
    status: 'new',
    requestDate: '2025-12-22',
    scheduledDate: '2025-12-23T13:00',
    duration: '02:00',
    notes: 'Check network equipment and connectivity',
    createdAt: '2025-12-22T10:00:00Z',
    updatedAt: '2025-12-22T10:00:00Z',
    isActive: true,
  },
  {
    id: 'req-7',
    subject: 'Monitor Screen Cleaning',
    equipmentId: 'eq-1',
    teamId: '1',
    technicianId: '3',
    maintenanceFor: 'equipment',
    maintenanceType: 'preventive',
    priority: 'low',
    status: 'completed',
    requestDate: '2025-12-24',
    scheduledDate: '2025-12-24T10:00',
    duration: '00:15',
    notes: 'Routine cleaning service',
    createdAt: '2025-12-24T08:00:00Z',
    updatedAt: '2025-12-24T10:15:00Z',
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
