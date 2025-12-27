# Equipment Categories Page - Implementation Plan

## Overview
Create a management page for Equipment Categories that can be accessed from the Equipment Modal dropdown, allowing users to define and manage equipment categories with responsible persons.

## User Flow

### 1. Access from Equipment Modal
- In Equipment Modal's "Equipment Category?" dropdown
- Add special option at bottom: **"⚙️ Manage Equipment Categories"** or **"+ Define Equipment Categories"**
- Clicking this option:
  - Closes the Equipment Modal (or keeps it in background)
  - Navigates to Equipment Categories page
  - After creating/editing categories, user can return to equipment creation

### 2. Direct Access
- Add "Equipment Categories" as a sub-tab or accessible from Equipment tab
- Could be in Settings/Configuration section (future)

## Page Structure

### Equipment Categories Page Layout

#### Header
- Title: "Equipment Categories"
- "New" button to create new category
- Optional: Search bar for filtering categories

#### Table Structure (3 columns from image)
1. **Name** - Category name (e.g., "Computers", "Software", "Monitors")
2. **Responsible** - Person responsible for this category (e.g., "OdooBot", "Mitchell Adam")
3. **Company** - Company ownership (e.g., "My Company (San Francisco)")

#### Table Features
- Click row to edit category
- Hover states for better UX
- Sort by columns
- Empty state: "No categories defined. Click 'New' to create your first category."

### Equipment Category Modal

#### Fields (Simple form):
1. **Category Name*** (required)
   - Text input
   - Validation: Unique name, min 2 characters
   - Examples: "Computers", "Monitors", "Production Machinery"

2. **Responsible Person**
   - Dropdown from Teams members (technicians)
   - Optional field
   - Shows who manages/oversees this category

3. **Company*** (required)
   - Dropdown or input
   - Default: "My Company (San Francisco)"
   - Multi-company support

4. **Description** (optional)
   - Text area
   - Additional details about category

#### Actions
- **Save** - Create/Update category
- **Cancel** - Close modal without saving
- **Archive** (edit mode only) - Soft delete category

### Important: Category Management Rules

1. **Pre-defined Categories**: System comes with default categories
2. **User-defined Categories**: Users can add custom categories
3. **Cannot Delete**: Categories in use by equipment (show warning)
4. **Archive Instead**: Soft delete sets `isActive: false`
5. **Archived Categories**: Don't show in equipment dropdown, but show in categories list with indicator

## Data Structure

```typescript
interface EquipmentCategory {
  id: string
  name: string                    // Unique category name
  responsibleId?: string          // Foreign key to team member
  responsibleName?: string        // Denormalized for display
  company: string
  description?: string
  isSystemDefined: boolean        // True for pre-defined, false for user-created
  isActive: boolean               // Soft delete flag
  equipmentCount?: number         // Count of equipment using this category
  createdAt: string
  updatedAt: string
}
```

## Implementation Details

### 1. Update Equipment Category Type

Currently: `type EquipmentCategory = 'Computers' | 'Monitors' | ...`

Change to: Dynamic categories from database/store

