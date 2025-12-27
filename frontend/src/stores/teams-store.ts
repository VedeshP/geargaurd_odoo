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
  isLoading: boolean
  error: string | null
  
  fetchTeams: (filters?: any) => Promise<void>
  addTeam: (team: Omit<Team, 'id'>) => Promise<void>
  updateTeam: (id: string, team: Partial<Team>) => Promise<void>
  deleteTeam: (id: string) => Promise<void>
  getTeam: (id: string) => Team | undefined
  getTeamMembers: (teamId: string) => TeamMember[]
  getAllMembers: () => TeamMember[]
}

// Mock teams data
const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Internal Maintenance',
    company: 'My Company',
    description: 'Core maintenance team for internal operations',
    members: [
      {
        id: '1',
        userId: 'user-1',
        name: 'Jose Mukari',
        email: 'jose@company.com',
        role: 'team_leader',
      },
      {
        id: '2',
        userId: 'user-2',
        name: 'Marcus Twain',
        email: 'marcus@company.com',
        role: 'technician',
      },
      {
        id: '3',
        userId: 'user-3',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        role: 'technician',
      },
    ],
    isActive: true,
  },
  {
    id: '2',
    name: 'IT Support Team',
    company: 'My Company',
    description: 'Technical support and computer maintenance',
    members: [
      {
        id: '4',
        userId: 'user-4',
        name: 'David Chen',
        email: 'david@company.com',
        role: 'team_leader',
      },
      {
        id: '5',
        userId: 'user-5',
        name: 'Emily White',
        email: 'emily@company.com',
        role: 'technician',
      },
    ],
    isActive: true,
  },
]

export const useTeamsStore = create<TeamsStore>((set, get) => ({
  teams: [],
  isLoading: false,
  error: null,

  fetchTeams: async () => {
    set({ isLoading: true, error: null, teams: mockTeams })
    await new Promise(resolve => setTimeout(resolve, 300))
    set({ isLoading: false })
  },
  
  addTeam: async (team) => {
    set({ isLoading: true, error: null })
    await new Promise(resolve => setTimeout(resolve, 300))
    const newTeam: Team = {
      ...team,
      id: 'team-' + Date.now(),
      isActive: true,
    }
    set((state) => ({
      teams: [...state.teams, newTeam],
      isLoading: false,
    }))
  },
  
  updateTeam: async (id, updates) => {
    set({ isLoading: true, error: null })
    await new Promise(resolve => setTimeout(resolve, 300))
    set((state) => ({
      teams: state.teams.map(t => t.id === id ? { ...t, ...updates } : t),
      isLoading: false,
    }))
  },
  
  deleteTeam: async (id) => {
    set({ isLoading: true, error: null })
    await new Promise(resolve => setTimeout(resolve, 300))
    set((state) => ({
      teams: state.teams.filter(t => t.id !== id),
      isLoading: false,
    }))
  },
  
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
