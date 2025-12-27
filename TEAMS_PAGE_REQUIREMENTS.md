# Teams Page Requirements

## Overview
The Teams page is a core module for managing maintenance teams and their members. It provides a comprehensive view of all teams, their members, and allows team creation and management.

## Page Structure

### Header Section
- **Title**: "Teams" displayed prominently
- **Action Button**: "New" button (primary CTA) - Opens team creation/edit modal
- **Consistent Navigation**: Same dark theme and layout as Dashboard

### Main Content - Teams Table

#### Table Columns
1. **Team Name** (Left aligned)
   - Display team/department name
   - Examples: "Internal Maintenance", "Metrology", "Subcontractor"
   - Should be clickable to open team details/edit modal
   
2. **Team Members** (Center)
   - Display list of team member names
   - Multiple members shown as comma-separated or stacked
   - Examples: "Jose Mukari", "Marc Demo", "Maggie Davidson"
   - Could show avatar initials similar to dashboard table
   
3. **Company** (Right aligned)
   - Display company/location information
   - Format: "Company Name (Location)"
   - Example: "My Company (San Francisco)"

#### Table Features
- Dark theme consistent with existing UI (slate-900 background, slate-800 borders)
- Hover state on rows (slate-800/50 background)
- Clickable rows to open team detail/edit view
- Alternating row styling optional for better readability
- Empty state when no teams exist

## Team Creation Modal (When "New" is clicked)

### Modal Structure
Based on the note "Team member creation list view", the modal should include:

#### Basic Team Information Section
- **Team Name** (Required input field)
  - Text input for team/department name
  - Placeholder: "e.g., Internal Maintenance, Electrical Team"
  
- **Company** (Dropdown/Select)
  - Select company/location
  - Default: "My Company (San Francisco)"
  - Should support multiple companies if multi-company setup
  
- **Description** (Optional textarea)
  - Brief description of team purpose
  - Placeholder: "Describe the team's responsibilities..."

#### Team Members Section
This is the key feature - managing team members:

1. **Member List Display**
   - Show current team members in a list format
   - Each member row shows:
     - Avatar/Initials
     - Full name
     - Email (optional)
     - Role/Position (optional)
     - Remove button (X icon)

2. **Add Members Interface**
   - **Option 1**: Dropdown to select from existing users
   - **Option 2**: Multi-select dropdown with search
   - **Option 3**: Modal picker with user list
   - "Add Member" button to add more members

3. **Member Details**
   - When adding a member, capture:
     - User selection (from existing users)
     - Role in team (Team Leader, Technician, etc.)
     - Start date (optional)

#### Modal Actions
- **Save** - Create/update team
- **Cancel** - Close without saving
- **Archive** - Soft delete team (if editing existing)

## Team Detail/Edit View (When clicking a row)

### Two Possible Approaches:

#### Approach 1: Same Modal (Edit Mode)
- Reuse the creation modal with pre-filled data
- Show all team information
- Allow editing team name, company, members

#### Approach 2: Dedicated Detail View
- Full page or slide-out panel
- More comprehensive information:
  - Team statistics (# of members, # of active requests)
  - Recent maintenance activities by this team
  - Team performance metrics
  - Full member list with detailed info

## UI Design Specifications

### Color Scheme (Dark Theme)
- **Background**: slate-950
- **Card/Container**: slate-900
- **Borders**: slate-800
- **Text Primary**: slate-100
- **Text Secondary**: slate-300/400
- **Accent**: blue-600 for primary actions
- **Hover States**: slate-800/50

### Typography
- **Page Title**: text-2xl, font-semibold
- **Table Headers**: text-sm, font-semibold, text-slate-300
- **Table Data**: text-sm, text-slate-200/300
- **Labels**: text-sm, font-medium

### Spacing & Layout
- Consistent padding with Dashboard (p-6 for main container)
- Table cell padding: py-4 px-6
- Modal width: max-w-2xl or max-w-3xl depending on content
- Gap between elements: gap-4 to gap-6

## Functional Requirements

### Features to Implement

1. **Team CRUD Operations**
   - Create new team
   - Read/View team list
   - Update team information
   - Delete/Archive team (with confirmation)

2. **Member Management**
   - Add members to team
   - Remove members from team
   - Update member roles
   - View member details

3. **Search & Filter** (Future enhancement)
   - Search teams by name
   - Filter by company/location
   - Sort by team name, member count, etc.

4. **Validation**
   - Team name required
   - At least one member required (or optional)
   - Duplicate team name warning
   - Cannot remove all members from active team

5. **Empty States**
   - No teams created yet
   - No members in team
   - Clear call-to-action to create first team

## Data Structure

### Team Object
```typescript
interface Team {
  id: string
  name: string
  company: string
  companyLocation?: string
  description?: string
  members: TeamMember[]
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}
```

### Team Member Object
```typescript
interface TeamMember {
  id: string
  userId: string
  userName: string
  userEmail?: string
  role?: string // 'team_leader' | 'technician' | 'supervisor'
  joinedAt: Date
  avatar?: string
}
```

## Integration Points

1. **User Management**
   - Pull available users for team member selection
   - Display user information (name, email, avatar)

2. **Maintenance Requests**
   - Teams should be selectable in maintenance request modal
   - Link requests to teams for assignment

3. **Dashboard**
   - Team statistics could be shown on dashboard
   - Filter maintenance requests by team

## Mock Data for Development

```javascript
const mockTeams = [
  {
    id: '1',
    name: 'Internal Maintenance',
    company: 'My Company (San Francisco)',
    members: [
      { id: '1', name: 'Jose Mukari', email: 'jose@company.com' }
    ],
    description: 'Handles all internal equipment maintenance'
  },
  {
    id: '2',
    name: 'Metrology',
    company: 'My Company (San Francisco)',
    members: [
      { id: '2', name: 'Marc Demo', email: 'marc@company.com' }
    ],
    description: 'Precision measurement and calibration team'
  },
  {
    id: '3',
    name: 'Subcontractor',
    company: 'My Company (San Francisco)',
    members: [
      { id: '3', name: 'Maggie Davidson', email: 'maggie@company.com' }
    ],
    description: 'External contractor coordination'
  }
]
```

## Implementation Priority

### Phase 1 (MVP)
1. ✅ Teams page layout with header
2. ✅ Teams table with three columns
3. ✅ Mock data display
4. ✅ "New" button UI
5. ✅ Basic team creation modal

### Phase 2
1. Team member management in modal
2. Add/remove members functionality
3. Row click to edit team
4. Delete/Archive team

### Phase 3
1. Search and filter functionality
2. Team statistics
3. Integration with maintenance requests
4. User selection from existing users database

## Notes
- The image shows a simple, clean interface focused on clarity
- Each team has at least one member shown
- The table format is consistent with the maintenance requests table
- The "Team member creation list view" suggests a dedicated UI for managing members within teams
- Multi-select or list management for team members is a key feature
