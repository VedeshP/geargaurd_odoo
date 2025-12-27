# 🔗 Unified Interlinking Plan: Dashboard, Equipment & Teams

## Executive Summary

This plan establishes a comprehensive, modular, and unified interlinking architecture between the three core modules: **Dashboard**, **Equipment**, and **Teams**. The goal is to eliminate duplication, ensure perfect synchronization, and maintain modularity while enabling seamless cross-module navigation and data flow.

---

## Current State Analysis

### ✅ What's Working Well

1. **Zustand Store Pattern**
   - Each module has its own dedicated store
   - Teams store is shared across Maintenance and Equipment
   - Proper separation of concerns

2. **Navigation Callbacks**
   - Equipment → Categories navigation working
   - Maintenance → Teams navigation working
   - Dashboard tab-based routing functional

3. **Data Integration**
   - Equipment Modal uses Teams for technicians
   - Maintenance Modal uses Teams for team/technician assignment
   - Categories store integrated with Equipment Modal

### ⚠️ Current Issues

1. **Duplicate Data References**
   - Equipment has `technicianId` and `technicianName` (denormalized)
   - Maintenance has hardcoded equipment list
   - No central Equipment reference in Maintenance

2. **Missing Cross-References**
   - Equipment doesn't link to Maintenance Requests
   - Teams don't show assigned equipment
   - Dashboard doesn't link to specific equipment/teams

3. **Inconsistent Navigation Patterns**
   - Some modals navigate via callbacks
   - Some use tab switching
   - No unified navigation service

4. **State Synchronization Gaps**
   - Updating team member doesn't cascade to Equipment
   - Deleting equipment doesn't update Maintenance
   - No real-time sync between modules

---

## Unified Architecture

### 1. Data Flow Model

```
┌─────────────────────────────────────────────────────────────┐
│                      Dashboard (Orchestrator)                │
│  - Tab Navigation Controller                                 │
│  - Cross-module Action Dispatcher                            │
│  - Global State Observer                                     │
└───────────────┬─────────────────┬─────────────────┬─────────┘
                │                 │                 │
        ┌───────▼────────┐ ┌─────▼──────┐ ┌───────▼────────┐
        │   Maintenance  │ │  Equipment │ │     Teams      │
        │   (Consumer)   │ │  (Bridge)  │ │   (Provider)   │
        └────────────────┘ └────────────┘ └────────────────┘
                ▲                 ▲                 │
                │                 │                 │
                └─────── Uses ────┴─────── Uses ───┘
```

**Data Flow Hierarchy:**
- **Teams** = Primary Data Provider (users, roles, assignments)
- **Equipment** = Bridge Module (uses Teams, provides to Maintenance)
- **Maintenance** = Consumer (uses both Teams and Equipment)
- **Dashboard** = Orchestrator (coordinates all modules)

---

### 2. Store Dependency Map

```typescript
// Clear dependency chain
teams-store.ts           → Base layer (no dependencies)
  ↓
equipment-categories-store.ts → Uses: teams-store
  ↓
equipment-store.ts       → Uses: teams-store, equipment-categories-store
  ↓
maintenance-store.ts     → Uses: teams-store, equipment-store (NEW)
```

**Implementation Rules:**
1. Lower layers NEVER import from higher layers
2. Each store exports typed selectors
3. All cross-store data access via Zustand selectors only
4. No direct store manipulation across boundaries

---

### 3. Navigation System Architecture

#### A. Unified Navigation Service

**Create:** `frontend/src/services/navigation-service.ts`

```typescript
export type AppView = 
  | 'dashboard' 
  | 'maintenance' 
  | 'equipment' 
  | 'equipment-categories'
  | 'teams'

export interface NavigationContext {
  sourceView: AppView
  targetView: AppView
  params?: {
    equipmentId?: string
    teamId?: string
    requestId?: string
    action?: 'create' | 'edit' | 'view'
  }
  onReturn?: () => void
}

class NavigationService {
  private listeners: ((context: NavigationContext) => void)[] = []
  
  navigate(context: NavigationContext): void
  goBack(result?: any): void
  registerListener(callback: (context: NavigationContext) => void): () => void
}

export const navigationService = new NavigationService()
```

#### B. Navigation Hooks

**Create:** `frontend/src/hooks/use-navigation.ts`

```typescript
export function useNavigation() {
  const navigate = (context: NavigationContext) => {
    navigationService.navigate(context)
  }
  
  const navigateToEquipment = (equipmentId?: string) => {
    navigate({
      sourceView: getCurrentView(),
      targetView: 'equipment',
      params: { equipmentId, action: equipmentId ? 'view' : 'create' }
    })
  }
  
  const navigateToTeam = (teamId?: string) => { /* ... */ }
  const navigateToMaintenance = (requestId?: string) => { /* ... */ }
  
  return {
    navigate,
    navigateToEquipment,
    navigateToTeam,
    navigateToMaintenance,
    goBack: navigationService.goBack
  }
}
```

