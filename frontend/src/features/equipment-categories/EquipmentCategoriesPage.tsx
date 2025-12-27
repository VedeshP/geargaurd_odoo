import { useEquipmentCategoriesStore } from '@/stores/equipment-categories-store'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { EquipmentCategoriesTable } from './components/EquipmentCategoriesTable'
import { EquipmentCategoryModal } from './components/EquipmentCategoryModal'

export interface EquipmentCategoriesPageRef {
  openCreateModal: () => void
}

export const EquipmentCategoriesPage = forwardRef<EquipmentCategoriesPageRef, object>((_props, ref) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Get store action
  const fetchCategories = useEquipmentCategoriesStore((state) => state.fetchCategories)

  // Fetch data on mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useImperativeHandle(ref, () => ({
    openCreateModal: () => {
      setIsCreateModalOpen(true)
    },
  }))

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <EquipmentCategoriesTable />
      
      <EquipmentCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
      />
    </div>
  )
})

EquipmentCategoriesPage.displayName = 'EquipmentCategoriesPage'
