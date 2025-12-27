import { forwardRef, useImperativeHandle, useState } from 'react'
import { TeamModal } from './components/TeamModal'
import { TeamsTable } from './components/TeamsTable'

export interface TeamsPageRef {
  openCreateModal: () => void
}

export const TeamsPage = forwardRef<TeamsPageRef>((_props, ref) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    openCreateModal: () => setIsCreateModalOpen(true)
  }))

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Teams Table */}
      <TeamsTable />

      {/* Team Creation Modal */}
      <TeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
      />
    </div>
  )
})
