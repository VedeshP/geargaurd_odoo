/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/api'
import type { Equipment, EquipmentStatus } from '@/stores/equipment-store'

interface EquipmentFilters {
  category?: string
  status?: EquipmentStatus
  technicianId?: string
  isActive?: boolean
  search?: string
  page?: number
  limit?: number
}

interface EquipmentPayload {
  name: string
  category_id: string
  serial_number: string
  model?: string
  manufacturer?: string
  purchase_date?: string
  warranty_expiry?: string
  purchase_cost?: number
  employee_id?: string
  department_id?: string
  technician_id: string
  location?: string
  status: string
  company_id?: string
  notes?: string
}

export const equipmentService = {
  // Get all equipment
  async getEquipment(filters?: EquipmentFilters) {
    const params = new URLSearchParams()
    
    if (filters?.category) params.append('category', filters.category)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.technicianId) params.append('technicianId', filters.technicianId)
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const response = await api.get(`/equipment?${params.toString()}`)
    
    // Transform backend response to frontend format
    const equipment = response.data.data.equipment.map((eq: any) => ({
      id: eq.id,
      name: eq.name,
      category: eq.category?.name || 'Other',
      serialNumber: eq.serial_number,
      model: eq.model,
      manufacturer: eq.manufacturer,
      purchaseDate: eq.purchase_date,
      warrantyExpiry: eq.warranty_expiry,
      purchaseCost: eq.purchase_cost,
      assignedEmployeeId: eq.employee_id,
      assignedEmployeeName: eq.employee?.full_name,
      department: eq.department?.name,
      technicianId: eq.technician_id,
      technicianName: eq.technician?.full_name,
      location: eq.location,
      status: eq.status || 'Active',
      company: eq.company?.name || 'Unknown',
      notes: eq.notes,
      maintenanceTeam: eq.team?.name,
      maintenanceHistory: eq.maintenance_history || [],
      documents: eq.documents || [],
      isActive: eq.is_active !== false,
      createdAt: eq.created_at,
      updatedAt: eq.updated_at,
    }))

    return {
      equipment,
      pagination: response.data.data.pagination,
    }
  },

  // Get single equipment
  async getEquipmentById(id: string) {
    const response = await api.get(`/equipment/${id}`)
    const eq = response.data.data

    return {
      id: eq.id,
      name: eq.name,
      category: eq.category?.name || 'Other',
      serialNumber: eq.serial_number,
      model: eq.model,
      manufacturer: eq.manufacturer,
      purchaseDate: eq.purchase_date,
      warrantyExpiry: eq.warranty_expiry,
      purchaseCost: eq.purchase_cost,
      assignedEmployeeId: eq.employee_id,
      assignedEmployeeName: eq.employee?.full_name,
      department: eq.department?.name,
      technicianId: eq.technician_id,
      technicianName: eq.technician?.full_name,
      location: eq.location,
      status: eq.status || 'Active',
      company: eq.company?.name || 'Unknown',
      notes: eq.notes,
      maintenanceTeam: eq.team?.name,
      maintenanceHistory: eq.maintenance_history || [],
      documents: eq.documents || [],
      isActive: eq.is_active !== false,
      createdAt: eq.created_at,
      updatedAt: eq.updated_at,
    } as Equipment
  },

  // Create equipment
  async createEquipment(equipment: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) {
    const payload: EquipmentPayload = {
      name: equipment.name,
      category_id: equipment.category, // Assuming category is stored as string
      serial_number: equipment.serialNumber,
      model: equipment.model,
      manufacturer: equipment.manufacturer,
      purchase_date: equipment.purchaseDate,
      warranty_expiry: equipment.warrantyExpiry,
      purchase_cost: equipment.purchaseCost,
      employee_id: equipment.assignedEmployeeId,
      technician_id: equipment.technicianId,
      location: equipment.location,
      status: equipment.status,
      notes: equipment.notes,
    }

    const response = await api.post('/equipment', payload)
    const eq = response.data.data

    return {
      id: eq.id,
      name: eq.name,
      category: eq.category?.name || 'Other',
      serialNumber: eq.serial_number,
      model: eq.model,
      manufacturer: eq.manufacturer,
      purchaseDate: eq.purchase_date,
      warrantyExpiry: eq.warranty_expiry,
      purchaseCost: eq.purchase_cost,
      assignedEmployeeId: eq.employee_id,
      assignedEmployeeName: eq.employee?.full_name,
      department: eq.department?.name,
      technicianId: eq.technician_id,
      technicianName: eq.technician?.full_name,
      location: eq.location,
      status: eq.status || 'Active',
      company: eq.company?.name || 'Unknown',
      notes: eq.notes,
      maintenanceTeam: eq.team?.name,
      maintenanceHistory: [],
      documents: [],
      isActive: eq.is_active !== false,
      createdAt: eq.created_at,
      updatedAt: eq.updated_at,
    } as Equipment
  },

  // Update equipment
  async updateEquipment(id: string, updates: Partial<Equipment>) {
    const payload: Record<string, any> = {}

    if (updates.name !== undefined) payload.name = updates.name
    if (updates.category !== undefined) payload.category_id = updates.category
    if (updates.serialNumber !== undefined) payload.serial_number = updates.serialNumber
    if (updates.model !== undefined) payload.model = updates.model
    if (updates.manufacturer !== undefined) payload.manufacturer = updates.manufacturer
    if (updates.purchaseDate !== undefined) payload.purchase_date = updates.purchaseDate
    if (updates.warrantyExpiry !== undefined) payload.warranty_expiry = updates.warrantyExpiry
    if (updates.purchaseCost !== undefined) payload.purchase_cost = updates.purchaseCost
    if (updates.assignedEmployeeId !== undefined) payload.employee_id = updates.assignedEmployeeId
    if (updates.technicianId !== undefined) payload.technician_id = updates.technicianId
    if (updates.location !== undefined) payload.location = updates.location
    if (updates.status !== undefined) payload.status = updates.status
    if (updates.notes !== undefined) payload.notes = updates.notes

    const response = await api.patch(`/equipment/${id}`, payload)
    const eq = response.data.data

    return {
      id: eq.id,
      name: eq.name,
      category: eq.category?.name || 'Other',
      serialNumber: eq.serial_number,
      model: eq.model,
      manufacturer: eq.manufacturer,
      purchaseDate: eq.purchase_date,
      warrantyExpiry: eq.warranty_expiry,
      purchaseCost: eq.purchase_cost,
      assignedEmployeeId: eq.employee_id,
      assignedEmployeeName: eq.employee?.full_name,
      department: eq.department?.name,
      technicianId: eq.technician_id,
      technicianName: eq.technician?.full_name,
      location: eq.location,
      status: eq.status || 'Active',
      company: eq.company?.name || 'Unknown',
      notes: eq.notes,
      maintenanceTeam: eq.team?.name,
      maintenanceHistory: eq.maintenance_history || [],
      documents: eq.documents || [],
      isActive: eq.is_active !== false,
      createdAt: eq.created_at,
      updatedAt: eq.updated_at,
    } as Equipment
  },

  // Delete equipment
  async deleteEquipment(id: string) {
    const response = await api.delete(`/equipment/${id}`)
    return response.data
  },

  // Upload document
  async uploadDocument(equipmentId: string, file: File, type: string) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    formData.append('name', file.name)

    const response = await api.post(`/equipment/${equipmentId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data.data.document
  },
}
