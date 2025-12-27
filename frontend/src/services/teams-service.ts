/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/api'
import type { Team, TeamMember } from '@/stores/teams-store'

interface TeamPayload {
  name: string
  company: string
  description?: string
  members: Array<{
    user_id: string
    name?: string
    email?: string
    role?: string
  }>
}

export const teamsService = {
  // Get all teams
  async getTeams(filters?: { isActive?: boolean; company?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams()
    
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString())
    if (filters?.company) params.append('company', filters.company)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const response = await api.get(`/teams?${params.toString()}`)
    
    // Transform backend response to frontend format
    const teams = response.data.data.teams.map((team: any) => ({
      id: team.id,
      name: team.name,
      company: team.company?.name || team.company || 'Unknown',
      members: (team.members || []).map((member: any) => ({
        id: member.id,
        userId: member.user_id,
        name: member.name || member.user?.full_name,
        email: member.email || member.user?.email,
        role: member.role || 'technician',
      })),
      description: team.description,
      isActive: team.is_active !== false,
    }))

    return {
      teams,
      pagination: response.data.data.pagination,
    }
  },

  // Get single team
  async getTeam(id: string) {
    const response = await api.get(`/teams/${id}`)
    const team = response.data.data

    return {
      id: team.id,
      name: team.name,
      company: team.company?.name || team.company || 'Unknown',
      members: (team.members || []).map((member: any) => ({
        id: member.id,
        userId: member.user_id,
        name: member.name || member.user?.full_name,
        email: member.email || member.user?.email,
        role: member.role || 'technician',
      })),
      description: team.description,
      isActive: team.is_active !== false,
    } as Team
  },

  // Create team
  async createTeam(team: Omit<Team, 'id'>) {
    const payload: TeamPayload = {
      name: team.name,
      company: team.company,
      description: team.description,
      members: team.members.map((member) => ({
        user_id: member.userId,
        name: member.name,
        email: member.email,
        role: member.role,
      })),
    }

    const response = await api.post('/teams', payload)
    const newTeam = response.data.data

    return {
      id: newTeam.id,
      name: newTeam.name,
      company: newTeam.company?.name || newTeam.company || 'Unknown',
      members: (newTeam.members || []).map((member: any) => ({
        id: member.id,
        userId: member.user_id,
        name: member.name || member.user?.full_name,
        email: member.email || member.user?.email,
        role: member.role || 'technician',
      })),
      description: newTeam.description,
      isActive: newTeam.is_active !== false,
    } as Team
  },

  // Update team
  async updateTeam(id: string, updates: Partial<Team>) {
    const payload: Record<string, any> = {}

    if (updates.name !== undefined) payload.name = updates.name
    if (updates.company !== undefined) payload.company = updates.company
    if (updates.description !== undefined) payload.description = updates.description
    if (updates.members !== undefined) {
      payload.members = updates.members.map((member) => ({
        id: member.id,
        user_id: member.userId,
        name: member.name,
        email: member.email,
        role: member.role,
      }))
    }

    const response = await api.patch(`/teams/${id}`, payload)
    const team = response.data.data

    return {
      id: team.id,
      name: team.name,
      company: team.company?.name || team.company || 'Unknown',
      members: (team.members || []).map((member: any) => ({
        id: member.id,
        userId: member.user_id,
        name: member.name || member.user?.full_name,
        email: member.email || member.user?.email,
        role: member.role || 'technician',
      })),
      description: team.description,
      isActive: team.is_active !== false,
    } as Team
  },

  // Delete team
  async deleteTeam(id: string, force: boolean = false) {
    const params = new URLSearchParams()
    if (force) params.append('force', 'true')

    const response = await api.delete(`/teams/${id}?${params.toString()}`)
    return response.data
  },

  // Get team members
  async getTeamMembers(teamId: string) {
    const response = await api.get(`/teams/${teamId}/members`)
    
    return (response.data.data.members || []).map((member: any) => ({
      id: member.id,
      userId: member.user_id,
      name: member.name || member.user?.full_name,
      email: member.email || member.user?.email,
      role: member.role || 'technician',
    })) as TeamMember[]
  },
}
