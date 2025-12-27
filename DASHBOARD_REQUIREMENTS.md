# GearGuard Dashboard - Design Requirements

## Dashboard Overview
The main dashboard provides a comprehensive view of the maintenance system with key metrics, navigation, and request tracking.

---

## 1. Navigation Structure

### Top Navigation Bar
Located at the top of the dashboard with the following tabs:
- **Maintenance** (Active/Home)
- **Dashboard**
- **Maintenance Calendar**
- **Equipment**
- **Reporting**
- **Teams**

### Action Buttons
- **"New" Button**: Create new maintenance request (prominent, easy access)
- **Search Bar**: Global search functionality with placeholder "Search..."
- **User Profile/Actions**: Right side of navigation (dropdown menu icon)

---

## 2. Metric Cards (KPI Dashboard)

### Card 1: Critical Equipment (Red Background)
- **Title**: "Critical Equipment"
- **Metric**: "5 Units"
- **Subtitle**: "(Health < 30%)"
- **Color**: Red/Dark Red background
- **Purpose**: Alert for equipment in critical condition needing immediate attention
- **Border**: Rounded corners with subtle border

### Card 2: Technician Load (Blue Background)
- **Title**: "Technician Load"
- **Metric**: "86% Utilized"
- **Subtitle**: "(Assign Carefully)"
- **Color**: Blue/Navy background
- **Purpose**: Show workforce utilization to prevent overload
- **Border**: Rounded corners with subtle border

### Card 3: Open Requests (Green Background)
- **Title**: "Open Requests"
- **Metric**: "12 Pending"
- **Subtitle**: "3 Overdue"
- **Color**: Green/Dark Green background
- **Purpose**: Track pending and overdue maintenance requests
- **Border**: Rounded corners with subtle border

### Card Design Pattern
- All cards have same height and width
- Grid layout: 3 columns on desktop
- Responsive: Stack vertically on mobile
- Hover effect: Slight elevation/shadow
- Cursor pointer on interactive elements

---

## 3. Maintenance Requests Table

### Table Location
- Below the metric cards
- Full width of the dashboard
- White/Light background with borders

### Table Columns
1. **Priority**: 
   - Visual indicator (icon or color badge)
   - Shows urgency level
   
2. **Equipment**:
   - Equipment name
   - Example: "Critical Alert", "Task activity"
   
3. **Maintenance** (Maintena):
   - Assigned technician/team member
   - Example: "Joe Foster"
   
4. **Category**:
   - Equipment type
   - Example: "Computer", "Generator"
   
5. **Status**:
   - Current stage of request
   - Example: "New Request"
   - Color-coded badges
   
6. **Company**:
   - Department or organization
   - Example: "Any Request"

### Table Features
- **Sortable columns**: Click headers to sort
- **Row hover effect**: Highlight row on hover
- **Clickable rows**: Open request details
- **Pagination**: Bottom of table (if many records)
- **Filters**: Ability to filter by status, category, etc.
- **Responsive**: Horizontal scroll on mobile

---

## 4. Visual Design System

### Color Palette
- **Background**: Dark slate/navy (#0f172a or similar)
- **Cards**: Darker overlays with colored backgrounds
  - Red: #dc2626 / #991b1b
  - Blue: #2563eb / #1e40af
  - Green: #16a34a / #15803d
- **Text**: White/Light gray on dark backgrounds
- **Borders**: Subtle slate-700/slate-800

### Typography
- **Headings**: Bold, larger font (18-24px)
- **Metrics**: Very large, bold (32-48px)
- **Subtitles**: Smaller, muted color (14px)
- **Table text**: Regular, 14-16px

### Spacing
- **Card padding**: 20-24px
- **Gap between cards**: 16-20px
- **Section margins**: 24-32px
- **Table padding**: 16px per cell

---

## 5. Interactive Elements

### Buttons
- **New Button**: Primary action, prominent positioning
- **Action buttons**: Within table rows (edit, delete, view)
- **Cursor pointer**: All clickable elements

### Hover States
- Cards: Slight elevation, shadow increase
- Table rows: Background color change
- Buttons: Color shift, scale slightly
- Links: Underline or color change

### Loading States
- Skeleton loaders for cards while fetching data
- Spinner for table data loading
- Disabled state for buttons during actions

---

## 6. Responsive Design

### Desktop (>1024px)
- 3-column grid for metric cards
- Full table visible
- Side-by-side navigation

### Tablet (768px - 1024px)
- 2-column grid for cards
- Table with horizontal scroll
- Collapsed navigation menu

### Mobile (<768px)
- Single column stacked cards
- Table with priority columns only
- Hamburger menu for navigation

---

## 7. Additional Features (Based on Requirements)

### Smart Indicators
- **Red strip/text**: Overdue requests in table
- **Technician avatars**: Show assigned user pictures
- **Status badges**: Color-coded (New, In Progress, Completed, Overdue)

### Quick Actions
- Click card metrics to filter table
  - Critical Equipment → Show only critical equipment
  - Open Requests → Show only pending/overdue
  - Technician Load → Show team workload details

### Notifications
- Badge on navigation items showing counts
- Alert icon for critical issues
- Real-time updates for new requests

---

## 8. Data Integration Points

### API Endpoints Needed
1. `GET /api/dashboard/metrics` - Fetch KPI card data
2. `GET /api/maintenance-requests` - Fetch table data
3. `GET /api/equipment/critical` - Critical equipment list
4. `GET /api/teams/workload` - Technician utilization
5. `POST /api/maintenance-requests` - Create new request

### Real-time Updates
- WebSocket connection for live request updates
- Auto-refresh metrics every 30-60 seconds
- Toast notifications for new critical alerts

---

## 9. Implementation Priority

### Phase 1 (MVP)
1. ✅ Navigation structure
2. ✅ Three metric cards with static data
3. ✅ Basic maintenance requests table
4. ✅ Dark theme styling
5. ✅ Responsive layout

### Phase 2
1. Connect to backend API
2. Real-time data updates
3. Filters and sorting
4. Click-through interactions

### Phase 3
1. Advanced charts/graphs
2. Export functionality
3. Bulk actions
4. Advanced filtering

---

## 10. Technical Stack

### Frontend Components
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hook Form** for forms
- **TanStack Table** (optional for advanced table features)
- **Recharts** (for future graphs)

### State Management
- **Zustand** (already installed) for global state
- **React Query** (optional) for API data fetching

### Routing
- **TanStack Router** (already installed) for navigation

---

## Summary
The dashboard is a dark-themed, modern interface that provides:
- **At-a-glance metrics** via colored KPI cards
- **Detailed request tracking** via a sortable table
- **Easy navigation** across all modules
- **Professional UX** with proper spacing, colors, and interactions

Ready to build! 🚀
