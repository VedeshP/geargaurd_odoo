import { EntityBadge } from '@/components/shared/EntityBadge'
import { useEquipmentStore } from '@/stores/equipment-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import type { Team } from '@/stores/teams-store'
import { useTeamsStore } from '@/stores/teams-store'
import { useMemo, useState } from 'react'
import { TeamModal } from './TeamModal'

export function TeamsTable() {
  const allTeams = useTeamsStore((state) => state.teams)
  const teams = useMemo(() => allTeams.filter((t) => t.isActive), [allTeams])

  const equipment = useEquipmentStore((state) => state.equipment)
  const getRequestCountByTeam = useMaintenanceStore((state) => state.getRequestCountByTeam)

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Helper to count equipment assigned to team members
  const getTeamEquipmentCount = (teamId: string) => {
    const team = allTeams.find((t) => t.id === teamId)
    if (!team) return 0
    const memberIds = team.members.map((m) => m.userId)
    return equipment.filter((eq) => eq.technicianId && memberIds.includes(eq.technicianId) && eq.isActive).length
  }

  const handleRowClick = (team: Team) => {
    setSelectedTeam(team)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                  Team Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                  Team Members
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                  Assignments
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                  Company
                </th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr
                  key={team.id}
                  onClick={() => handleRowClick(team)}
                  className={`
                    border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer
                    ${index === teams.length - 1 ? 'border-b-0' : ''}
                  `}
                >
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-200 font-medium">
                      {team.name}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {team.members.map((member) => (
                        <div key={member.userId} className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-medium text-white">
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <span className="text-sm text-slate-300">{member.name}</span>
                        </div>
                      ))}
                      {team.members.length === 0 && (
                        <span className="text-sm text-slate-500 italic">No members</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <EntityBadge
                        type="equipment"
                        id={team.id}
                        label="Equipment"
                        count={getTeamEquipmentCount(team.id)}
                        variant="secondary"
                      />
                      <EntityBadge
                        type="maintenance"
                        id={team.id}
                        label="Active Requests"
                        count={getRequestCountByTeam(team.id)}
                        variant="secondary"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-400">{team.company}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {teams.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-400">No teams found</p>
            <p className="text-sm text-slate-500 mt-1">
              Create your first team to get started
            </p>
          </div>
        )}
      </div>

      {/* Team Edit Modal */}
      <TeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        team={selectedTeam}
        mode="edit"
      />
    </>
  )
}
