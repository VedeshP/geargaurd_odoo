import { useEquipmentCategoriesStore } from '@/stores/equipment-categories-store'
import { useEquipmentStore } from '@/stores/equipment-store'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { EquipmentModal } from './components/EquipmentModal'
import { EquipmentTable } from './components/EquipmentTable'

export interface EquipmentPageRef {
  openCreateModal: () => void
}

interface EquipmentPageProps {
  onNavigateToCategories?: () => void
}

export const EquipmentPage = forwardRef<EquipmentPageRef, EquipmentPageProps>(({ onNavigateToCategories }, ref) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Get store actions
  const fetchEquipment = useEquipmentStore((state) => state.fetchEquipment)
  const fetchCategories = useEquipmentCategoriesStore((state) => state.fetchCategories)

  // Fetch data on mount
  useEffect(() => {
    fetchEquipment()
    fetchCategories()
  }, [fetchEquipment, fetchCategories])

  useImperativeHandle(ref, () => ({
    openCreateModal: () => {
      setIsCreateModalOpen(true)
    },
  }))

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <EquipmentTable onNavigateToCategories={onNavigateToCategories} />
      
      <EquipmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onNavigateToCategories={onNavigateToCategories}
      />
    </div>
  )
})

EquipmentPage.displayName = 'EquipmentPage'
