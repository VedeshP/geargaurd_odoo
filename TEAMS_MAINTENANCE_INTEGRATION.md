# Teams & Maintenance Request Modal Integration Plan

## Overview
This plan outlines the integration between the Teams management system and the Maintenance Request Modal to ensure data consistency and seamless navigation between the two features.

## Current State Analysis

### Teams Page
- Displays list of teams with members
- Mock data: Internal Maintenance, Metrology, Subcontractor teams
- Team creation/editing functionality
- Team members with roles (Team Leader, Supervisor, Technician, Intern)

### Maintenance Request Modal
- Has a "Team" dropdown field (currently using hardcoded options)
- Has a "Responsible" dropdown (currently using hardcoded technician names)
- No connection to actual Teams data

## Integration Goals

### 1. Shared Data Source
**Problem**: Teams data is currently duplicated (mock data in Teams page vs hardcoded in modal)

**Solution**: Create a centralized data store/context for teams
- Create a `TeamsContext` or use Zustand store for global teams state
- Both Teams page and Maintenance Modal will consume from the same source
- Updates in Teams page will immediately reflect in Maintenance Modal

**Implementation**:
```typescript
// Shared teams store structure
interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  role: 'team_leader' | 'supervisor' | 'technician' | 'intern'
}

interface Team {
  id: string
  name: string
  company: string
  members: TeamMember[]
  description?: string
}

// Store will provide:
- teams: Team[]
- addTeam(team: Team): void
- updateTeam(id: string, team: Partial<Team>): void
- deleteTeam(id: string): void
- getTeamMembers(teamId: string): TeamMember[]
```

### 2. Dynamic Team Selection in Maintenance Modal

**Current**: Hardcoded team options in dropdown
```typescript
<option value="internal">Internal Maintenance</option>
<option value="external">External Contractors</option>
```

**New Implementation**:
- Populate team dropdown dynamically from teams store
- Display actual team names from Teams page
- Show team member count or company info as secondary text

**UI Enhancement**:
```typescript
<select>
  <option value="">Select Team...</option>
  {teams.map(team => (
    <option key={team.id} value={team.id}>
      {team.name} ({team.members.length} members)
    </option>
  ))}
</select>
```

### 3. Dynamic Technician/Responsible Selection

**Current**: Hardcoded technician list in Responsible dropdown

**New Implementation**:
- When a team is selected, populate "Responsible" dropdown with team members only
- Filter by role if needed (e.g., only show technicians and team leaders)
- If no team selected, show all available users across all teams

**Cascading Selection Logic**:
1. User selects a Team → "Responsible" dropdown updates to show only that team's members
2. User can then select a specific technician from that team
3. If team is changed, responsible selection resets

**UI Flow**:
```typescript
// When team changes:
const handleTeamChange = (teamId: string) => {
  setFormData({ ...formData, team: teamId, responsible: '' })
  // Populate available technicians
  const teamMembers = getTeamMembers(teamId)
  setAvailableTechnicians(teamMembers)
}
```

### 4. Quick Access to Teams Management

**Problem**: Users may need to create a new team while filling maintenance request

**Solution**: Add "Manage Teams" or "Create Team" quick action in modal

**Implementation Options**:

#### Option A: Link to Teams Tab
- Add a small "Manage Teams" link/button next to Team dropdown
- Clicking opens Teams tab in new context or switches active tab
- User can create team and return to modal

#### Option B: Inline Team Creation
- Add "+ New Team" option at bottom of Team dropdown
- Opens a compact team creation dialog/drawer
- After creating team, it becomes available in dropdown immediately

#### Option C: Combined Approach (Recommended)
- Primary: "+ New Team" quick action in dropdown
- Secondary: Small external link icon to open full Teams page
```
Team: [Dropdown ▼] [+ New Team] [→ Manage Teams]
```

## Proposed UI Changes

### Maintenance Request Modal Updates

