import type { Equipment } from '@/stores/equipment-store'
import { useEquipmentStore } from '@/stores/equipment-store'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EquipmentModal } from './EquipmentModal'

interface EquipmentTableProps {
  onNavigateToCategories?: () => void
}

export function EquipmentTable({ onNavigateToCategories }: EquipmentTableProps) {
  const allEquipment = useEquipmentStore((state) => state.equipment)
  const searchEquipment = useEquipmentStore((state) => state.searchEquipment)
  
  const equipment = useMemo(() => allEquipment.filter((eq) => eq.isActive), [allEquipment])
  
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEquipment = useMemo(() => {
    if (!searchQuery.trim()) return equipment
    return searchEquipment(searchQuery)
  }, [searchQuery, equipment, searchEquipment])

  const handleRowClick = (eq: Equipment) => {
    setSelectedEquipment(eq)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                  Equipment Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                  Employee
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                  Department
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                  Serial Number
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                  Technician
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                  Equipment Category
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                  Company
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((eq, index) => (
                <tr
                  key={eq.id}
                  onClick={() => handleRowClick(eq)}
                  className={`
                    border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer
                    ${index === filteredEquipment.length - 1 ? 'border-b-0' : ''}
                  `}
                >
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-200 font-medium">{eq.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    {eq.assignedEmployeeName ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-300">
                          {eq.assignedEmployeeName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <span className="text-sm text-slate-300">{eq.assignedEmployeeName}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-300">{eq.department || '-'}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-400 font-mono">{eq.serialNumber}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-300">{eq.technicianName}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-300">{eq.category}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-400">{eq.company}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredEquipment.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-400">
              {searchQuery ? 'No equipment matches your search.' : 'No equipment found. Click "New" to add equipment.'}
            </p>
          </div>
        )}
      </div>

      {/* Equipment Modal */}
      <EquipmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEquipment(null)
        }}
        equipment={selectedEquipment}
        mode={selectedEquipment ? 'edit' : 'create'}
        onNavigateToCategories={onNavigateToCategories}
      />
    </>
  )
}