---

### 4. Cross-Module Linking Strategy

#### A. Dashboard → Equipment

**Scenarios:**
1. Click equipment name in Maintenance table → Open Equipment Modal (view mode)
2. Click "View All Equipment" → Navigate to Equipment tab
3. Equipment count metric → Navigate to Equipment tab with filter

**Implementation:**
```typescript
// In MaintenanceRequestsTable
const { navigateToEquipment } = useNavigation()

<td onClick={() => navigateToEquipment(request.equipmentId)} 
    className="cursor-pointer hover:text-blue-400">
  {request.equipment}
</td>
```

#### B. Dashboard → Teams

**Scenarios:**
1. Click team name in Maintenance table → Navigate to Teams tab with team highlighted
2. Click maintainer name → Navigate to Teams tab, open Team Modal showing that member
3. "Create Team" link when no teams exist → Navigate to Teams tab, auto-open create modal

**Implementation:**
```typescript
// In MaintenanceRequestsTable
const { navigateToTeam } = useNavigation()

<td onClick={() => navigateToTeam(request.teamId)} 
    className="cursor-pointer hover:text-blue-400">
  {request.team}
</td>
```

#### C. Equipment → Teams

**Scenarios:**
1. Click technician/maintainer in Equipment table → Navigate to Teams, highlight member
2. Click maintenance team → Navigate to Teams tab, show that team
3. "Assign Team" in modal → Quick link to create/select team

**Current:** ✅ Already has `onNavigateToTeams` callback
**Enhancement:** Pass team/member ID for targeted navigation

#### D. Equipment → Maintenance

**Scenarios:**
1. View equipment maintenance history → Show related requests
2. "Create Maintenance Request" from Equipment Modal → Pre-fill equipment data
3. Equipment status badge shows "In Maintenance" → Click to view active request

**Implementation:**
```typescript
// Add to Equipment interface
maintenanceRequests?: string[] // Array of request IDs

// In EquipmentTable
<StatusBadge 
  status={eq.status}
  onClick={() => {
    if (eq.status === 'In Maintenance') {
      navigateToMaintenance(eq.activeMaintenanceRequestId)
    }
  }}
/>
```

#### E. Teams → Equipment

**Scenarios:**
1. View team's assigned equipment → Filter equipment by team
2. View member's assigned equipment → Filter equipment by technician
3. "Equipment Count" badge in team row → Navigate to Equipment filtered by team

**Implementation:**
```typescript
// In TeamsTable, add equipment count
<td>
  <span className="text-xs text-slate-400">
    {getTeamEquipmentCount(team.id)} equipment assigned
  </span>
  <button onClick={() => navigateToEquipment({ teamFilter: team.id })}>
    View Equipment →
  </button>
</td>
```

#### F. Teams → Maintenance

**Scenarios:**
1. View team's maintenance requests → Filter maintenance by team
2. View member's assigned requests → Filter maintenance by technician
3. "Active Requests" count in team card → Navigate to Maintenance filtered by team

**Implementation:**
```typescript
// In TeamsTable
<div className="flex gap-2 mt-2">
  <Badge>
    {getTeamRequestCount(team.id)} active requests
  </Badge>
  <button onClick={() => navigateToMaintenance({ teamFilter: team.id })}>
    View Requests →
  </button>
</div>
```

---

### 5. Data Synchronization Strategy

#### A. Create Maintenance Store

**New File:** `frontend/src/stores/maintenance-store.ts`

```typescript
import { create } from 'zustand'
import { useEquipmentStore } from './equipment-store'
import { useTeamsStore } from './teams-store'

export interface MaintenanceRequest {
  id: string
  subject: string
  equipmentId: string  // Reference, not denormalized
  teamId: string       // Reference, not denormalized
  technicianId?: string // Reference, not denormalized
  priority: 'high' | 'medium' | 'low'
  status: 'new' | 'in-progress' | 'completed' | 'overdue'
  category: string
  scheduledDate?: string
  duration?: string
  notes?: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

interface MaintenanceStore {
  requests: MaintenanceRequest[]
  
  // CRUD
  addRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateRequest: (id: string, updates: Partial<MaintenanceRequest>) => void
  deleteRequest: (id: string) => void
  
  // Computed/Derived
  getRequestsByEquipment: (equipmentId: string) => MaintenanceRequest[]
  getRequestsByTeam: (teamId: string) => MaintenanceRequest[]
  getRequestsByTechnician: (technicianId: string) => MaintenanceRequest[]
  getActiveRequestForEquipment: (equipmentId: string) => MaintenanceRequest | undefined
  
  // Rich data (joins with other stores)
  getRequestWithDetails: (id: string) => MaintenanceRequestWithDetails | undefined
}

// Helper to join data from multiple stores
export interface MaintenanceRequestWithDetails extends MaintenanceRequest {
  equipmentName: string
  equipmentSerial: string
  teamName: string
  technicianName: string
  companyName: string
}
```

