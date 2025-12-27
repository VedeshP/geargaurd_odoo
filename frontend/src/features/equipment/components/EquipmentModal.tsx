import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEquipmentCategoriesStore } from '@/stores/equipment-categories-store'
import type { Equipment, EquipmentCategory } from '@/stores/equipment-store'
import { useEquipmentStore } from '@/stores/equipment-store'
import { useTeamsStore } from '@/stores/teams-store'
import { Archive, ExternalLink, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

interface EquipmentModalProps {
  isOpen: boolean
  onClose: () => void
  equipment?: Equipment | null
  mode: 'create' | 'edit'
  onNavigateToCategories?: () => void
}

const usedByOptions = ['Employee', 'Department', 'Location', 'Other']

export function EquipmentModal({ isOpen, onClose, equipment, mode, onNavigateToCategories }: EquipmentModalProps) {
  const addEquipment = useEquipmentStore((state) => state.addEquipment)
  const updateEquipment = useEquipmentStore((state) => state.updateEquipment)
  const deleteEquipment = useEquipmentStore((state) => state.deleteEquipment)
  
  const allCategories = useEquipmentCategoriesStore((state) => state.categories)
  const equipmentCategories = useMemo(() => allCategories.filter(cat => cat.isActive), [allCategories])
  
  const allTeams = useTeamsStore((state) => state.teams)
  const teams = useMemo(() => allTeams.filter(t => t.isActive), [allTeams])
  const allMembers = useTeamsStore((state) => state.getAllMembers)
  const technicians = useMemo(() => allMembers(), [allMembers])

  const [activeTab, setActiveTab] = useState<'notes' | 'history' | 'documents'>('notes')
  const [searchSerialNumber, setSearchSerialNumber] = useState(equipment?.serialNumber || '')

  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    category: equipment?.category || (equipmentCategories[0]?.name as EquipmentCategory) || ('Monitors' as EquipmentCategory),
    company: equipment?.company || 'My Company (San Francisco)',
    usedBy: equipment?.department || 'Employee',
    maintenanceTeam: equipment?.maintenanceTeam || '',
    assignedDate: equipment?.purchaseDate || '',
    description: equipment?.notes || '',
    technicianId: equipment?.technicianId || '',
    assignedEmployeeName: equipment?.assignedEmployeeName || '',
    scrapDate: equipment?.warrantyExpiry || '',
    usedInLocation: equipment?.location || '',
    workCenter: equipment?.model || '',
  })

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value as EquipmentCategory })
  }

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedTechnician = technicians.find((t) => t.id === formData.technicianId)

    const equipmentData = {
      name: formData.name,
      category: formData.category,
      serialNumber: searchSerialNumber || `EQ-${Date.now()}`,
      company: formData.company,
      department: formData.usedBy || undefined,
      maintenanceTeam: formData.maintenanceTeam || undefined,
      purchaseDate: formData.assignedDate || undefined,
      notes: formData.description || undefined,
      technicianId: formData.technicianId,
      technicianName: selectedTechnician?.name || 'Unknown',
      assignedEmployeeName: formData.assignedEmployeeName || undefined,
      warrantyExpiry: formData.scrapDate || undefined,
      location: formData.usedInLocation || undefined,
      model: formData.workCenter || undefined,
      status: 'Active' as const,
      isActive: true,
    }

    if (mode === 'edit' && equipment) {
      updateEquipment(equipment.id, equipmentData)
    } else {
      addEquipment(equipmentData)
    }

    onClose()
  }

  const handleArchive = () => {
    if (equipment && mode === 'edit') {
      if (confirm('Are you sure you want to archive this equipment?')) {
        deleteEquipment(equipment.id)
        onClose()
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={24} />
            </button>
            <div>
              <Button
                variant="outline"
                className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                New
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Equipment</span>
            </div>
          </div>
          
          {/* Search Serial Number */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Name/Serial Number"
              value={searchSerialNumber}
              onChange={(e) => setSearchSerialNumber(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-slate-300 mb-2 block">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Samsung Monitor 15"
                    required
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                {/* Equipment Category */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="category" className="text-slate-300">
                      Equipment Category
                    </Label>
                    {onNavigateToCategories && (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigateToCategories()
                          onClose()
                        }}
                        className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 transition-colors"
                        title="Manage Equipment Categories"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Manage Categories</span>
                      </button>
                    )}
                  </div>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  >
                    {equipmentCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Company */}
                <div>
                  <Label htmlFor="company" className="text-slate-300 mb-2 block">
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                {/* Used By */}
                <div>
                  <Label htmlFor="usedBy" className="text-slate-300 mb-2 block">
                    Used By
                  </Label>
                  <select
                    id="usedBy"
                    value={formData.usedBy}
                    onChange={(e) => setFormData({ ...formData, usedBy: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  >
                    {usedByOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Maintenance Team */}
                <div>
                  <Label htmlFor="maintenanceTeam" className="text-slate-300 mb-2 block">
                    Maintenance Team
                  </Label>
                  <select
                    id="maintenanceTeam"
                    value={formData.maintenanceTeam}
                    onChange={(e) => setFormData({ ...formData, maintenanceTeam: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  >
                    <option value="">Select a team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assigned Date */}
                <div>
                  <Label htmlFor="assignedDate" className="text-slate-300 mb-2 block">
                    Assigned Date
                  </Label>
                  <Input
                    id="assignedDate"
                    type="date"
                    value={formData.assignedDate}
                    onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
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
                    rows={4}
                    placeholder="Add description..."
                    className="w-full min-h-37.5 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Technician */}
                <div>
                  <Label htmlFor="technician" className="text-slate-300 mb-2 block">
                    Technician
                  </Label>
                  <select
                    id="technician"
                    value={formData.technicianId}
                    onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  >
                    <option value="">Select technician</option>
                    {technicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Employee */}
                <div>
                  <Label htmlFor="employee" className="text-slate-300 mb-2 block">
                    Employee
                  </Label>
                  <Input
                    id="employee"
                    value={formData.assignedEmployeeName}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedEmployeeName: e.target.value })
                    }
                    placeholder="Employee name"
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                {/* Scrap Date */}
                <div>
                  <Label htmlFor="scrapDate" className="text-slate-300 mb-2 block">
                    Scrap Date
                  </Label>
                  <Input
                    id="scrapDate"
                    type="date"
                    value={formData.scrapDate}
                    onChange={(e) => setFormData({ ...formData, scrapDate: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                {/* Used in location */}
                <div>
                  <Label htmlFor="usedInLocation" className="text-slate-300 mb-2 block">
                    Used in location
                  </Label>
                  <Input
                    id="usedInLocation"
                    value={formData.usedInLocation}
                    onChange={(e) => setFormData({ ...formData, usedInLocation: e.target.value })}
                    placeholder="Location"
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                {/* Work Center */}
                <div>
                  <Label htmlFor="workCenter" className="text-slate-300 mb-2 block">
                    Work Center
                  </Label>
                  <Input
                    id="workCenter"
                    value={formData.workCenter}
                    onChange={(e) => setFormData({ ...formData, workCenter: e.target.value })}
                    placeholder="Work center"
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Section - Tabs */}
            <div className="mt-6 border-t border-slate-800 pt-6">
              <div className="flex gap-4 border-b border-slate-800 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'notes'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Notes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'history'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Maintenance History
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('documents')}
                  className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'documents'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Documents
                </button>
              </div>

              {activeTab === 'notes' && (
                <div>
                  <Label htmlFor="tabNotes" className="text-slate-300 mb-2 block">
                    Additional Notes
                  </Label>
                  <textarea
                    id="tabNotes"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Add any additional information about this equipment..."
                    className="w-full min-h-37.5 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  />
                </div>
              )}

              {activeTab === 'history' && (
                <div className="text-sm text-slate-400">
                  <p>Maintenance history will be displayed here.</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Feature coming soon: View all maintenance requests related to this equipment.
                  </p>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="text-sm text-slate-400">
                  <p>Documents and attachments will be displayed here.</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Feature coming soon: Upload manuals, invoices, and photos.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-800 bg-slate-900/50">
          <div>
            {mode === 'edit' && (
              <Button
                type="button"
                variant="outline"
                onClick={handleArchive}
                className="bg-slate-800 border-slate-700 text-red-400 hover:bg-red-950/20 hover:border-red-800"
              >
                <Archive className="mr-2" size={16} />
                Archive Equipment
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
              {mode === 'create' ? 'Create Equipment' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
