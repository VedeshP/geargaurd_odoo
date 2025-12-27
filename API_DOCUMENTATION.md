# GearGuard Odoo - API Documentation

Complete API request/response documentation for all frontend pages and their backend integration.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Dashboard / Maintenance Page](#dashboard--maintenance-page)
3. [Teams Page](#teams-page)
4. [Equipment Page](#equipment-page)
5. [Equipment Categories Page](#equipment-categories-page)
6. [Common Patterns](#common-patterns)
7. [Error Handling](#error-handling)

---

## Authentication

### Login
**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```json
{
  "email": "user@company.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@company.com",
      "name": "John Doe",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

**Frontend Usage:**
```typescript
// In auth-store.ts
const login = async (email: string, password: string) => {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await response.json()
  
  // Store token and user
  set({ user: data.data.user, token: data.data.token })
  localStorage.setItem('token', data.data.token)
}
```

---

## Dashboard / Maintenance Page

### 1. Get Dashboard Metrics

**Endpoint:** `GET /api/v1/dashboard/metrics`

**Request Headers:**
```json
{
  "Authorization": "Bearer {token}"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "criticalEquipment": {
      "count": 5,
      "items": [
        {
          "id": "eq-1",
          "name": "Samsung Monitor 15\"",
          "status": "Out of Service"
        }
      ]
    },
    "technicianLoad": {
      "percentage": 86,
      "totalTechnicians": 12,
      "activeRequests": 10
    },
    "openRequests": {
      "total": 12,
      "overdue": 3,
      "new": 5,
      "inProgress": 4
    }
  }
}
```

**Frontend Usage:**
```typescript
// In DashboardMetrics.tsx
useEffect(() => {
  const fetchMetrics = async () => {
    const response = await fetch('/api/v1/dashboard/metrics', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    
    setCriticalEquipment(data.data.criticalEquipment.count)
    setTechnicianLoad(data.data.technicianLoad.percentage)
    setOpenRequests(data.data.openRequests.total)
  }
  fetchMetrics()
}, [token])
```

---

### 2. Get All Maintenance Requests

**Endpoint:** `GET /api/v1/maintenance/requests`

**Query Parameters:**
- `status` (optional): Filter by status (new, in-progress, completed, overdue)
- `priority` (optional): Filter by priority (high, medium, low)
- `equipmentId` (optional): Filter by equipment
- `teamId` (optional): Filter by team
- `isActive` (optional): Filter active/inactive (default: true)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Request Example:**
```
GET /api/v1/maintenance/requests?status=new&priority=high&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "req-1",
        "subject": "Critical Alert - Monitor Flickering",
        "equipmentId": "eq-1",
        "teamId": "1",
        "technicianId": "1",
        "categoryId": "cat-monitors",
        "companyId": "comp-1",
        "maintenanceFor": "equipment",
        "workCenter": null,
        "maintenanceType": "corrective",
        "priority": "high",
        "status": "new",
        "requestDate": "2024-12-27",
        "scheduledDate": null,
        "duration": null,
        "notes": "Monitor started flickering during important presentation",
        "instructions": null,
        "isBlocked": false,
        "isArchived": false,
        "createdAt": "2024-12-27T08:00:00Z",
        "updatedAt": "2024-12-27T08:00:00Z",
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

**Frontend Usage:**
```typescript
// In maintenance-store.ts
const fetchRequests = async () => {
  const response = await fetch('/api/v1/maintenance/requests', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await response.json()
  
  set({ requests: data.data.requests })
}
```

---

### 3. Get Single Maintenance Request

**Endpoint:** `GET /api/v1/maintenance/requests/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "req-1",
    "subject": "Critical Alert - Monitor Flickering",
    "equipmentId": "eq-1",
    "equipment": {
      "id": "eq-1",
      "name": "Samsung Monitor 15\"",
      "serialNumber": "MT/125/22FFFF87"
    },
    "teamId": "1",
    "team": {
      "id": "1",
      "name": "Internal Maintenance"
    },
    "technicianId": "1",
    "technician": {
      "id": "1",
      "userId": "1",
      "name": "Jose Mukari",
      "email": "jose@company.com"
    },
    "priority": "high",
    "status": "new",
    "maintenanceType": "corrective",
    "requestDate": "2024-12-27",
    "notes": "Monitor started flickering during important presentation",
    "createdAt": "2024-12-27T08:00:00Z",
    "updatedAt": "2024-12-27T08:00:00Z"
  }
}
```

---

### 4. Create Maintenance Request

**Endpoint:** `POST /api/v1/maintenance/requests`

**Request:**
```json
{
  "subject": "Printer Paper Jam",
  "equipmentId": "eq-3",
  "teamId": "1",
  "technicianId": "1",
  "categoryId": "cat-printers",
  "companyId": "comp-1",
  "maintenanceFor": "equipment",
  "maintenanceType": "corrective",
  "priority": "medium",
  "status": "new",
  "requestDate": "2024-12-27",
  "scheduledDate": "2024-12-28T10:00:00Z",
  "duration": "01:00",
  "notes": "Paper jam in main tray, requires cleaning",
  "instructions": "Use cleaning kit from storage"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "req-125",
    "subject": "Printer Paper Jam",
    "equipmentId": "eq-3",
    "teamId": "1",
    "technicianId": "1",
    "priority": "medium",
    "status": "new",
    "createdAt": "2024-12-27T14:30:00Z",
    "updatedAt": "2024-12-27T14:30:00Z",
    "isActive": true
  },
  "message": "Maintenance request created successfully"
}
```

**Frontend Usage:**
```typescript
// In maintenance-store.ts
const addRequest = async (requestData: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
  const response = await fetch('/api/v1/maintenance/requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(requestData)
  })
  
  const data = await response.json()
  
  if (data.success) {
    // Add to local state
    set((state) => ({
      requests: [...state.requests, data.data]
    }))
  }
}
```

---

### 5. Update Maintenance Request

**Endpoint:** `PATCH /api/v1/maintenance/requests/:id`

**Request:**
```json
{
  "status": "in-progress",
  "technicianId": "2",
  "scheduledDate": "2024-12-28T14:00:00Z",
  "notes": "Updated: Assigned to Marc Demo for immediate attention"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "req-1",
    "subject": "Critical Alert - Monitor Flickering",
    "status": "in-progress",
    "technicianId": "2",
    "scheduledDate": "2024-12-28T14:00:00Z",
    "updatedAt": "2024-12-27T15:45:00Z"
  },
  "message": "Maintenance request updated successfully"
}
```

**Frontend Usage:**
```typescript
// In maintenance-store.ts
const updateRequest = async (id: string, updates: Partial<MaintenanceRequest>) => {
  const response = await fetch(`/api/v1/maintenance/requests/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  })
  
  const data = await response.json()
  
  if (data.success) {
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id ? { ...req, ...data.data } : req
      )
    }))
  }
}
```

---

### 6. Delete Maintenance Request (Soft Delete)

**Endpoint:** `DELETE /api/v1/maintenance/requests/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "req-1",
    "isActive": false,
    "updatedAt": "2024-12-27T16:00:00Z"
  },
  "message": "Maintenance request deleted successfully"
}
```

**Frontend Usage:**
```typescript
// In maintenance-store.ts
const deleteRequest = async (id: string) => {
  const response = await fetch(`/api/v1/maintenance/requests/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  const data = await response.json()
  
  if (data.success) {
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id ? { ...req, isActive: false } : req
      )
    }))
  }
}
```

---

## Teams Page

### 1. Get All Teams

**Endpoint:** `GET /api/v1/teams`

**Query Parameters:**
- `isActive` (optional): Filter active/inactive teams (default: true)
- `company` (optional): Filter by company
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": "1",
        "name": "Internal Maintenance",
        "company": "My Company (San Francisco)",
        "description": "Handles all internal equipment maintenance",
        "members": [
          {
            "id": "1",
            "userId": "1",
            "name": "Jose Mukari",
            "email": "jose@company.com",
            "role": "team_leader"
          },
          {
            "id": "2",
            "userId": "2",
            "name": "Mitchell Admin",
            "email": "mitchell@company.com",
            "role": "technician"
          }
        ],
        "isActive": true,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-12-27T08:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

**Frontend Usage:**
```typescript
// In teams-store.ts
const fetchTeams = async () => {
  const response = await fetch('/api/v1/teams', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await response.json()
  
  set({ teams: data.data.teams })
}
```

---

### 2. Get Single Team

**Endpoint:** `GET /api/v1/teams/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Internal Maintenance",
    "company": "My Company (San Francisco)",
    "description": "Handles all internal equipment maintenance",
    "members": [
      {
        "id": "1",
        "userId": "1",
        "name": "Jose Mukari",
        "email": "jose@company.com",
        "role": "team_leader",
        "phone": "+1-555-0123",
        "hireDate": "2022-01-15"
      }
    ],
    "statistics": {
      "totalMembers": 2,
      "assignedEquipment": 15,
      "activeRequests": 5,
      "completedRequests": 120
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-12-27T08:00:00Z"
  }
}
```

---

### 3. Create Team

**Endpoint:** `POST /api/v1/teams`

**Request:**
```json
{
  "name": "External Contractors",
  "company": "My Company (San Francisco)",
  "description": "Third-party maintenance contractors",
  "members": [
    {
      "userId": "15",
      "name": "John Smith",
      "email": "john@contractor.com",
      "role": "technician"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "4",
    "name": "External Contractors",
    "company": "My Company (San Francisco)",
    "description": "Third-party maintenance contractors",
    "members": [
      {
        "id": "10",
        "userId": "15",
        "name": "John Smith",
        "email": "john@contractor.com",
        "role": "technician"
      }
    ],
    "isActive": true,
    "createdAt": "2024-12-27T16:30:00Z",
    "updatedAt": "2024-12-27T16:30:00Z"
  },
  "message": "Team created successfully"
}
```

**Frontend Usage:**
```typescript
// In teams-store.ts
const addTeam = async (teamData: Omit<Team, 'id'>) => {
  const response = await fetch('/api/v1/teams', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(teamData)
  })
  
  const data = await response.json()
  
  if (data.success) {
    set((state) => ({
      teams: [...state.teams, data.data]
    }))
  }
}
```

---

### 4. Update Team

**Endpoint:** `PATCH /api/v1/teams/:id`

**Request:**
```json
{
  "name": "Internal Maintenance & Support",
  "description": "Updated description for broader scope",
  "members": [
    {
      "id": "1",
      "userId": "1",
      "name": "Jose Mukari",
      "email": "jose@company.com",
      "role": "team_leader"
    },
    {
      "userId": "20",
      "name": "New Technician",
      "email": "newtech@company.com",
      "role": "technician"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Internal Maintenance & Support",
    "description": "Updated description for broader scope",
    "members": [
      {
        "id": "1",
        "userId": "1",
        "name": "Jose Mukari",
        "email": "jose@company.com",
        "role": "team_leader"
      },
      {
        "id": "11",
        "userId": "20",
        "name": "New Technician",
        "email": "newtech@company.com",
        "role": "technician"
      }
    ],
    "updatedAt": "2024-12-27T17:00:00Z"
  },
  "message": "Team updated successfully"
}
```

---

### 5. Delete Team

**Endpoint:** `DELETE /api/v1/teams/:id`

**Query Parameters:**
- `force` (optional): Hard delete if true, soft delete if false (default: false)

**Response (Soft Delete):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "isActive": false,
    "updatedAt": "2024-12-27T17:30:00Z"
  },
  "message": "Team deleted successfully"
}
```

**Response (Error - Team has dependencies):**
```json
{
  "success": false,
  "error": {
    "code": "TEAM_HAS_DEPENDENCIES",
    "message": "Cannot delete team with assigned equipment or active maintenance requests",
    "details": {
      "assignedEquipment": 15,
      "activeRequests": 3
    }
  }
}
```

---

### 6. Get Team Members

**Endpoint:** `GET /api/v1/teams/:id/members`

**Response:**
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "1",
        "userId": "1",
        "name": "Jose Mukari",
        "email": "jose@company.com",
        "role": "team_leader",
        "phone": "+1-555-0123",
        "statistics": {
          "activeRequests": 3,
          "completedRequests": 45,
          "averageCompletionTime": "2.5 hours"
        }
      }
    ]
  }
}
```

