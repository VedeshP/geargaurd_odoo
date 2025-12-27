import type { EquipmentCategoryItem } from '@/stores/equipment-categories-store'
import { useEquipmentCategoriesStore } from '@/stores/equipment-categories-store'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EquipmentCategoryModal } from './EquipmentCategoryModal'

export function EquipmentCategoriesTable() {
  const allCategories = useEquipmentCategoriesStore((state) => state.categories)
  const searchCategories = useEquipmentCategoriesStore((state) => state.searchCategories)
  
  const categories = useMemo(() => allCategories.filter((cat) => cat.isActive), [allCategories])
  
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategoryItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    return searchCategories(searchQuery)
  }, [searchQuery, categories, searchCategories])

  const handleRowClick = (category: EquipmentCategoryItem) => {
    setSelectedCategory(category)
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
              placeholder="Search categories..."
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
                  Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                  Responsible
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                  Company
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category, index) => (
                <tr
                  key={category.id}
                  onClick={() => handleRowClick(category)}
                  className={`
                    border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer
                    ${index === filteredCategories.length - 1 ? 'border-b-0' : ''}
                  `}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-200 font-medium">{category.name}</span>
                      {category.isSystemDefined && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          System
                        </span>
                      )}
                      {category.equipmentCount !== undefined && category.equipmentCount > 0 && (
                        <span className="text-xs text-slate-500">
                          ({category.equipmentCount} {category.equipmentCount === 1 ? 'item' : 'items'})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-300">
                      {category.responsibleName || '-'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-400">{category.company}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredCategories.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-400">
              {searchQuery ? 'No categories match your search.' : 'No equipment categories found. Click "New" to create a category.'}
            </p>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <EquipmentCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCategory(null)
        }}
        category={selectedCategory}
        mode={selectedCategory ? 'edit' : 'create'}
      />
    </>
  )
}