#### B. Normalized Data References

**Principle:** Store IDs, not names. Compute display values in components.

**Before (Denormalized):**
```typescript
// ❌ Bad: Duplicate data
const equipment = {
  technicianName: 'John Doe',
  maintenanceTeam: 'Internal Maintenance'
}
```

**After (Normalized):**
```typescript
// ✅ Good: References only
const equipment = {
  technicianId: 'tech-123',
  teamId: 'team-456'
}

// In component:
const technician = useTeamsStore(state => 
  state.getAllMembers().find(m => m.userId === equipment.technicianId)
)
```

#### C. Cascading Updates

**Scenario:** User renames team member

**Current Issue:** Equipment still shows old name

**Solution:** Use computed values everywhere

```typescript
// In EquipmentTable
const getTechnicianName = (technicianId: string) => {
  const allMembers = useTeamsStore(state => state.getAllMembers())
  return allMembers.find(m => m.userId === technicianId)?.name || 'Unknown'
}

// Render
<td>{getTechnicianName(equipment.technicianId)}</td>
```

#### D. Deletion Safety

**Rules:**
1. Cannot delete team if it has assigned equipment
2. Cannot delete equipment if it has active maintenance requests
3. Cannot delete team member if they're assigned to active requests
4. Soft delete with `isActive` flag

**Implementation:**
```typescript
// In teams-store
deleteTeam: (id: string) => {
  const equipmentCount = useEquipmentStore.getState()
    .equipment.filter(e => e.teamId === id && e.isActive).length
  
  if (equipmentCount > 0) {
    throw new Error(`Cannot delete team. ${equipmentCount} equipment items are assigned to this team.`)
  }
  
  const activeRequests = useMaintenanceStore.getState()
    .requests.filter(r => r.teamId === id && r.status !== 'completed').length
  
  if (activeRequests > 0) {
    throw new Error(`Cannot delete team. ${activeRequests} active maintenance requests are assigned to this team.`)
  }
  
  // Safe to soft delete
  set(state => ({
    teams: state.teams.map(t => 
      t.id === id ? { ...t, isActive: false } : t
    )
  }))
}
```

---

### 6. Component Refactoring Strategy

#### A. Shared Components

**Create:** `frontend/src/components/shared/`

1. **EntityLink.tsx** - Clickable link to any entity
```typescript
<EntityLink type="equipment" id={equipmentId}>
  {equipmentName}
</EntityLink>
```

2. **EntityBadge.tsx** - Badge with entity info and click handler
```typescript
<EntityBadge 
  type="team" 
  id={teamId}
  showCount={true}  // Shows member count
/>
```

3. **QuickActions.tsx** - Unified action dropdown
```typescript
<QuickActions entity="equipment" entityId={id}>
  <Action icon={<Eye />} onClick={() => view()}>View</Action>
  <Action icon={<Edit />} onClick={() => edit()}>Edit</Action>
  <Action icon={<Wrench />} onClick={() => createMaintenance()}>
    Create Maintenance Request
  </Action>
</QuickActions>
```

#### B. Consistent Table Patterns

**Standard Table Features:**
1. Click row → Opens entity modal/page
2. Hover → Shows preview tooltip
3. Linked entities → Clickable with hover underline
4. Actions column → Consistent dropdown menu
5. Search → Unified search bar
6. Filters → Consistent filter UI

**Example Pattern:**
```typescript
// All tables follow this structure
<table>
  <thead>
    <tr>
      <th>ID/Name</th>
      <th>Related Entity 1</th>  {/* Clickable */}
      <th>Related Entity 2</th>  {/* Clickable */}
      <th>Status</th>
      <th>Actions</th>  {/* Dropdown menu */}
    </tr>
  </thead>
  <tbody>
    {items.map(item => (
      <tr key={item.id} onClick={() => handleRowClick(item)}>
        <td><EntityLink type="..." id={item.id}>{item.name}</EntityLink></td>
        <td><EntityLink type="..." id={item.relatedId}>{...}</EntityLink></td>
        <td><StatusBadge status={item.status} /></td>
        <td><QuickActions entity="..." entityId={item.id} /></td>
      </tr>
    ))}
  </tbody>
</table>
```

---

### 7. Implementation Phases

#### Phase 1: Foundation (Week 1)
- [ ] Create Maintenance Store
- [ ] Create Navigation Service
- [ ] Create useNavigation hook
- [ ] Refactor Equipment store to use normalized references
- [ ] Add equipment count to Teams store

