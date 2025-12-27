import { create } from 'zustand'

export interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  role: 'team_leader' | 'supervisor' | 'technician' | 'intern'
}

export interface Team {
  id: string
  name: string
  company: string
  members: TeamMember[]
  description?: string
  isActive: boolean
}

interface TeamsStore {
  teams: Team[]
  addTeam: (team: Omit<Team, 'id'>) => void
  updateTeam: (id: string, team: Partial<Team>) => void
  deleteTeam: (id: string) => void
  getTeam: (id: string) => Team | undefined
  getTeamMembers: (teamId: string) => TeamMember[]
  getAllMembers: () => TeamMember[]
}

export const useTeamsStore = create<TeamsStore>((set, get) => ({
  teams: [
    {
      id: '1',
      name: 'Internal Maintenance',
      company: 'My Company (San Francisco)',
      isActive: true,
      members: [
        {
          id: '1',
          userId: '1',
          name: 'Jose Mukari',
          email: 'jose@company.com',
          role: 'team_leader'
        }
      ],
      description: 'Handles all internal equipment maintenance'
    },
    {
      id: '2',
      name: 'Metrology',
      company: 'My Company (San Francisco)',
      isActive: true,
      members: [
        {
          id: '2',
          userId: '2',
          name: 'Marc Demo',
          email: 'marc@company.com',
          role: 'technician'
        }
      ],
      description: 'Precision measurement and calibration team'
    },
    {
      id: '3',
      name: 'Subcontractor',
      company: 'My Company (San Francisco)',
      isActive: true,
      members: [
        {
          id: '3',
          userId: '3',
          name: 'Maggie Davidson',
          email: 'maggie@company.com',
          role: 'supervisor'
        }
      ],
      description: 'External contractor coordination'
    }
  ],
  
  addTeam: (team) => set((state) => ({
    teams: [...state.teams, { ...team, id: Date.now().toString() }]
  })),
  
  updateTeam: (id, updates) => set((state) => ({
    teams: state.teams.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  
  deleteTeam: (id) => set((state) => ({
    teams: state.teams.map(t => t.id === id ? { ...t, isActive: false } : t)
  })),
  
  getTeam: (id) => get().teams.find(t => t.id === id),
  
  getTeamMembers: (teamId) => {
    const team = get().teams.find(t => t.id === teamId)
    return team?.members || []
  },
  
  getAllMembers: () => {
    return get().teams
      .filter(t => t.isActive)
      .flatMap(t => t.members)
  }
}))