```typescript
// Remove hardcoded type
// Add to equipment-store.ts or create equipment-categories-store.ts
interface EquipmentCategoryItem {
  id: string
  name: string
  responsibleId?: string
  responsibleName?: string
  company: string
  description?: string
  isSystemDefined: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

### 2. Create Equipment Categories Store

**File**: `frontend/src/stores/equipment-categories-store.ts`

```typescript
interface EquipmentCategoriesStore {
  categories: EquipmentCategoryItem[]
  addCategory: (category: Omit<EquipmentCategoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCategory: (id: string, updates: Partial<EquipmentCategoryItem>) => void
  deleteCategory: (id: string) => void  // Soft delete
  getCategory: (id: string) => EquipmentCategoryItem | undefined
  getActiveCategories: () => EquipmentCategoryItem[]
  getCategoryByName: (name: string) => EquipmentCategoryItem | undefined
}
```

### 3. Update Equipment Modal Dropdown

Add special option to equipment category dropdown:

```tsx
<select>
  {categories.map(cat => <option>{cat.name}</option>)}
  <option disabled>──────────</option>
  <option value="__manage__">⚙️ Manage Equipment Categories</option>
</select>
```

When "__manage__" selected:
- Prevent form submission
- Call `onNavigateToCategories()` callback prop
- Parent component navigates to categories page

### 4. Navigation Integration

#### Option A: Sub-route under Equipment
- Route: `/equipment/categories`
- Shows categories table
- "Back to Equipment" button

#### Option B: New Tab in Dashboard
- Add tab: "Equipment Categories" (or group under Equipment)
- Switch between Equipment list and Categories management

**Recommended**: Option A with modal-like overlay or slide-in panel for quick access

### 5. File Structure

```
frontend/src/features/equipment-categories/
├── EquipmentCategoriesPage.tsx          # Main container
├── components/
│   ├── EquipmentCategoriesTable.tsx     # Table display (3 columns)
│   ├── EquipmentCategoryModal.tsx       # Create/Edit modal
│   └── CategoryBadge.tsx                # Visual indicator (system/user-defined)

frontend/src/stores/
└── equipment-categories-store.ts         # Zustand store
```

### 6. Pre-defined Categories (Default Data)

```typescript
const defaultCategories = [
  { name: 'Computers', responsibleName: 'OdooBot', company: 'My Company (San Francisco)', isSystemDefined: true },
  { name: 'Software', responsibleName: 'OdooBot', company: 'My Company (San Francisco)', isSystemDefined: true },
  { name: 'Monitors', responsibleName: 'Mitchell Adam', company: 'My Company (San Francisco)', isSystemDefined: true },
  { name: 'Printers', responsibleName: 'OdooBot', company: 'My Company (San Francisco)', isSystemDefined: true },
  { name: 'Servers', responsibleName: 'OdooBot', company: 'My Company (San Francisco)', isSystemDefined: true },
  { name: 'Network Equipment', responsibleName: 'OdooBot', company: 'My Company (San Francisco)', isSystemDefined: true },
  { name: 'Office Equipment', responsibleName: 'OdooBot', company: 'My Company (San Francisco)', isSystemDefined: true },
  { name: 'Production Machinery', responsibleName: 'OdooBot', company: 'My Company (San Francisco)', isSystemDefined: true },
  { name: 'Tools', responsibleName: 'OdooBot', company: 'My Company (San Francisco)', isSystemDefined: true },
  { name: 'Vehicles', responsibleName: 'OdooBot', company: 'My Company (San Francisco)', isSystemDefined: true },
  { name: 'Other', responsibleName: 'OdooBot', company: 'My Company (San Francisco)', isSystemDefined: true },
]
```

## UI/UX Considerations

### Visual Indicators
- **System-defined badge**: Small "System" or "Built-in" badge for pre-defined categories
- **User-defined badge**: "Custom" badge for user-created categories
- **In-use indicator**: Show equipment count (e.g., "5 items") next to category name

### Validation & Business Rules
1. **Unique Names**: Category names must be unique (case-insensitive)
2. **Cannot Delete In-Use**: Show error: "Cannot delete category. X equipment items are using this category."
3. **Archive Warning**: "Are you sure? This category will be hidden from equipment selection."
4. **Empty Name**: Show error: "Category name is required"
5. **Duplicate Name**: Show error: "A category with this name already exists"

### Empty States
- No categories: "No equipment categories defined. Click 'New' to create your first category."
- No results (filtered): "No categories match your search."

### Search Functionality
- Search by category name
- Search by responsible person
- Real-time filtering

## Integration Points

### With Equipment Modal
- Equipment modal dropdown pulls from categories store
- "Manage Categories" option at bottom of dropdown
- After creating new category, return to equipment modal with new category pre-selected

### With Equipment Store
- Equipment uses `category` field (string name for now, can be categoryId later)
- When displaying equipment, look up category details from categories store
- Show responsible person from category in equipment details

### With Teams Store
- Responsible person dropdown pulls from teams members
- Show team name in category details

## Implementation Steps

### Phase 1: Basic Setup ✅
1. Create equipment-categories-store.ts with mock data
2. Create EquipmentCategoriesTable component
3. Create EquipmentCategoryModal component
4. Create EquipmentCategoriesPage container

### Phase 2: Integration ✅
5. Update EquipmentModal dropdown to use dynamic categories
6. Add "Manage Categories" option in dropdown
7. Add navigation callback handling
8. Update DashboardPage routing (or create separate route)

### Phase 3: Polish ✅
9. Add validation rules
10. Add in-use checking (prevent delete)
11. Add system/user-defined badges
12. Add search functionality
13. Test all CRUD operations

### Phase 4: Enhancement (Future) 🔄
- Category icons/colors
- Bulk operations
- Import/Export categories
- Category hierarchy (parent/child categories)
- Custom fields per category

## User Stories

### US-1: View Equipment Categories
**As a** maintenance manager  
**I want to** view all equipment categories  
**So that** I can see what categories are available and who's responsible

**Acceptance Criteria:**
- Table displays Name, Responsible, Company columns
- System-defined categories have indicator
- Can see equipment count per category

### US-2: Create New Category
**As a** admin user  
**I want to** create a custom equipment category  
**So that** I can organize equipment specific to my business

**Acceptance Criteria:**
- Click "New" opens modal
- Can enter name, responsible person, company
- Name must be unique
- New category appears in equipment dropdown immediately

### US-3: Edit Category
**As a** admin user  
**I want to** edit category details  
**So that** I can update responsible person or description

**Acceptance Criteria:**
- Click row opens edit modal
- Can update all fields except system-defined status
- Changes reflect immediately in equipment dropdown

### US-4: Access from Equipment Modal
**As a** user creating equipment  
**I want to** quickly access category management from equipment form  
**So that** I don't have to navigate away and lose my work

**Acceptance Criteria:**
- Equipment category dropdown has "Manage Categories" option
- Clicking opens categories page/modal
- Can create new category and return to equipment form
- New category is pre-selected when returning

### US-5: Archive Category
**As a** admin user  
**I want to** archive unused categories  
**So that** the dropdown stays clean

**Acceptance Criteria:**
- Cannot delete category in use
- Archive removes from equipment dropdown
- Archived categories shown with indicator in categories list
- Can reactivate archived categories

## Success Criteria

- ✅ Equipment categories stored in Zustand store
- ✅ Categories table displays with 3 columns
- ✅ Create/Edit/Archive categories via modal
- ✅ Equipment dropdown uses dynamic categories
- ✅ "Manage Categories" option in equipment dropdown
- ✅ Navigation from equipment modal to categories page works
- ✅ Category name uniqueness validation
- ✅ Cannot delete categories in use by equipment
- ✅ System-defined vs user-defined indicators
- ✅ Responsible person linked to teams

## Technical Notes

### Migration Strategy
1. Start with hardcoded categories as default data
2. Allow users to add custom categories
3. Store as separate entities (not hardcoded union type)
4. Equipment references category by name (can migrate to ID later)

### Performance Considerations
- Categories list is small (<100 items typically)
- Can use simple array filtering
- No pagination needed initially

### Future Enhancements
- Category templates (pre-configured with typical equipment types)
- Category permissions (who can create/edit)
- Audit log for category changes
- Export category list
- Link to equipment filtered by category
