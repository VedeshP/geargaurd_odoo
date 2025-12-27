# Test Activity Modal - Design & Implementation Plan

## Modal Overview
A comprehensive maintenance request form that appears as a modal/dialog when a user clicks on any maintenance request in the table. This modal manages the complete lifecycle of a maintenance request from creation to completion.

---

## 1. Modal Structure & Layout

### Modal Container
- **Type**: Full-screen overlay with centered modal
- **Width**: Large (max-width: 1200px)
- **Height**: Auto with max-height and scroll
- **Background**: Dark overlay (bg-black/60)
- **Animation**: Fade in with scale transition

### Layout: Two-Column Design
```
┌─────────────────────────────────────────────────────────┐
│  [X Close]                     [Status Stages]  [Actions]│
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Left Column (60%)        │   Right Column (40%)         │
│  - Subject                │   - Team                     │
│  - Created By             │   - Technician               │
│  - Maintenance For        │   - Scheduled Date           │
│  - Equipment/Work Center  │   - Duration                 │
│  - Category               │   - Priority                 │
│  - Request Date           │   - Company                  │
│  - Maintenance Type       │                              │
│                           │                              │
│  [Notes] [Instructions]   │                              │
│  Text Area                │                              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Header Section

### Status Pipeline (Top Center)
**Visual**: Horizontal stepper/breadcrumb showing current stage
- **Stages**: `New Request` → `In Progress` → `Repaired` → `Scrap`
- **Active Stage**: Highlighted with blue color
- **Completed Stages**: Green checkmark
- **Future Stages**: Gray/muted
- **Click Behavior**: Can click to move between stages (with confirmation)

### Action Buttons (Top Right)
Three utility buttons in a row:

1. **Archived Button**
   - Icon: Archive icon
   - Color: Slate gray
   - Function: Archive this request
   - Tooltip: "Archive request"

2. **Blocked Button**
   - Icon: Block/Stop icon
   - Color: Red when active
   - Function: Mark request as blocked
   - Tooltip: "Block this request"

3. **Ready for Next Stage Button**
   - Icon: Arrow right or check icon
   - Color: Green
   - Function: Move to next stage in pipeline
   - Tooltip: "Move to next stage"

### Close Button (Top Left)
- Icon: X icon
- Position: Absolute top-right
- Function: Close modal (with unsaved changes warning)

---

## 3. Left Column - Request Details

### Field 1: Subject
- **Label**: "Subject"
- **Type**: Text input
- **Required**: Yes
- **Placeholder**: "Enter maintenance subject"
- **Example**: "Test activity"

### Field 2: Created By
- **Label**: "Created By"
- **Type**: Read-only display with avatar
- **Format**: User name with small avatar
- **Example**: "Mitchell Admin"
- **Note**: Auto-filled with current logged-in user

### Field 3: Maintenance For (Dropdown)
- **Label**: "Maintenance For"
- **Type**: Dropdown select
- **Required**: Yes
- **Options**:
  1. Equipment
  2. Work Center
- **Default**: Equipment
- **Behavior**: Changes next field based on selection

### Field 4a: Equipment (Conditional - if "Equipment" selected)
- **Label**: "Equipment"
- **Type**: Searchable dropdown
- **Required**: Yes
- **Format**: `Equipment Name / Location / Serial Number`
- **Example**: "Acer Laptop/LP/203/14281428"
- **Behavior**: 
  - On selection, auto-fills Category, Team, and Technician
  - Shows equipment details in tooltip

### Field 4b: Work Center (Conditional - if "Work Center" selected)
- **Label**: "Work Center"
- **Type**: Searchable dropdown
- **Required**: Yes
- **Format**: `Work Center Name / Department`
- **Example**: "Production Line 1 / Manufacturing"
- **Behavior**:
  - On selection, auto-fills Team based on work center

### Field 5: Category
- **Label**: "Category"
- **Type**: Read-only text (auto-filled)
- **Format**: Category name
- **Example**: "Computers"
- **Note**: Auto-populated from Equipment/Work Center selection

### Field 6: Request Date
- **Label**: "Request Date"
- **Type**: Date picker (read-only after creation)
- **Format**: MM/DD/YYYY
- **Default**: Current date
- **Example**: "12/18/2025"

### Field 7: Maintenance Type
- **Label**: "Maintenance Type"
- **Type**: Radio button group (horizontal)
- **Required**: Yes
- **Options**:
  - ● Corrective (Unplanned repair/breakdown)
  - ○ Preventive (Planned maintenance/routine)
- **Default**: Corrective
- **Style**: Radio circles with label

### Field 8: Notes & Instructions Section
**Tab Interface at bottom of left column**

#### Tab 1: Notes
- **Type**: Rich text area
- **Height**: 150px minimum
- **Placeholder**: "Add notes about this maintenance request..."
- **Features**: 
  - Multi-line text input
  - Auto-resize
  - Timestamp of last edit

#### Tab 2: Instructions
- **Type**: Rich text area
- **Height**: 150px minimum
- **Placeholder**: "Add detailed instructions for the technician..."
- **Features**:
  - Step-by-step instruction support
  - Formatting options (bold, italic, lists)

---

## 4. Right Column - Assignment & Scheduling

### Field 9: Team
- **Label**: "Team"
- **Type**: Dropdown select
- **Required**: Yes
- **Example**: "Internal Maintenance"
- **Options**: List of maintenance teams (Mechanics, Electricians, IT Support, etc.)
- **Behavior**: 
  - Auto-filled from Equipment selection
  - Can be changed manually
  - Filters available technicians

### Field 10: Technician
- **Label**: "Technician"
- **Type**: Dropdown select with avatar
- **Required**: Yes
- **Format**: User name with small avatar
- **Example**: "Joe Foster"
- **Behavior**:
  - Filtered by selected Team
  - Shows availability status
  - Shows current workload indicator

### Field 11: Scheduled Date
- **Label**: "Scheduled Date?"
- **Type**: Date & time picker
- **Required**: No (for corrective), Yes (for preventive)
- **Format**: MM/DD/YYYY HH:MM:SS
- **Example**: "12/28/2025 14:30:00"
- **Note**: Appears on calendar view for preventive maintenance

### Field 12: Duration
- **Label**: "Duration"
- **Type**: Time input (hours:minutes)
- **Format**: HH:MM hours
- **Example**: "00:00 hours"
- **Placeholder**: "00:00"
- **Note**: 
  - Can be estimated before work starts
  - Updated to actual time after completion

### Field 13: Priority
- **Label**: "Priority"
- **Type**: Visual selector (3 diamonds)
- **Options**:
  - Low: 1 diamond filled (green)
  - Medium: 2 diamonds filled (yellow)
  - High: 3 diamonds filled (red)
- **Default**: Medium
- **Visual**: Diamond shapes that fill on click
- **Behavior**: Click to select priority level

### Field 14: Company
- **Label**: "Company"
- **Type**: Dropdown select
- **Required**: Yes
- **Format**: Company name with location
- **Example**: "My Company (San Francisco)"
- **Note**: For multi-company setups

---

## 5. Smart Features

### Smart Button: Worksheet Comments
- **Position**: Bottom right of modal or as floating button
- **Icon**: Message/Comment icon with badge
- **Badge**: Number of comments
- **Function**: Opens a side panel or expandable section showing:
  - Comment thread
  - Timestamp for each comment
  - User who posted comment
  - Ability to add new comments
  - File attachments
- **Visual**: Blue accent color
- **Text**: "Comments (3)" or "Worksheet"

### Auto-Fill Logic
When Equipment/Work Center is selected:
1. **Auto-populate Category** from equipment record
2. **Auto-populate Team** from equipment's assigned maintenance team
3. **Auto-populate Technician** from equipment's default technician
4. **Lock these fields** with ability to override

### Stage Transition Logic
```
New Request
  ↓ (Assign technician)
