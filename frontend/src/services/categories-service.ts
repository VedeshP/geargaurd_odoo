/* eslint-disable @typescript-eslint/no-explicit-any */import api from '@/lib/api'
import type { EquipmentCategoryItem } from '@/stores/equipment-categories-store'

interface CategoryPayload {
  name: string
  description?: string
  parent_category?: string | null
  icon?: string
}

export const categoriesService = {
  // Get all equipment categories
  async getCategories(filters?: { isActive?: boolean; page?: number; limit?: number }) {
    const params = new URLSearchParams()
    
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString())
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const response = await api.get(`/equipment-categories?${params.toString()}`)
    
    // Transform backend response to frontend format
    const categories = response.data.data.categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      responsibleId: cat.responsible_id,
      responsibleName: cat.responsible?.full_name || 'Unknown',
      company: cat.company?.name || 'Unknown',
      description: cat.description,
      isSystemDefined: cat.is_system_defined || false,
      isActive: cat.is_active !== false,
      equipmentCount: cat.equipment_count || 0,
      createdAt: cat.created_at,
      updatedAt: cat.updated_at,
    }))

    return {
      categories,
      pagination: response.data.data.pagination,
    }
  },

  // Get single category
  async getCategory(id: string) {
    const response = await api.get(`/equipment-categories/${id}`)
    const cat = response.data.data

    return {
      id: cat.id,
      name: cat.name,
      responsibleId: cat.responsible_id,
      responsibleName: cat.responsible?.full_name || 'Unknown',
      company: cat.company?.name || 'Unknown',
      description: cat.description,
      isSystemDefined: cat.is_system_defined || false,
      isActive: cat.is_active !== false,
      equipmentCount: cat.equipment_count || 0,
      createdAt: cat.created_at,
      updatedAt: cat.updated_at,
    } as EquipmentCategoryItem
  },

  // Create category
  async createCategory(category: Omit<EquipmentCategoryItem, 'id' | 'createdAt' | 'updatedAt' | 'equipmentCount'>) {
    const payload: CategoryPayload = {
      name: category.name,
      description: category.description,
      icon: '📦', // Default icon
    }

    const response = await api.post('/equipment-categories', payload)
    const cat = response.data.data

    return {
      id: cat.id,
      name: cat.name,
      responsibleId: cat.responsible_id,
      responsibleName: cat.responsible?.full_name || 'Unknown',
      company: cat.company?.name || 'Unknown',
      description: cat.description,
      isSystemDefined: false,
      isActive: cat.is_active !== false,
      equipmentCount: 0,
      createdAt: cat.created_at,
      updatedAt: cat.updated_at,
    } as EquipmentCategoryItem
  },

  // Update category
  async updateCategory(id: string, updates: Partial<EquipmentCategoryItem>) {
    const payload: Record<string, any> = {}

    if (updates.name !== undefined) payload.name = updates.name
    if (updates.description !== undefined) payload.description = updates.description

    const response = await api.patch(`/equipment-categories/${id}`, payload)
    const cat = response.data.data

    return {
      id: cat.id,
      name: cat.name,
      responsibleId: cat.responsible_id,
      responsibleName: cat.responsible?.full_name || 'Unknown',
      company: cat.company?.name || 'Unknown',
      description: cat.description,
      isSystemDefined: cat.is_system_defined || false,
      isActive: cat.is_active !== false,
      equipmentCount: cat.equipment_count || 0,
      createdAt: cat.created_at,
      updatedAt: cat.updated_at,
    } as EquipmentCategoryItem
  },

  // Delete category
  async deleteCategory(id: string) {
    const response = await api.delete(`/equipment-categories/${id}`)
    return response.data
  },
}
