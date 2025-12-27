# Equipment Page - Implementation Plan

## Overview
Equipment management page for tracking company equipment, assignments, and maintenance details.

## Page Structure

### 1. Header Integration
- Add "Equipment" tab to DashboardHeader (alongside Maintenance, Teams, Calendar)
- Active tab styling when Equipment is selected
- "New" button opens Equipment creation modal

### 2. Equipment Table Layout

#### Table Columns (from image):
1. **Equipment Name** - Primary identifier (e.g., "Samsung Monitor 15", "Acer Laptop")
2. **Employee** - Person assigned to the equipment (e.g., "Tejas Modi", "Bhaumik P")
3. **Department** - Department assignment (e.g., "Admin", "Technician")
4. **Serial Number** - Unique identifier (e.g., "MT/125/22FFFF87", "MT/122/111112222")
5. **Technician** - Responsible maintenance technician (e.g., "Mitchell Adam", "Marc Demo")
6. **Equipment Category** - Type classification (e.g., "Monitors", "Computers")
7. **Company** - Company ownership (e.g., "My Company (San Francisco)")

#### Table Features:
- Search bar at top right with search icon
- Row hover states for better UX
- Click on row to open Equipment detail/edit modal
- Dark theme styling consistent with existing pages

### 3. Equipment Modal

#### Modal Structure:
**Two-column layout similar to Maintenance Request Modal**

##### Left Column - Basic Information:
- **Equipment Name*** (required)
  - Text input
  - Example: "Samsung Monitor 15"

- **Equipment Category*** (required)
  - Dropdown: Computers, Monitors, Printers, Servers, Network Equipment, Office Equipment, Production Machinery, Tools, Vehicles, Other
  - Default: "Computers"

- **Serial Number*** (required)
  - Text input with format validation
  - Auto-generate option with pattern: MT/YY/XXXXXXXX
  - Unique validation

- **Model/Specifications**
  - Text input
  - Example: "Dell P2419H 24-inch", "Lenovo ThinkPad T14"

- **Manufacturer**
  - Text input
  - Example: "Samsung", "Acer", "HP"

- **Purchase Date**
  - Date picker

- **Warranty Expiry**
  - Date picker
  - Visual indicator if warranty expired

- **Purchase Cost**
  - Number input with currency
  - Format: $0.00

##### Right Column - Assignment & Maintenance:
- **Assigned Employee**
  - Dropdown with search
  - Can be empty (unassigned equipment)
  - Show employee avatar/initials

- **Department**
  - Dropdown: Admin, Technician, Production, IT, Facilities, HR, Finance, Operations, Other
  - Auto-populate based on assigned employee

- **Responsible Technician*** (required)
  - Dropdown from Teams members
  - Integration with Teams store
  - Show technician's team

- **Location/Work Center**
  - Text input or dropdown
  - Example: "Building A - Floor 2", "Production Floor", "Warehouse"

- **Status**
  - Dropdown: Active, In Maintenance, Out of Service, Retired, Lost/Damaged
  - Badge with color coding
  - Default: "Active"

- **Company***
  - Dropdown: My Company (San Francisco), Other locations
  - Multi-company support

##### Bottom Section - Additional Details:
**Tabs:**
1. **Notes** - General notes about equipment
2. **Maintenance History** - Link to related maintenance requests
3. **Documents** - Attachments (manuals, invoices, photos)

##### Action Buttons:
- **Create Maintenance Request** - Quick action to create maintenance for this equipment
- **Archive** - Soft delete (set status to Retired)
- **Save** - Primary action
- **Cancel** - Close modal

### 4. Data Structure

```typescript
interface Equipment {
  id: string
  name: string                    // Equipment Name
  category: EquipmentCategory
  serialNumber: string            // Unique identifier
  model?: string                  // Model/Specs
  manufacturer?: string
  purchaseDate?: string           // ISO date
  warrantyExpiry?: string         // ISO date
  purchaseCost?: number
  assignedEmployeeId?: string     // Foreign key to Employee
  assignedEmployeeName?: string   // Denormalized for display
  department?: string
  technicianId: string            // Foreign key to Team Member
  technicianName: string          // Denormalized for display
  location?: string
  status: EquipmentStatus
  company: string
  notes?: string
  maintenanceHistory?: string[]   // Array of maintenance request IDs
  documents?: Document[]
  isActive: boolean               // Soft delete flag
  createdAt: string
  updatedAt: string
}

type EquipmentCategory = 
  | 'Computers'
  | 'Monitors' 
  | 'Printers'
  | 'Servers'
  | 'Network Equipment'
  | 'Office Equipment'
  | 'Production Machinery'
  | 'Tools'
  | 'Vehicles'
  | 'Other'

type EquipmentStatus = 
  | 'Active'
  | 'In Maintenance'
  | 'Out of Service'
  | 'Retired'
  | 'Lost/Damaged'

interface Document {
  id: string
  name: string
  type: 'manual' | 'invoice' | 'photo' | 'other'
  url: string
  uploadedAt: string
}
```

### 5. Integration Points

#### With Teams:
- Technician dropdown pulls from Teams store
- Show technician's team name in tooltip/subtitle
- Link to manage teams (similar to Maintenance modal)

#### With Maintenance Requests:
- Equipment dropdown in Maintenance Request Modal should pull from Equipment store
- Quick "Create Maintenance Request" button in Equipment modal
- Show maintenance history in Equipment details
- Bidirectional linking

#### With Employees (Future):
- Employee dropdown for assignment
- Employee profile should show assigned equipment
- Auto-populate department from employee data