---

## Equipment Page

### 1. Get All Equipment

**Endpoint:** `GET /api/v1/equipment`

**Query Parameters:**
- `category` (optional): Filter by category
- `status` (optional): Filter by status
- `technicianId` (optional): Filter by assigned technician
- `isActive` (optional): Filter active/inactive
- `search` (optional): Search by name, serial number, or model
- `page` (optional): Page number
- `limit` (optional): Items per page

**Request Example:**
```
GET /api/v1/equipment?category=Computers&status=Active&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "equipment": [
      {
        "id": "eq-1",
        "name": "Samsung Monitor 15\"",
        "category": "Monitors",
        "serialNumber": "MT/125/22FFFF87",
        "model": "Samsung S24F350",
        "manufacturer": "Samsung",
        "purchaseDate": "2022-03-15",
        "warrantyExpiry": "2025-03-15",
        "purchaseCost": 249.99,
        "assignedEmployeeId": "emp1",
        "assignedEmployeeName": "Tejas Modi",
        "department": "Admin",
        "technicianId": "1",
        "technicianName": "Jose Mukari",
        "location": "Office - Desk 12",
        "status": "Active",
        "company": "My Company (San Francisco)",
        "notes": "Primary monitor for workstation",
        "maintenanceTeam": "Internal Maintenance",
        "documents": [
          {
            "id": "doc-1",
            "name": "User Manual",
            "type": "manual",
            "url": "/documents/eq-1/manual.pdf",
            "uploadedAt": "2022-03-15T10:00:00Z"
          }
        ],
        "isActive": true,
        "createdAt": "2022-03-15T10:00:00Z",
        "updatedAt": "2024-12-27T08:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

**Frontend Usage:**
```typescript
// In equipment-store.ts
const fetchEquipment = async (filters?: EquipmentFilters) => {
  const queryParams = new URLSearchParams()
  if (filters?.category) queryParams.append('category', filters.category)
  if (filters?.status) queryParams.append('status', filters.status)
  
  const response = await fetch(`/api/v1/equipment?${queryParams}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  const data = await response.json()
  set({ equipment: data.data.equipment })
}
```

---

### 2. Get Single Equipment

**Endpoint:** `GET /api/v1/equipment/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "eq-1",
    "name": "Samsung Monitor 15\"",
    "category": "Monitors",
    "serialNumber": "MT/125/22FFFF87",
    "model": "Samsung S24F350",
    "manufacturer": "Samsung",
    "purchaseDate": "2022-03-15",
    "warrantyExpiry": "2025-03-15",
    "purchaseCost": 249.99,
    "assignedEmployeeId": "emp1",
    "department": "Admin",
    "technicianId": "1",
    "location": "Office - Desk 12",
    "status": "Active",
    "company": "My Company (San Francisco)",
    "notes": "Primary monitor for workstation",
    "documents": [],
    "maintenanceHistory": [
      {
        "id": "req-1",
        "subject": "Critical Alert - Monitor Flickering",
        "status": "completed",
        "priority": "high",
        "completedAt": "2024-12-20T15:30:00Z"
      }
    ],
    "isActive": true,
    "createdAt": "2022-03-15T10:00:00Z",
    "updatedAt": "2024-12-27T08:30:00Z"
  }
}
```

---

### 3. Create Equipment

**Endpoint:** `POST /api/v1/equipment`

**Request:**
```json
{
  "name": "Dell Laptop XPS 15",
  "category": "Computers",
  "serialNumber": "DL/XPS/2024/001",
  "model": "XPS 15 9520",
  "manufacturer": "Dell",
  "purchaseDate": "2024-12-27",
  "warrantyExpiry": "2027-12-27",
  "purchaseCost": 1899.99,
  "assignedEmployeeId": "emp5",
  "assignedEmployeeName": "Sarah Johnson",
  "department": "Engineering",
  "technicianId": "1",
  "location": "Engineering Floor - Desk 45",
  "status": "Active",
  "company": "My Company (San Francisco)",
  "notes": "High-performance laptop for CAD work"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "eq-150",
    "name": "Dell Laptop XPS 15",
    "category": "Computers",
    "serialNumber": "DL/XPS/2024/001",
    "status": "Active",
    "isActive": true,
    "createdAt": "2024-12-27T18:00:00Z",
    "updatedAt": "2024-12-27T18:00:00Z"
  },
  "message": "Equipment created successfully"
}
```

**Frontend Usage:**
```typescript
// In equipment-store.ts
const addEquipment = async (equipmentData: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => {
  const response = await fetch('/api/v1/equipment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(equipmentData)
  })
  
  const data = await response.json()
  
  if (data.success) {
    set((state) => ({
      equipment: [...state.equipment, data.data]
    }))
  }
}
```

---

### 4. Update Equipment

**Endpoint:** `PATCH /api/v1/equipment/:id`

**Request:**
```json
{
  "status": "In Maintenance",
  "location": "Maintenance Workshop",
  "notes": "Undergoing scheduled maintenance"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "eq-1",
    "status": "In Maintenance",
    "location": "Maintenance Workshop",
    "notes": "Undergoing scheduled maintenance",
    "updatedAt": "2024-12-27T18:30:00Z"
  },
  "message": "Equipment updated successfully"
}
```

---

### 5. Delete Equipment

**Endpoint:** `DELETE /api/v1/equipment/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "eq-1",
    "isActive": false,
    "updatedAt": "2024-12-27T19:00:00Z"
  },
  "message": "Equipment deleted successfully"
}
```

---

### 6. Upload Equipment Document

**Endpoint:** `POST /api/v1/equipment/:id/documents`

**Request (Multipart Form Data):**
```
Content-Type: multipart/form-data

file: [binary file data]
type: "manual" | "invoice" | "photo" | "other"
name: "User Manual.pdf"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "doc-10",
      "name": "User Manual.pdf",
      "type": "manual",
      "url": "/documents/eq-1/user-manual.pdf",
      "uploadedAt": "2024-12-27T19:15:00Z"
    }
  },
  "message": "Document uploaded successfully"
}
```

**Frontend Usage:**
```typescript
// In equipment-store.ts or EquipmentModal.tsx
const uploadDocument = async (equipmentId: string, file: File, type: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)
  formData.append('name', file.name)
  
  const response = await fetch(`/api/v1/equipment/${equipmentId}/documents`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  })
  
  const data = await response.json()
  
  if (data.success) {
    // Update equipment documents in store
    updateEquipment(equipmentId, {
      documents: [...currentDocuments, data.data.document]
    })
  }
}
```

---

## Equipment Categories Page

### 1. Get All Equipment Categories

**Endpoint:** `GET /api/v1/equipment-categories`

**Query Parameters:**
- `isActive` (optional): Filter active/inactive categories
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat-1",
        "name": "Computers",
        "description": "Desktop computers, laptops, tablets",
        "parentCategory": null,
        "icon": "💻",
        "equipmentCount": 45,
        "isActive": true,
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-12-27T08:00:00Z"
      },
      {
        "id": "cat-2",
        "name": "Monitors",
        "description": "Computer displays and screens",
        "parentCategory": null,
        "icon": "🖥️",
        "equipmentCount": 32,
        "isActive": true,
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-12-27T08:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

**Frontend Usage:**
```typescript
// In equipment-categories-store.ts
const fetchCategories = async () => {
  const response = await fetch('/api/v1/equipment-categories', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await response.json()
  
  set({ categories: data.data.categories })
}
```

---

### 2. Create Equipment Category

**Endpoint:** `POST /api/v1/equipment-categories`

**Request:**
```json
{
  "name": "IoT Devices",
  "description": "Smart sensors, IoT gateways, and connected devices",
  "parentCategory": null,
  "icon": "📡"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cat-11",
    "name": "IoT Devices",
    "description": "Smart sensors, IoT gateways, and connected devices",
    "parentCategory": null,
    "icon": "📡",
    "equipmentCount": 0,
    "isActive": true,
    "createdAt": "2024-12-27T20:00:00Z",
    "updatedAt": "2024-12-27T20:00:00Z"
  },
  "message": "Equipment category created successfully"
}
```

---

### 3. Update Equipment Category

**Endpoint:** `PATCH /api/v1/equipment-categories/:id`

**Request:**
```json
{
  "name": "IoT & Smart Devices",
  "description": "Updated description for IoT devices and smart equipment"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cat-11",
    "name": "IoT & Smart Devices",
    "description": "Updated description for IoT devices and smart equipment",
    "updatedAt": "2024-12-27T20:15:00Z"
  },
  "message": "Equipment category updated successfully"
}
```

---

### 4. Delete Equipment Category

**Endpoint:** `DELETE /api/v1/equipment-categories/:id`

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "cat-11",
    "isActive": false,
    "updatedAt": "2024-12-27T20:30:00Z"
  },
  "message": "Equipment category deleted successfully"
}
```

**Response (Error - Category has equipment):**
```json
{
  "success": false,
  "error": {
    "code": "CATEGORY_HAS_EQUIPMENT",
    "message": "Cannot delete category with assigned equipment",
    "details": {
      "equipmentCount": 15
    }
  }
}
```

---

## Common Patterns

### Response Structure

All API responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* optional additional info */ }
  }
}
```

