import { create } from 'zustand'

export type EquipmentCategory =
  | 'Computers'
  | 'Monitors'
  | 'Printers'
  | 'Servers'
  | 'Network Equipment'
  | 'Office Equipment'
  | 'Production Machinery'
  | 'Tools'
  | 'Vehicles'
  | 'Other'

export type EquipmentStatus = 'Active' | 'In Maintenance' | 'Out of Service' | 'Retired' | 'Lost/Damaged'

export interface Document {
  id: string
  name: string
  type: 'manual' | 'invoice' | 'photo' | 'other'
  url: string
  uploadedAt: string
}

export interface Equipment {
  id: string
  name: string
  category: EquipmentCategory
  serialNumber: string
  model?: string
  manufacturer?: string
  purchaseDate?: string
  warrantyExpiry?: string
  purchaseCost?: number
  assignedEmployeeId?: string
  assignedEmployeeName?: string
  department?: string
  technicianId: string
  technicianName: string
  location?: string
  status: EquipmentStatus
  company: string
  notes?: string
  maintenanceTeam?: string
  maintenanceHistory?: string[]
  documents?: Document[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface EquipmentStore {
  equipment: Equipment[]
  addEquipment: (equipment: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void
  deleteEquipment: (id: string) => void
  getEquipment: (id: string) => Equipment | undefined
  getEquipmentByCategory: (category: EquipmentCategory) => Equipment[]
  getEquipmentByStatus: (status: EquipmentStatus) => Equipment[]
  searchEquipment: (query: string) => Equipment[]
}

const mockEquipment: Equipment[] = [
  {
    id: 'eq-1',
    name: 'Samsung Monitor 15"',
    category: 'Monitors',
    serialNumber: 'MT/125/22FFFF87',
    model: 'Samsung S24F350',
    manufacturer: 'Samsung',
    purchaseDate: '2022-03-15',
    warrantyExpiry: '2025-03-15',
    purchaseCost: 249.99,
    assignedEmployeeId: 'emp1',
    assignedEmployeeName: 'Tejas Modi',
    department: 'Admin',
    technicianId: 'tm1',
    technicianName: 'Mitchell Adam',
    location: 'Office - Desk 12',
    status: 'Active',
    company: 'My Company (San Francisco)',
    isActive: true,
    createdAt: '2022-03-15T10:00:00Z',
    updatedAt: '2024-12-27T08:30:00Z',
  },
  {
    id: 'eq-2',
    name: 'Acer Laptop',
    category: 'Computers',
    serialNumber: 'MT/122/111112222',
    model: 'Acer Aspire 5',
    manufacturer: 'Acer',
    purchaseDate: '2022-01-20',
    warrantyExpiry: '2024-01-20',
    purchaseCost: 899.99,
    assignedEmployeeId: 'emp2',
    assignedEmployeeName: 'Bhaumik P',
    department: 'Technician',
    technicianId: 'tm2',
    technicianName: 'Marc Demo',
    location: 'Mobile Device',
    status: 'Active',
    company: 'My Company (San Francisco)',
    isActive: true,
    createdAt: '2022-01-20T14:00:00Z',
    updatedAt: '2024-12-27T08:30:00Z',
  },
  {
    id: 'eq-3',
    name: 'HP LaserJet Printer',
    category: 'Printers',
    serialNumber: 'MT/123/33PRINT01',
    model: 'HP LaserJet Pro M404dn',
    manufacturer: 'HP',
    purchaseDate: '2023-06-10',
    warrantyExpiry: '2026-06-10',
    purchaseCost: 429.99,
    assignedEmployeeId: undefined,
    assignedEmployeeName: undefined,
    department: 'IT',
    technicianId: 'tm1',
    technicianName: 'Mitchell Adam',
    location: 'Floor 2 - Print Room',
    status: 'Active',
    company: 'My Company (San Francisco)',
    isActive: true,
    createdAt: '2023-06-10T11:00:00Z',
    updatedAt: '2024-12-27T08:30:00Z',
  },
  {
    id: 'eq-4',
    name: 'Dell PowerEdge Server',
    category: 'Servers',
    serialNumber: 'MT/124/44SERVER1',
    model: 'Dell PowerEdge R740',
    manufacturer: 'Dell',
    purchaseDate: '2021-11-05',
    warrantyExpiry: '2024-11-05',
    purchaseCost: 4599.99,
    assignedEmployeeId: undefined,
    assignedEmployeeName: undefined,
    department: 'IT',
    technicianId: 'tm3',
    technicianName: 'Robert Chen',
    location: 'Data Center - Rack A3',
    status: 'In Maintenance',
    company: 'My Company (San Francisco)',
    isActive: true,
    createdAt: '2021-11-05T09:00:00Z',
    updatedAt: '2024-12-27T08:30:00Z',
  },
  {
    id: 'eq-5',
    name: 'CNC Milling Machine',
    category: 'Production Machinery',
    serialNumber: 'MT/120/55MILL001',
    model: 'Haas VF-2',
    manufacturer: 'Haas Automation',
    purchaseDate: '2020-08-15',
    warrantyExpiry: '2023-08-15',
    purchaseCost: 45000.0,
    assignedEmployeeId: 'emp3',
    assignedEmployeeName: 'John Smith',
    department: 'Production',
    technicianId: 'tm2',
    technicianName: 'Marc Demo',
    location: 'Production Floor - Bay 3',
    status: 'Active',
    company: 'My Company (San Francisco)',
    isActive: true,
    createdAt: '2020-08-15T08:00:00Z',
    updatedAt: '2024-12-27T08:30:00Z',
  },
]

export const useEquipmentStore = create<EquipmentStore>((set, get) => ({
  equipment: mockEquipment,

  addEquipment: (equipment) => {
    const now = new Date().toISOString()
    const newEquipment: Equipment = {
      ...equipment,
      id: `eq-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    set((state) => ({
      equipment: [...state.equipment, newEquipment],
    }))
  },

  updateEquipment: (id, updates) => {
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id ? { ...eq, ...updates, updatedAt: new Date().toISOString() } : eq
      ),
    }))
  },

  deleteEquipment: (id) => {
    // Soft delete - set isActive to false
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id ? { ...eq, isActive: false, updatedAt: new Date().toISOString() } : eq
      ),
    }))
  },

  getEquipment: (id) => {
    return get().equipment.find((eq) => eq.id === id)
  },

  getEquipmentByCategory: (category) => {
    return get().equipment.filter((eq) => eq.category === category && eq.isActive)
  },

  getEquipmentByStatus: (status) => {
    return get().equipment.filter((eq) => eq.status === status && eq.isActive)
  },

  searchEquipment: (query) => {
    const lowerQuery = query.toLowerCase()
    return get().equipment.filter(
      (eq) =>
        eq.isActive &&
        (eq.name.toLowerCase().includes(lowerQuery) ||
          eq.serialNumber.toLowerCase().includes(lowerQuery) ||
          eq.assignedEmployeeName?.toLowerCase().includes(lowerQuery) ||
          eq.manufacturer?.toLowerCase().includes(lowerQuery) ||
          eq.model?.toLowerCase().includes(lowerQuery) ||
          eq.category.toLowerCase().includes(lowerQuery))
    )
  },
}))
