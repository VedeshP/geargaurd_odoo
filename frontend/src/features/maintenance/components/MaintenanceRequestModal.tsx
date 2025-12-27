import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useTeamsStore } from '@/stores/teams-store'
import { Archive, ArrowRight, Ban, ExternalLink, MessageSquare, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigation } from '@/hooks/use-navigation'
import { PrioritySelector } from './PrioritySelector'
import { StagePipeline } from './StagePipeline'

interface MaintenanceRequestModalProps {
  isOpen: boolean
  onClose: () => void
  request?: any // TODO: Add proper type
  mode: 'create' | 'edit'
  onNavigateToTeams?: () => void
}

export function MaintenanceRequestModal({ isOpen, onClose, request, mode, onNavigateToTeams }: MaintenanceRequestModalProps) {
  const { navigate } = useNavigation();
  const allTeams = useTeamsStore((state) => state.teams)
  const getTeamMembers = useTeamsStore((state) => state.getTeamMembers)
  const getAllMembers = useTeamsStore((state) => state.getAllMembers)
  
  const addRequest = useMaintenanceStore((state) => state.addRequest)
  const updateRequest = useMaintenanceStore((state) => state.updateRequest)
  
  const teams = useMemo(() => allTeams.filter(t => t.isActive), [allTeams])
  
  const [activeTab, setActiveTab] = useState<'notes' | 'instructions'>('notes')
  const [availableTechnicians, setAvailableTechnicians] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    subject: request?.subject || '',
    maintenanceFor: request?.maintenanceFor || 'equipment',
    equipment: request?.equipmentId || '',
    workCenter: request?.workCenter || '',
    category: request?.categoryId || 'Computers',
    requestDate: request?.requestDate || new Date().toISOString().split('T')[0],
    maintenanceType: request?.maintenanceType || 'corrective',
    team: request?.teamId || '',
    technician: request?.technicianId || '',
    scheduledDate: request?.scheduledDate || '',
    duration: request?.duration || '00:00',
    priority: request?.priority || 'medium',
    company: request?.companyId || 'My Company (San Francisco)',
    stage: request?.status || 'new',
    notes: request?.notes || '',
    instructions: request?.instructions || '',
    isBlocked: request?.isBlocked || false,
    isArchived: request?.isArchived || false,
  })

  useEffect(() => {
    // Initialize or update available technicians when team changes
    if (formData.team) {
      const members = getTeamMembers(formData.team)
      setAvailableTechnicians(members)
    } else {
      setAvailableTechnicians(getAllMembers())
    }
  }, [formData.team, getTeamMembers, getAllMembers])

  // Initialize technicians on mount
  useEffect(() => {
    setAvailableTechnicians(getAllMembers())
  }, [])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mode === 'create') {
      // Create new request
      addRequest({
        subject: formData.subject,
        equipmentId: formData.equipment, // TODO: Should be equipment ID not name
        teamId: formData.team,
        technicianId: formData.technician,
        maintenanceFor: formData.maintenanceFor as 'equipment' | 'work-center',
        workCenter: formData.workCenter,
        maintenanceType: formData.maintenanceType as 'corrective' | 'preventive',
        priority: formData.priority as 'high' | 'medium' | 'low',
        status: formData.stage as 'new' | 'in-progress' | 'completed' | 'overdue',
        requestDate: formData.requestDate,
        scheduledDate: formData.scheduledDate || undefined,
        duration: formData.duration || undefined,
        notes: formData.notes || undefined,
        instructions: formData.instructions || undefined,
        isBlocked: formData.isBlocked,
        isArchived: formData.isArchived,
      })
    } else if (mode === 'edit' && request?.id) {
      // Update existing request
      updateRequest(request.id, {
        subject: formData.subject,
        equipmentId: formData.equipment,
        teamId: formData.team,
        technicianId: formData.technician,
        maintenanceFor: formData.maintenanceFor as 'equipment' | 'work-center',
        workCenter: formData.workCenter,
        maintenanceType: formData.maintenanceType as 'corrective' | 'preventive',
        priority: formData.priority as 'high' | 'medium' | 'low',
        status: formData.stage as 'new' | 'in-progress' | 'completed' | 'overdue',
        requestDate: formData.requestDate,
        scheduledDate: formData.scheduledDate || undefined,
        duration: formData.duration || undefined,
        notes: formData.notes || undefined,
        instructions: formData.instructions || undefined,
        isBlocked: formData.isBlocked,
        isArchived: formData.isArchived,
      })
    }
    
    onClose()
  }

  const handleTeamChange = (teamId: string) => {
    setFormData({ ...formData, team: teamId, technician: '' })
  }

  const handleStageChange = (stage: any) => {
    setFormData({ ...formData, stage })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              {mode === 'create' ? 'New Maintenance Request' : formData.subject}
            </h2>
            
            <div className="flex items-center gap-2">
              {/* Action Buttons */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isArchived: !formData.isArchived })}
                className={`
                  p-2 rounded-lg transition-colors cursor-pointer
                  ${formData.isArchived ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}
                `}
                title="Archive"
              >
                <Archive className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, isBlocked: !formData.isBlocked })}
                className={`
                  p-2 rounded-lg transition-colors cursor-pointer
                  ${formData.isBlocked ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}
                `}
                title="Block"
              >
                <Ban className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors cursor-pointer"
                title="Ready for Next Stage"
              >
                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stage Pipeline */}
          <StagePipeline currentStage={formData.stage as any} onStageChange={handleStageChange} />
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column (60% - 3 of 5 columns) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Enter maintenance subject"
                  required
                />
              </div>

              {/* Created By */}
              <div className="space-y-2">
                <Label>Created By</Label>
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    MA
                  </div>
                  <span className="text-slate-200">Mitchell Admin</span>
                </div>
              </div>

              {/* Maintenance For */}
              <div className="space-y-2">
                <Label htmlFor="maintenanceFor">Maintenance For *</Label>
                <select
                  id="maintenanceFor"
                  value={formData.maintenanceFor}
                  onChange={(e) => setFormData({ ...formData, maintenanceFor: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                  required
                >
                  <option value="equipment">Equipment</option>
                  <option value="work-center">Work Center</option>
                </select>
              </div>

              {/* Equipment or Work Center (Conditional) */}
              {formData.maintenanceFor === 'equipment' ? (
                <div className="space-y-2">
                  <Label htmlFor="equipment">Equipment *</Label>
                  <select
                    id="equipment"
                    value={formData.equipment}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                    className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                    required
                  >
                    <option value="">Select equipment...</option>
                    <option value="Acer Laptop/LP/203/14281428">Acer Laptop/LP/203/14281428</option>
                    <option value="CNC Machine/PR/101/87654321">CNC Machine/PR/101/87654321</option>
                    <option value="Office Printer/AD/305/11223344">Office Printer/AD/305/11223344</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="workCenter">Work Center *</Label>
                  <select
                    id="workCenter"
                    value={formData.workCenter}
                    onChange={(e) => setFormData({ ...formData, workCenter: e.target.value })}
                    className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                    required
                  >
                    <option value="">Select work center...</option>
                    <option value="Production Line 1">Production Line 1 / Manufacturing</option>
                    <option value="Assembly Station A">Assembly Station A / Assembly</option>
                    <option value="Quality Control">Quality Control / QC Department</option>
                  </select>
                </div>
              )}

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <div className="p-3 bg-slate-800 rounded-lg text-slate-300">
                  {formData.category}
                </div>
              </div>

              {/* Request Date */}
              <div className="space-y-2">
                <Label htmlFor="requestDate">Request Date *</Label>
                <Input
                  id="requestDate"
                  type="date"
                  value={formData.requestDate}
                  onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                  required
                />
              </div>

              {/* Maintenance Type */}
              <div className="space-y-3">
                <Label>Maintenance Type *</Label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="maintenanceType"
                      value="corrective"
                      checked={formData.maintenanceType === 'corrective'}
                      onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
                      className="w-4 h-4 text-blue-600 cursor-pointer"
                    />
                    <span className="text-slate-200">Corrective</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="maintenanceType"
                      value="preventive"
                      checked={formData.maintenanceType === 'preventive'}
                      onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
                      className="w-4 h-4 text-blue-600 cursor-pointer"
                    />
                    <span className="text-slate-200">Preventive</span>
                  </label>
                </div>
              </div>

              {/* Notes & Instructions Tabs */}
              <div className="space-y-3">
                <div className="flex gap-2 border-b border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('notes')}
                    className={`
                      px-4 py-2 font-medium transition-colors cursor-pointer
                      ${activeTab === 'notes'
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-slate-400 hover:text-slate-200'
                      }
                    `}
                  >
                    Notes
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('instructions')}
                    className={`
                      px-4 py-2 font-medium transition-colors cursor-pointer
                      ${activeTab === 'instructions'
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-slate-400 hover:text-slate-200'
                      }
                    `}
                  >
                    Instructions
                  </button>
                </div>

                {activeTab === 'notes' ? (
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add notes about this maintenance request..."
                    className="w-full min-h-[150px] rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-y"
                  />
                ) : (
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder="Add detailed instructions for the technician..."
                    className="w-full min-h-[150px] rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-y"
                  />
                )}
              </div>
            </div>

            {/* Right Column (40% - 2 of 5 columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Team */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="team">Team *</Label>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('teams');
                      onClose();
                    }}
                    className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 transition-colors"
                    title="Manage Teams"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Manage Teams</span>
                  </button>
                </div>
                <select
                  id="team"
                  value={formData.team}
                  onChange={(e) => handleTeamChange(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                  required
                >
                  <option value="">Select Team...</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.members.length} {team.members.length === 1 ? 'member' : 'members'})
                    </option>
                  ))}
                </select>
                {teams.length === 0 && (
                  <p className="text-xs text-slate-500">No teams available. Create a team first.</p>
                )}
              </div>

              {/* Technician */}
              <div className="space-y-2">
                <Label htmlFor="technician">Responsible *</Label>
                <select
                  id="technician"
                  value={formData.technician}
                  onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                  required
                  disabled={!formData.team && teams.length > 0}
                >
                  <option value="">
                    {formData.team ? 'Select Technician...' : 'Select a team first...'}
                  </option>
                  {availableTechnicians.map((member) => (
                    <option key={member.id} value={member.userId}>
                      {member.name} - {member.role.replace('_', ' ').charAt(0).toUpperCase() + member.role.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
                {formData.team && availableTechnicians.length === 0 && (
                  <p className="text-xs text-yellow-500">⚠️ This team has no members assigned</p>
                )}
              </div>

              {/* Scheduled Date */}
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Scheduled Date?</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  type="time"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="00:00"
                />
                <span className="text-xs text-slate-500">hours</span>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label>Priority *</Label>
                <PrioritySelector
                  value={formData.priority as any}
                  onChange={(priority) => setFormData({ ...formData, priority })}
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <select
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                  required
                >
                  <option value="My Company (San Francisco)">My Company (San Francisco)</option>
                  <option value="Branch Office (New York)">Branch Office (New York)</option>
                  <option value="Warehouse (Los Angeles)">Warehouse (Los Angeles)</option>
                </select>
              </div>

              {/* Worksheet Comments Button */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Worksheet Comments (3)</span>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-red-700 text-red-400 hover:bg-red-950"
              >
                Delete
              </Button>
              <Button
                type="button"
                variant="secondary"
              >
                Duplicate
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
              >
                Save
              </Button>
              <Button type="submit">
                Save & Close
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