#### Team Selection Section
```
┌─────────────────────────────────────────────────┐
│ Team *                              [→ Teams]   │
│ ┌──────────────────────────────────────────┐   │
│ │ Select Team...                        ▼  │   │
│ │ - Internal Maintenance (1 member)        │   │
│ │ - Metrology (1 member)                   │   │
│ │ - Subcontractor (1 member)               │   │
│ │ ─────────────────────────────────        │   │
│ │ + Create New Team                        │   │
│ └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

#### Responsible/Technician Selection (Cascading)
```
┌─────────────────────────────────────────────────┐
│ Responsible                                     │
│ ┌──────────────────────────────────────────┐   │
│ │ Select Technician...                  ▼  │   │
│ │ (Shows members from selected team)       │   │
│ │ - Jose Mukari (Team Leader)              │   │
│ └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Teams Page Updates

#### Add "Referenced In" Information (Optional Enhancement)
- Show how many active maintenance requests each team has
- Add a badge or counter next to team name
```
Internal Maintenance    Jose Mukari    My Company (SF)    [5 Active Requests]
```

## Implementation Steps

### Phase 1: Data Layer
1. ✅ Create shared teams store (Zustand or Context)
   - Define interfaces
   - Implement CRUD operations
   - Add initial mock data

2. ✅ Move teams data to shared store
   - Update Teams page to use store
   - Update mock data to be centralized

### Phase 2: Modal Integration
3. ✅ Update Maintenance Modal Team dropdown
   - Consume teams from store
   - Display dynamic team list
   - Add team member count

4. ✅ Implement cascading Responsible dropdown
   - Filter by selected team
   - Show all if no team selected
   - Reset when team changes

### Phase 3: Quick Actions
5. ✅ Add "Manage Teams" link in modal
   - Small icon/link next to Team field
   - Opens Teams tab or navigates to Teams page

6. ✅ Optional: Add "+ New Team" quick creation
   - Inline mini-form or modal
   - Quick team creation without leaving modal

### Phase 4: Data Consistency
7. ✅ Ensure real-time updates
   - When team is created/updated in Teams page
   - Modal immediately reflects changes
   - No page refresh needed

8. ✅ Add validation
   - Cannot assign request to archived team
   - Cannot select non-existent team members
   - Show warning if team has no members

## Technical Implementation Details

### 1. Create Teams Store (src/stores/teams-store.ts)
```typescript
import { create } from 'zustand'

interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  role: 'team_leader' | 'supervisor' | 'technician' | 'intern'
}

interface Team {
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
    // Initial mock data
  ],
  addTeam: (team) => set((state) => ({
    teams: [...state.teams, { ...team, id: Date.now().toString() }]
  })),
  updateTeam: (id, updates) => set((state) => ({
    teams: state.teams.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTeam: (id) => set((state) => ({
    teams: state.teams.filter(t => t.id !== id)
  })),
  getTeam: (id) => get().teams.find(t => t.id === id),
  getTeamMembers: (teamId) => {
    const team = get().teams.find(t => t.id === teamId)
    return team?.members || []
  },
  getAllMembers: () => {
    return get().teams.flatMap(t => t.members)
  }
}))
```

### 2. Update Teams Page
- Replace local state with `useTeamsStore`
- All CRUD operations go through store

### 3. Update Maintenance Modal
```typescript
const { teams, getTeamMembers } = useTeamsStore()
const [availableTechnicians, setAvailableTechnicians] = useState<TeamMember[]>([])

// When team selection changes
const handleTeamChange = (teamId: string) => {
  setFormData(prev => ({ ...prev, team: teamId, responsible: '' }))
  
  if (teamId) {
    const members = getTeamMembers(teamId)
    setAvailableTechnicians(members)
  } else {
    // Show all members if no team selected
    setAvailableTechnicians(getAllMembers())
  }
}
```

### 4. Add Navigation Link
```typescript
// In Maintenance Modal, next to Team dropdown
<button
  type="button"
  onClick={() => onNavigateToTeams()}
  className="text-blue-400 hover:text-blue-300 text-sm"
>
  <ExternalLink className="w-4 h-4" />
</button>

// Pass handler from DashboardPage
const handleNavigateToTeams = () => {
  setActiveTab('teams')
  setIsCreateModalOpen(false) // Close maintenance modal
}
```