### 6. File Structure

```
frontend/src/features/equipment/
├── EquipmentPage.tsx              # Main container
├── components/
│   ├── EquipmentTable.tsx         # Table display
│   ├── EquipmentModal.tsx         # Create/Edit modal
│   ├── EquipmentStatusBadge.tsx   # Status visualization
│   └── WarrantyIndicator.tsx      # Warranty status component
└── types/
    └── equipment.types.ts         # TypeScript interfaces

frontend/src/stores/
└── equipment-store.ts              # Zustand store for equipment
```

### 7. Zustand Store Implementation

```typescript
interface EquipmentStore {
  equipment: Equipment[]
  addEquipment: (equipment: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void
  deleteEquipment: (id: string) => void // Soft delete
  getEquipment: (id: string) => Equipment | undefined
  getEquipmentByCategory: (category: EquipmentCategory) => Equipment[]
  getEquipmentByStatus: (status: EquipmentStatus) => Equipment[]
  getEquipmentByEmployee: (employeeId: string) => Equipment[]
  searchEquipment: (query: string) => Equipment[]
}
```

### 8. Search Functionality

- Search across multiple fields:
  - Equipment name
  - Serial number
  - Employee name
  - Manufacturer
  - Model
- Real-time filtering as user types
- Clear search button
- Show "No results" state

### 9. Validation Rules

- **Equipment Name**: Required, min 2 characters, max 100 characters
- **Serial Number**: Required, unique across all equipment, pattern validation
- **Category**: Required, must be from predefined list
- **Technician**: Required, must exist in Teams store
- **Purchase Date**: Cannot be in future
- **Warranty Expiry**: Must be after purchase date if both provided
- **Purchase Cost**: Must be positive number

### 10. Mock Data (Initial)

```typescript
[
  {
    id: '1',
    name: 'Samsung Monitor 15"',
    category: 'Monitors',
    serialNumber: 'MT/125/22FFFF87',
    model: 'Samsung S24F350',
    manufacturer: 'Samsung',
    purchaseDate: '2022-03-15',
    warrantyExpiry: '2025-03-15',
    purchaseCost: 249.99,
    assignedEmployeeId: 'emp1',
    assignedEmployeeName: 'Tejas Modi',
    department: 'Admin',
    technicianId: 'tm1',
    technicianName: 'Mitchell Adam',
    location: 'Office - Desk 12',
    status: 'Active',
    company: 'My Company (San Francisco)',
    isActive: true,
    createdAt: '2022-03-15T10:00:00Z',
    updatedAt: '2024-12-27T08:30:00Z'
  },
  {
    id: '2',
    name: 'Acer Laptop',
    category: 'Computers',
    serialNumber: 'MT/122/111112222',
    model: 'Acer Aspire 5',
    manufacturer: 'Acer',
    purchaseDate: '2022-01-20',
    warrantyExpiry: '2024-01-20',
    purchaseCost: 899.99,
    assignedEmployeeId: 'emp2',
    assignedEmployeeName: 'Bhaumik P',
    department: 'Technician',
    technicianId: 'tm2',
    technicianName: 'Marc Demo',
    location: 'Mobile Device',
    status: 'Active',
    company: 'My Company (San Francisco)',
    isActive: true,
    createdAt: '2022-01-20T14:00:00Z',
    updatedAt: '2024-12-27T08:30:00Z'
  }
]
```

### 11. UI/UX Considerations

- **Warranty Status**:
  - Green badge: Warranty valid (> 30 days remaining)
  - Yellow badge: Expiring soon (< 30 days)
  - Red badge: Warranty expired
  
- **Status Colors**:
  - Active: Green
  - In Maintenance: Yellow
  - Out of Service: Orange
  - Retired: Gray
  - Lost/Damaged: Red

- **Empty States**:
  - No equipment: "No equipment found. Click 'New' to add your first equipment."
  - No search results: "No equipment matches your search."

- **Loading States**:
  - Skeleton loaders for table rows
  - Modal loading state when fetching data

### 12. Future Enhancements

- QR code generation for equipment tracking
- Equipment reservation/booking system
- Bulk import from CSV
- Equipment depreciation calculation
- Maintenance schedule automation
- Equipment performance metrics
- Mobile app for equipment scanning
- Equipment photo gallery
- Integration with procurement system

## Implementation Order

1. ✅ Create equipment types and interfaces
2. ✅ Build Zustand store with mock data
3. ✅ Create EquipmentPage container
4. ✅ Build EquipmentTable component
5. ✅ Implement search functionality
6. ✅ Create EquipmentModal (basic fields)
7. ✅ Add form validation
8. ✅ Integrate with Teams store
9. ✅ Add status badges and warranty indicators
10. ✅ Connect to DashboardHeader navigation
11. ✅ Test all CRUD operations
12. 🔄 Integration with Maintenance Request Modal (Phase 2)

## Design Consistency

- Follow existing dark theme (slate-900/950)
- Match table styling from Teams and Maintenance pages
- Use existing UI components (Button, Input, Label, Select)
- Consistent hover states and transitions
- Mobile responsive design

## Success Criteria

- ✅ Equipment table displays correctly with all columns
- ✅ Search filters equipment in real-time
- ✅ Create new equipment via modal
- ✅ Edit existing equipment
- ✅ Soft delete (archive) equipment
- ✅ Serial number uniqueness validation
- ✅ Technician dropdown integrated with Teams store
- ✅ Status badges display correctly
- ✅ Warranty expiry indicators work
- ✅ Responsive on mobile devices
