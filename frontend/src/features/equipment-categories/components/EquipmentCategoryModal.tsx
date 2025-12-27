import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { EquipmentCategoryItem } from '@/stores/equipment-categories-store'
import { useEquipmentCategoriesStore } from '@/stores/equipment-categories-store'
import { useTeamsStore } from '@/stores/teams-store'
import { Archive, X } from 'lucide-react'
import { useMemo, useState } from 'react'

interface EquipmentCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: EquipmentCategoryItem | null
  mode: 'create' | 'edit'
}

export function EquipmentCategoryModal({ isOpen, onClose, category, mode }: EquipmentCategoryModalProps) {
  const addCategory = useEquipmentCategoriesStore((state) => state.addCategory)
  const updateCategory = useEquipmentCategoriesStore((state) => state.updateCategory)
  const deleteCategory = useEquipmentCategoriesStore((state) => state.deleteCategory)
  const getCategoryByName = useEquipmentCategoriesStore((state) => state.getCategoryByName)
  
  const allMembers = useTeamsStore((state) => state.getAllMembers)
  const technicians = useMemo(() => allMembers(), [allMembers])

  const [formData, setFormData] = useState({
    name: category?.name || '',
    responsibleId: category?.responsibleId || '',
    company: category?.company || 'My Company (San Francisco)',
    description: category?.description || '',
  })

  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation: Check for duplicate category name
    const existingCategory = getCategoryByName(formData.name)
    if (existingCategory && existingCategory.id !== category?.id) {
      setError('A category with this name already exists')
      return
    }

    const selectedTechnician = technicians.find((t) => t.id === formData.responsibleId)

    const categoryData = {
      name: formData.name.trim(),
      responsibleId: formData.responsibleId || undefined,
      responsibleName: selectedTechnician?.name || undefined,
      company: formData.company,
      description: formData.description || undefined,
      isSystemDefined: false, // User-created categories are not system-defined
      isActive: true,
    }

    if (mode === 'edit' && category) {
      updateCategory(category.id, categoryData)
    } else {
      addCategory(categoryData)
    }

    onClose()
  }

  const handleArchive = () => {
    if (category && mode === 'edit') {
      if (category.equipmentCount && category.equipmentCount > 0) {
        alert(
          `Cannot delete this category. ${category.equipmentCount} equipment ${category.equipmentCount === 1 ? 'item is' : 'items are'} using this category.`
        )
        return
      }

      if (confirm('Are you sure you want to archive this category? It will be hidden from equipment selection.')) {
        deleteCategory(category.id)
        onClose()
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">
              {mode === 'create' ? 'New Equipment Category' : 'Edit Equipment Category'}
            </h2>
            {category?.isSystemDefined && (
              <p className="text-sm text-slate-400 mt-1">System-defined category</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-2 hover:bg-slate-800 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Category Name */}
              <div>
                <Label htmlFor="name" className="text-slate-300 mb-2 block">
                  Category Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Industrial Equipment"
                  required
                  disabled={category?.isSystemDefined}
                  className="bg-slate-800/50 border-slate-700 text-slate-100"
                />
                {category?.isSystemDefined && (
                  <p className="text-xs text-slate-500 mt-1">
                    System-defined category names cannot be changed
                  </p>
                )}
              </div>

              {/* Responsible Person */}
              <div>
                <Label htmlFor="responsible" className="text-slate-300 mb-2 block">
                  Responsible Person
                </Label>
                <select
                  id="responsible"
                  value={formData.responsibleId}
                  onChange={(e) => setFormData({ ...formData, responsibleId: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                >
                  <option value="">Select responsible person</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} ({tech.role})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Person who manages or oversees this category
                </p>
              </div>

              {/* Company */}
              <div>
                <Label htmlFor="company" className="text-slate-300 mb-2 block">
                  Company *
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="bg-slate-800/50 border-slate-700 text-slate-100"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-slate-300 mb-2 block">
                  Description
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Add additional details about this category..."
                  className="w-full min-h-37.5 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-800 bg-slate-900/50">
          <div>
            {mode === 'edit' && !category?.isSystemDefined && (
              <Button
                type="button"
                variant="outline"
                onClick={handleArchive}
                className="bg-slate-800 border-slate-700 text-red-400 hover:bg-red-950/20 hover:border-red-800"
              >
                <Archive className="mr-2" size={16} />
                Archive Category
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {mode === 'create' ? 'Create Category' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