#### Phase 2: Cross-Linking (Week 2)
- [ ] Implement Dashboard → Equipment links
- [ ] Implement Dashboard → Teams links
- [ ] Implement Equipment → Maintenance history view
- [ ] Implement Teams → Equipment filter
- [ ] Add entity tooltips on hover

#### Phase 3: Shared Components (Week 3)
- [ ] Create EntityLink component
- [ ] Create EntityBadge component
- [ ] Create QuickActions component
- [ ] Standardize all table components
- [ ] Add preview tooltips

#### Phase 4: Data Sync (Week 4)
- [ ] Implement cascading updates
- [ ] Add deletion safety checks
- [ ] Add optimistic UI updates
- [ ] Implement undo functionality
- [ ] Add conflict resolution

#### Phase 5: Advanced Features (Week 5)
- [ ] Add breadcrumb navigation
- [ ] Implement "Recently Viewed" sidebar
- [ ] Add keyboard shortcuts for navigation
- [ ] Implement deep linking (URL params)
- [ ] Add navigation history/back button

---

### 8. Success Metrics

1. **Zero Duplication**
   - No denormalized data in stores
   - All display values computed from references
   - Single source of truth for each entity

2. **Perfect Sync**
   - Update team name → reflects everywhere instantly
   - Delete team → validates all dependencies
   - All cross-references remain valid

3. **Seamless Navigation**
   - Click any entity → navigates to detail view
   - Consistent back button behavior
   - Maintains context across navigation

4. **Developer Experience**
   - Simple API: `useNavigation().navigateToX()`
   - TypeScript enforces valid references
   - No circular dependencies

5. **User Experience**
   - <200ms navigation transitions
   - Intuitive breadcrumbs
   - Clear visual feedback for clickable items
   - No broken links or stale data

---

### 9. Testing Strategy

#### A. Unit Tests
```typescript
describe('Navigation Service', () => {
  it('should navigate with context', () => { })
  it('should validate navigation params', () => { })
  it('should handle back navigation', () => { })
})

describe('Data Synchronization', () => {
  it('should update equipment when team name changes', () => { })
  it('should prevent deletion of team with equipment', () => { })
  it('should cascade soft deletes', () => { })
})
```

#### B. Integration Tests
- Navigate from Dashboard to Equipment → Verify correct equipment opens
- Update team member → Verify Equipment table updates
- Delete team with validation → Verify error messages

#### C. E2E Tests
- Complete user journey: Dashboard → Maintenance → Equipment → Teams → Back
- Create equipment → Create maintenance request → Assign team → Verify all links
- Update team name → Verify propagation across all views

---

### 10. Migration Plan

#### A. Backward Compatibility
- Keep old prop names during transition
- Add deprecation warnings
- Maintain both old and new navigation methods temporarily

#### B. Gradual Rollout
1. Deploy Navigation Service (no breaking changes)
2. Migrate Dashboard (biggest impact, test thoroughly)
3. Migrate Equipment (moderate risk)
4. Migrate Teams (low risk)
5. Remove deprecated code

#### C. Rollback Strategy
- Feature flags for new navigation
- Ability to toggle back to old system
- Database migrations are reversible

---

## Quick Reference: Navigation Patterns

| Source View | Target View | Trigger | Implementation |
|------------|-------------|---------|----------------|
| Dashboard | Equipment | Click equipment name | `navigateToEquipment(equipmentId)` |
| Dashboard | Teams | Click team name | `navigateToTeam(teamId)` |
| Dashboard | Maintenance | Click request row | Opens modal with data |
| Equipment | Categories | Dropdown option | `onNavigateToCategories()` |
| Equipment | Teams | Click technician | `navigateToTeam(undefined, memberId)` |
| Equipment | Maintenance | Status badge | `navigateToMaintenance(requestId)` |
| Teams | Equipment | Equipment count | `navigateToEquipment({ teamFilter })` |
| Teams | Maintenance | Request count | `navigateToMaintenance({ teamFilter })` |
| Maintenance | Equipment | Equipment field | `navigateToEquipment(equipmentId)` |
| Maintenance | Teams | "Manage Teams" | `navigateToTeam()` |

---

## Conclusion

This plan establishes a **robust, modular, and maintainable architecture** for interlinking Dashboard, Equipment, and Teams. By following these patterns:

✅ **No Duplication** - Single source of truth for all data  
✅ **Perfect Sync** - Changes propagate instantly  
✅ **Seamless Navigation** - Intuitive cross-module links  
✅ **Type Safety** - TypeScript enforces correct usage  
✅ **Future-Proof** - Easy to add new modules  

**Next Step:** Review and approve this plan before implementation begins.