---

### Pagination

All list endpoints support pagination with the following parameters:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "items": [ /* array of items */ ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 250,
      "totalPages": 5
    }
  }
}
```

**Frontend Usage:**
```typescript
const [page, setPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)

const fetchData = async (page: number) => {
  const response = await fetch(`/api/v1/resource?page=${page}&limit=20`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await response.json()
  
  setItems(data.data.items)
  setTotalPages(data.data.pagination.totalPages)
}
```

---

### Filtering and Searching

**Query Parameters:**
- `search`: Full-text search across relevant fields
- `sortBy`: Field to sort by (e.g., "name", "createdAt")
- `sortOrder`: "asc" or "desc"
- Custom filters based on resource (status, priority, etc.)

**Example:**
```
GET /api/v1/equipment?search=monitor&category=Monitors&status=Active&sortBy=name&sortOrder=asc
```

---

## Error Handling

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication token |
| `FORBIDDEN` | 403 | User doesn't have permission for this action |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `DUPLICATE_ENTRY` | 409 | Resource already exists |
| `DEPENDENCY_ERROR` | 409 | Cannot delete resource with dependencies |
| `SERVER_ERROR` | 500 | Internal server error |

---

### Frontend Error Handling Pattern

```typescript
const handleApiError = (error: any) => {
  if (error.error?.code === 'UNAUTHORIZED') {
    // Redirect to login
    navigate('/login')
  } else if (error.error?.code === 'VALIDATION_ERROR') {
    // Show validation errors to user
    setFormErrors(error.error.details)
  } else {
    // Show generic error message
    toast.error(error.error?.message || 'An error occurred')
  }
}

// Usage in API call
try {
  const response = await fetch('/api/v1/resource', options)
  const data = await response.json()
  
  if (!data.success) {
    handleApiError(data)
    return
  }
  
  // Handle success
} catch (err) {
  handleApiError({ error: { message: 'Network error' } })
}
```

---

## Integration Summary

### Store Pattern

Each Zustand store should follow this pattern:

```typescript
interface ResourceStore {
  // State
  items: Resource[]
  isLoading: boolean
  error: string | null
  
  // Fetch
  fetchItems: () => Promise<void>
  
  // CRUD
  addItem: (item: Omit<Resource, 'id'>) => Promise<void>
  updateItem: (id: string, updates: Partial<Resource>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  getItem: (id: string) => Resource | undefined
}

export const useResourceStore = create<ResourceStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  
  fetchItems: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/v1/resources', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      
      if (data.success) {
        set({ items: data.data.items, isLoading: false })
      } else {
        set({ error: data.error.message, isLoading: false })
      }
    } catch (err) {
      set({ error: 'Network error', isLoading: false })
    }
  },
  
  // ... other methods
}))
```

---

## Notes for Backend Development

1. **Authentication**: All endpoints except `/auth/login` require Bearer token authentication
2. **Soft Deletes**: Use `isActive: false` for soft deletes, never hard delete records
3. **Timestamps**: Always include `createdAt` and `updatedAt` timestamps
4. **Validation**: Validate all request payloads and return detailed validation errors
5. **Relations**: Return related data when fetching single resources (e.g., equipment with team info)
6. **Pagination**: Implement cursor-based pagination for large datasets
7. **Search**: Implement full-text search across relevant fields
8. **File Uploads**: Use multipart/form-data for document uploads
9. **Rate Limiting**: Implement rate limiting to prevent abuse
10. **CORS**: Configure CORS to allow requests from frontend domain

---

## End of Documentation

For questions or clarifications, please contact the development team.