In Progress
  ↓ (Complete work, add duration)
Repaired
  ↓ (Equipment cannot be fixed)
Scrap
```

**Validation rules:**
- Cannot move to "In Progress" without Technician assigned
- Cannot move to "Repaired" without Duration filled
- Moving to "Scrap" requires confirmation dialog

---

## 6. Action Buttons (Bottom of Modal)

### Primary Actions
- **Save & Close**: Save changes and close modal
- **Save**: Save changes and keep modal open
- **Cancel**: Close without saving (show confirmation if changes exist)

### Secondary Actions
- **Delete**: Delete this request (confirmation required)
- **Duplicate**: Create a copy of this request

---

## 7. Responsive Behavior

### Desktop (>1024px)
- Two-column layout
- All fields visible
- Modal width: 1200px

### Tablet (768px - 1024px)
- Single column stacked
- Status stages collapse to dropdown
- Modal width: 90% viewport

### Mobile (<768px)
- Full screen modal
- Vertical scrolling
- Status stages: dropdown selector
- Action buttons: sticky bottom bar

---

## 8. Validation Rules

### Required Fields
- Subject
- Maintenance For
- Equipment OR Work Center
- Maintenance Type
- Team
- Technician
- Company

### Conditional Requirements
- If Preventive → Scheduled Date required
- If moving to Repaired → Duration required
- If moving to Scrap → Confirmation required

### Field Dependencies
- Work Center selected → Show Work Center field (hide Equipment)
- Equipment selected → Show Equipment field (hide Work Center)
- Team changed → Reset Technician dropdown

---

## 9. State Management

### Modal States
- `isOpen`: Boolean
- `mode`: 'create' | 'edit'
- `requestId`: string | null
- `isDirty`: Boolean (unsaved changes)
- `isSubmitting`: Boolean
- `currentStage`: 'new' | 'in-progress' | 'repaired' | 'scrap'

### Form Data Structure
```typescript
interface MaintenanceRequest {
  id: string
  subject: string
  createdBy: User
  maintenanceFor: 'equipment' | 'work-center'
  equipment?: Equipment
  workCenter?: WorkCenter
  category: string
  requestDate: Date
  maintenanceType: 'corrective' | 'preventive'
  team: Team
  technician: User
  scheduledDate?: Date
  duration: number // in minutes
  priority: 'low' | 'medium' | 'high'
  company: Company
  stage: 'new' | 'in-progress' | 'repaired' | 'scrap'
  notes: string
  instructions: string
  isBlocked: boolean
  isArchived: boolean
}
```

---

## 10. UI Design Specifications

### Colors (Dark Theme)
- **Modal Background**: bg-slate-900
- **Overlay**: bg-black/60
- **Input Background**: bg-slate-800
- **Input Border**: border-slate-700
- **Text Primary**: text-slate-100
- **Text Secondary**: text-slate-400
- **Accent (Primary)**: bg-blue-600
- **Success**: bg-green-600
- **Warning**: bg-yellow-600
- **Danger**: bg-red-600

### Typography
- **Modal Title**: 2xl, font-bold
- **Section Labels**: sm, font-medium, text-slate-400
- **Field Labels**: sm, font-medium, text-slate-200
- **Field Values**: base, text-slate-100
- **Helper Text**: xs, text-slate-500

### Spacing
- **Section Padding**: p-6
- **Field Gap**: gap-4 or space-y-4
- **Column Gap**: gap-6
- **Input Padding**: px-3 py-2

### Animations
- **Modal Enter**: fade + scale (0.95 → 1)
- **Modal Exit**: fade + scale (1 → 0.95)
- **Duration**: 200ms
- **Stage Transition**: smooth color change, 300ms
- **Button Hover**: slight elevation, 150ms

---

## 11. Accessibility

### Keyboard Navigation
- **Tab**: Navigate through fields
- **Shift + Tab**: Navigate backwards
- **Enter**: Submit form (when focus is not on textarea)
- **Escape**: Close modal (with confirmation)
- **Arrow Keys**: Navigate radio buttons and dropdowns

### Screen Reader Support
- **ARIA labels**: All form fields
- **Role**: dialog
- **Aria-labelledby**: Modal title
- **Aria-describedby**: Modal description
- **Focus trap**: Keep focus within modal when open
- **Auto-focus**: Focus on first input field when modal opens

---

## 12. Error Handling

### Validation Errors
- **Display**: Below each field
- **Color**: Red text with red border
- **Icon**: Warning icon
- **Message**: Clear, actionable error message

### Network Errors
- **Toast notification**: Top-right corner
- **Retry button**: For failed save operations
- **Offline indicator**: Show when no connection

### Conflict Resolution
- **Concurrent edits**: Show warning if record changed by another user
- **Refresh option**: Reload latest data

---

## 13. Implementation Priority

### Phase 1 - MVP (Essential)
1. ✅ Modal structure and layout
2. ✅ All form fields (left column)
3. ✅ All assignment fields (right column)
4. ✅ Stage pipeline display
5. ✅ Save & close functionality
6. ✅ Validation logic

### Phase 2 - Enhanced Features
1. Equipment/Work Center conditional logic
2. Auto-fill functionality
3. Stage transition with validation
4. Action buttons (archived, blocked, ready)
5. Priority visual selector
6. Notes/Instructions tabs

### Phase 3 - Advanced Features
1. Smart button - Comments/Worksheet
2. File attachments
3. Activity timeline
4. Advanced validation rules
5. Keyboard shortcuts
6. Offline support

---

## 14. Technical Components Needed

### New Components to Create
1. `MaintenanceRequestModal.tsx` - Main modal container
2. `RequestForm.tsx` - Form with left/right columns
3. `StagePipeline.tsx` - Status stage display
4. `PrioritySelector.tsx` - Diamond priority selector
5. `EquipmentSelector.tsx` - Searchable equipment dropdown
6. `TechnicianSelector.tsx` - Technician with avatar dropdown
7. `DateTimePicker.tsx` - Combined date & time picker
8. `CommentPanel.tsx` - Worksheet comments section
9. `StageActionButtons.tsx` - Archived/Blocked/Ready buttons

### Existing Components to Reuse
- Button
- Input
- Label
- Select/Dropdown
- Textarea
- Card

---

## 15. API Endpoints Required

### Request Management
- `POST /api/maintenance-requests` - Create new request
- `GET /api/maintenance-requests/:id` - Get request details
- `PUT /api/maintenance-requests/:id` - Update request
- `DELETE /api/maintenance-requests/:id` - Delete request
- `PATCH /api/maintenance-requests/:id/stage` - Update stage

### Data Fetching
- `GET /api/equipment` - List all equipment
- `GET /api/work-centers` - List all work centers
- `GET /api/teams` - List all teams
- `GET /api/technicians?teamId=` - List technicians by team
- `GET /api/companies` - List companies

### Comments
- `GET /api/maintenance-requests/:id/comments` - Get comments
- `POST /api/maintenance-requests/:id/comments` - Add comment

---

## Summary

This modal is the central interface for managing maintenance requests in GearGuard. It provides:
- **Comprehensive form** for all request details
- **Visual stage tracking** with pipeline display
- **Smart auto-fill** based on equipment selection
- **Flexible assignment** of teams and technicians
- **Priority management** with visual indicators
- **Stage-based workflow** with validation
- **Comments/collaboration** via smart button
- **Responsive design** for all devices

Ready to implement! 🚀