## Data Flow Diagram

```
┌─────────────────┐
│  Teams Store    │
│  (Zustand)      │
│  - teams[]      │
│  - CRUD ops     │
└────────┬────────┘
         │
    ┌────┴─────┐
    ↓          ↓
┌───────────┐  ┌──────────────────────┐
│Teams Page │  │Maintenance Modal     │
│           │  │                      │
│- List     │  │- Team Dropdown       │
│- Create   │  │  (dynamic from store)│
│- Edit     │  │                      │
│- Delete   │  │- Responsible         │
│           │  │  (filtered by team)  │
│           │  │                      │
│           │  │- [Manage Teams] btn  │
│           │←─┤  (navigate to Teams)│
└───────────┘  └──────────────────────┘
```

## User Experience Flow

### Scenario 1: Create Maintenance Request with Existing Team
1. User clicks "New" button
2. Maintenance Modal opens
3. User clicks Team dropdown → sees all active teams
4. User selects "Internal Maintenance"
5. Responsible dropdown auto-updates → shows only Internal Maintenance members
6. User selects "Jose Mukari"
7. Completes rest of form and saves

### Scenario 2: Create Maintenance Request, Team Doesn't Exist
1. User clicks "New" button
2. Maintenance Modal opens
3. User clicks Team dropdown → doesn't find needed team
4. User clicks "Manage Teams" link
5. Dashboard switches to Teams tab
6. User creates new team "Electrical Team" with members
7. User navigates back to Maintenance tab
8. Opens new maintenance request
9. "Electrical Team" now appears in dropdown

### Scenario 3: Quick Team Creation (Optional)
1. User clicks "New" button
2. Maintenance Modal opens
3. User clicks "+ New Team" in dropdown
4. Mini team creation form appears (inline or dialog)
5. User enters team name and adds members quickly
6. Saves team
7. Team immediately available in dropdown
8. User continues with maintenance request

## Validation Rules

### Team Selection
- ✅ Must select a team (required field)
- ✅ Cannot select archived/inactive teams
- ⚠️ Warning if team has no members

### Responsible Selection
- ✅ Required field
- ✅ Must be from selected team (if team is selected)
- ✅ Must be an active team member

### Data Integrity
- ✅ If team is deleted, existing requests show team name but marked as "Archived"
- ✅ If team member is removed, existing assignments remain but show "(No longer in team)"

## Testing Checklist

### Integration Tests
- [ ] Create team in Teams page → appears in Maintenance Modal dropdown
- [ ] Update team name → reflects in Maintenance Modal
- [ ] Add member to team → appears in Responsible dropdown
- [ ] Delete team → removed from dropdown (existing requests unaffected)
- [ ] Select team → Responsible dropdown filters correctly
- [ ] Change team → Responsible resets and re-populates
- [ ] Click "Manage Teams" → navigates to Teams tab
- [ ] Create team from modal (if implemented) → saves and appears immediately

### Edge Cases
- [ ] No teams exist → show appropriate message
- [ ] Team has no members → show warning
- [ ] All teams archived → handle gracefully
- [ ] Select team, then deselect → Responsible shows all members again

## Benefits

### For Users
✅ **Consistency**: Same team data across entire application
✅ **Efficiency**: Quick access to team management without leaving workflow
✅ **Accuracy**: Can only assign to actual team members
✅ **Flexibility**: Can create teams on-the-fly if needed

### For Developers
✅ **Single Source of Truth**: Centralized data management
✅ **Maintainability**: Changes in one place affect entire app
✅ **Scalability**: Easy to extend with more features
✅ **Type Safety**: Strong TypeScript interfaces prevent errors

## Future Enhancements (Out of Scope)
- Team-based permissions and access control
- Team performance metrics in Dashboard
- Team workload balancing suggestions
- Team calendar and availability
- Notification when team member is assigned
- Team-based filtering in maintenance requests table
