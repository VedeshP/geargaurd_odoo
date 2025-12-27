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

  // Hard-coded display names (for static demo)
  maintainerName?: string
  categoryName?: string

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
  isLoading: boolean
  error: string | null

  // CRUD operations (async)
  fetchRequests: (filters?: any) => Promise<void>
  addRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => Promise<void>
  updateRequest: (id: string, updates: Partial<MaintenanceRequest>) => Promise<void>
  deleteRequest: (id: string) => Promise<void>
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

// Mock data with normalized references (kept for reference)
const mockRequests: MaintenanceRequest[] = [
  {
    id: 'req-1',
    subject: 'Critical Alert - Monitor Flickering',
    equipmentId: 'eq-1', // Reference to Samsung Monitor
    teamId: '1', // Internal Maintenance
    technicianId: 'user-1', // Jose Mukari
    categoryId: 'cat-3', // Monitors
    maintainerName: 'Jose Mukari',
    categoryName: 'Monitors',
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
    technicianId: 'user-1', // Jose Mukari
    categoryId: 'cat-1', // Computers
    maintainerName: 'Jose Mukari',
    categoryName: 'Computers',
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
    technicianId: 'user-2', // Marc Demo
    categoryId: 'cat-8', // Production Machinery
    maintainerName: 'Marc Demo',
    categoryName: 'Production Machinery',
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
    equipmentId: 'eq-3', // Reference to HP Printer
    teamId: '1',
    technicianId: 'user-1',
    categoryId: 'cat-4', // Printers
    maintainerName: 'Jose Mukari',
    categoryName: 'Printers',
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
    equipmentId: 'eq-4', // Reference to Dell Server
    teamId: '1',
    technicianId: 'user-3', // Joel Willis
    categoryId: 'cat-5', // Servers
    maintainerName: 'Joel Willis',
    categoryName: 'Servers',
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
    technicianId: 'user-1',
    categoryId: 'cat-1', // Computers
    maintainerName: 'Jose Mukari',
    categoryName: 'Computers',
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
    categoryId: 'cat-3', // Monitors
    technicianId: 'user-3',
    maintainerName: 'Joel Willis',
    categoryName: 'Monitors',
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
  isLoading: false,
  error: null,

  fetchRequests: async () => {
    set({ isLoading: true, error: null })
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    set({ isLoading: false })
  },

  addRequest: async (request) => {
    set({ isLoading: true, error: null })
    await new Promise(resolve => setTimeout(resolve, 300))
    const newRequest: MaintenanceRequest = {
      ...request,
      id: 'req-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    }
    set((state) => ({
      requests: [...state.requests, newRequest],
      isLoading: false,
    }))
  },

  updateRequest: async (id, updates) => {
    set({ isLoading: true, error: null })
    await new Promise(resolve => setTimeout(resolve, 300))
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id ? { ...req, ...updates, updatedAt: new Date().toISOString() } : req
      ),
      isLoading: false,
    }))
  },

  deleteRequest: async (id) => {
    set({ isLoading: true, error: null })
    await new Promise(resolve => setTimeout(resolve, 300))
    set((state) => ({
      requests: state.requests.filter((req) => req.id !== id),
      isLoading: false,
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
