import { forwardRef, useImperativeHandle, useState } from 'react'
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
