import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Team, TeamMember } from '@/stores/teams-store'
import { useTeamsStore } from '@/stores/teams-store'
import { Archive, Plus, Save, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TeamModalProps {
  isOpen: boolean
  onClose: () => void
  team?: Team | null
  mode: 'create' | 'edit'
}

// Mock available users for selection
const availableUsers = [
  { id: '1', name: 'Jose Mukari', email: 'jose@company.com' },
  { id: '2', name: 'Marc Demo', email: 'marc@company.com' },
  { id: '3', name: 'Maggie Davidson', email: 'maggie@company.com' },
  { id: '4', name: 'John Smith', email: 'john@company.com' },
  { id: '5', name: 'Sarah Johnson', email: 'sarah@company.com' },
  { id: '6', name: 'Mike Chen', email: 'mike@company.com' },
  { id: '7', name: 'Emily Brown', email: 'emily@company.com' }
]

export function TeamModal({ isOpen, onClose, team, mode }: TeamModalProps) {
  const addTeam = useTeamsStore((state) => state.addTeam)
  const updateTeam = useTeamsStore((state) => state.updateTeam)
  const deleteTeam = useTeamsStore((state) => state.deleteTeam)

  const getInitialFormData = () => {
    if (team && mode === 'edit') {
      return {
        name: team.name,
        company: team.company,
        description: team.description || '',
        members: team.members
      }
    }
    return {
      name: '',
      company: 'My Company (San Francisco)',
      description: '',
      members: [] as TeamMember[]
    }
  }

  const [formData, setFormData] = useState(getInitialFormData())
  const [selectedUserId, setSelectedUserId] = useState('')
  const [memberRole, setMemberRole] = useState('technician')

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData())
      setSelectedUserId('')
      setMemberRole('technician')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, team?.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mode === 'create') {
      addTeam({
        name: formData.name,
        company: formData.company,
        description: formData.description,
        members: formData.members,
        isActive: true
      })
    } else if (team) {
      updateTeam(team.id, {
        name: formData.name,
        company: formData.company,
        description: formData.description,
        members: formData.members
      })
    }
    
    onClose()
  }

  const handleAddMember = () => {
    if (!selectedUserId) return

    const user = availableUsers.find(u => u.id === selectedUserId)
    if (!user) return

    // Check if user already added
    if (formData.members.some(m => m.userId === user.id)) {
      alert('This user is already a team member')
      return
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      userId: user.id,
      name: user.name,
      email: user.email,
      role: memberRole as TeamMember['role']
    }

    setFormData({
      ...formData,
      members: [...formData.members, newMember]
    })

    setSelectedUserId('')
    setMemberRole('technician')
  }

  const handleRemoveMember = (memberId: string) => {
    setFormData({
      ...formData,
      members: formData.members.filter(m => m.id !== memberId)
    })
  }

  const handleArchive = () => {
    if (confirm('Are you sure you want to archive this team?')) {
      if (team) {
        deleteTeam(team.id)
      }
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 rounded-xl border border-slate-800 w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">
              {mode === 'create' ? 'Create New Team' : 'Edit Team'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {mode === 'create' 
                ? 'Add a new maintenance team and assign members' 
                : 'Update team information and manage members'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Team Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-100">Team Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Team Name */}
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name *</Label>
                  <Input
                    id="teamName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Internal Maintenance"
                    required
                  />
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <select
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <option value="My Company (San Francisco)">My Company (San Francisco)</option>
                    <option value="My Company (New York)">My Company (New York)</option>
                    <option value="My Company (Chicago)">My Company (Chicago)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the team's responsibilities..."
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                />
              </div>
            </div>

            {/* Team Members Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-100">Team Members</h3>

              {/* Add Member Interface */}
              <div className="bg-slate-800/30 rounded-lg p-4 space-y-3">
                <p className="text-sm text-slate-300 font-medium">Add Team Member</p>
                <div className="grid grid-cols-[1fr,200px,auto] gap-3">
                  {/* User Selection */}
                  <div className="space-y-1">
                    <Label htmlFor="selectUser" className="text-xs">Select User</Label>
                    <select
                      id="selectUser"
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <option value="">Choose a user...</option>
                      {availableUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-1">
                    <Label htmlFor="memberRole" className="text-xs">Role</Label>
                    <select
                      id="memberRole"
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <option value="team_leader">Team Leader</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="technician">Technician</option>
                      <option value="intern">Intern</option>
                    </select>
                  </div>

                  {/* Add Button */}
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={handleAddMember}
                      disabled={!selectedUserId}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-2">
                <p className="text-sm text-slate-400">
                  Current Members ({formData.members.length})
                </p>
                {formData.members.length === 0 ? (
                  <div className="bg-slate-800/20 rounded-lg p-6 text-center">
                    <p className="text-sm text-slate-500">No members added yet</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Add users to this team using the form above
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3 border border-slate-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-300">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200">{member.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-xs text-slate-400">{member.email}</p>
                              {member.role && (
                                <>
                                  <span className="text-slate-600">•</span>
                                  <span className="text-xs text-slate-500 capitalize">
                                    {member.role.replace('_', ' ')}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-slate-800 bg-slate-900/50">
            <div className="flex gap-2">
              {mode === 'edit' && (
                <Button
                  type="button"
                  onClick={handleArchive}
                  variant="outline"
                  className="border-red-900/50 text-red-400 hover:bg-red-950/50"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Team
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Create Team' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
