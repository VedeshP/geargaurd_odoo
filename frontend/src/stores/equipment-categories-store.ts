import { create } from 'zustand'

export interface EquipmentCategoryItem {
  id: string
  name: string
  responsibleId?: string
  responsibleName?: string
  company: string
  description?: string
  isSystemDefined: boolean
  isActive: boolean
  equipmentCount?: number
  createdAt: string
  updatedAt: string
}

interface EquipmentCategoriesStore {
  categories: EquipmentCategoryItem[]
  isLoading: boolean
  error: string | null
  
  fetchCategories: (filters?: any) => Promise<void>
  addCategory: (category: Omit<EquipmentCategoryItem, 'id' | 'createdAt' | 'updatedAt' | 'equipmentCount'>) => Promise<void>
  updateCategory: (id: string, updates: Partial<EquipmentCategoryItem>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  getCategory: (id: string) => EquipmentCategoryItem | undefined
  getCategoryByName: (name: string) => EquipmentCategoryItem | undefined
  searchCategories: (query: string) => EquipmentCategoryItem[]
}

// Default categories (kept for reference)
const defaultCategories: EquipmentCategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Computers',
    responsibleId: 'tm1',
    responsibleName: 'OdooBot',
    company: 'My Company (San Francisco)',
    isSystemDefined: true,
    isActive: true,
    equipmentCount: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Software',
    responsibleId: 'tm1',
    responsibleName: 'OdooBot',
    company: 'My Company (San Francisco)',
    isSystemDefined: true,
    isActive: true,
    equipmentCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-3',
    name: 'Monitors',
    responsibleId: 'tm1',
    responsibleName: 'Mitchell Adam',
    company: 'My Company (San Francisco)',
    isSystemDefined: true,
    isActive: true,
    equipmentCount: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-4',
    name: 'Printers',
    responsibleId: 'tm1',
    responsibleName: 'OdooBot',
    company: 'My Company (San Francisco)',
    isSystemDefined: true,
    isActive: true,
    equipmentCount: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-5',
    name: 'Servers',
    responsibleId: 'tm1',
    responsibleName: 'OdooBot',
    company: 'My Company (San Francisco)',
    isSystemDefined: true,
    isActive: true,
    equipmentCount: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-6',
    name: 'Network Equipment',
    responsibleId: 'tm1',
    responsibleName: 'OdooBot',
    company: 'My Company (San Francisco)',
    isSystemDefined: true,
    isActive: true,
    equipmentCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-7',
    name: 'Office Equipment',
    responsibleId: 'tm1',
    responsibleName: 'OdooBot',
    company: 'My Company (San Francisco)',
    isSystemDefined: true,
    isActive: true,
    equipmentCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-8',
    name: 'Production Machinery',
    responsibleId: 'tm2',
    responsibleName: 'OdooBot',
    company: 'My Company (San Francisco)',
    isSystemDefined: true,
    isActive: true,
    equipmentCount: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-9',
    name: 'Tools',
    responsibleId: 'tm1',
    responsibleName: 'OdooBot',
    company: 'My Company (San Francisco)',
    isSystemDefined: true,
    isActive: true,
    equipmentCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-10',
    name: 'Vehicles',
    responsibleId: 'tm1',
    responsibleName: 'OdooBot',
    company: 'My Company (San Francisco)',
    isSystemDefined: true,
    isActive: true,
    equipmentCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-11',
    name: 'Other',
    responsibleId: 'tm1',
    responsibleName: 'OdooBot',
    company: 'My Company (San Francisco)',
    isSystemDefined: true,
    isActive: true,
    equipmentCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

export const useEquipmentCategoriesStore = create<EquipmentCategoriesStore>((set, get) => ({
  categories: defaultCategories,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null })
    await new Promise(resolve => setTimeout(resolve, 300))
    set({ isLoading: false })
  },

  addCategory: async (category) => {
    set({ isLoading: true, error: null })
    await new Promise(resolve => setTimeout(resolve, 300))
    const newCategory: EquipmentCategoryItem = {
      ...category,
      id: 'cat-' + Date.now(),
      equipmentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set((state) => ({
      categories: [...state.categories, newCategory],
      isLoading: false,
    }))
  },

  updateCategory: async (id, updates) => {
    set({ isLoading: true, error: null })
    await new Promise(resolve => setTimeout(resolve, 300))
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates, updatedAt: new Date().toISOString() } : cat
      ),
      isLoading: false,
    }))
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null })
    await new Promise(resolve => setTimeout(resolve, 300))
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
      isLoading: false,
    }))
  },

  getCategory: (id) => {
    return get().categories.find((cat) => cat.id === id)
  },

  getCategoryByName: (name) => {
    return get().categories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase() && cat.isActive
    )
  },

  searchCategories: (query) => {
    const lowerQuery = query.toLowerCase()
    return get().categories.filter(
      (cat) =>
        cat.isActive &&
        (cat.name.toLowerCase().includes(lowerQuery) ||
          cat.responsibleName?.toLowerCase().includes(lowerQuery) ||
          cat.company.toLowerCase().includes(lowerQuery))
    )
  },
}))
