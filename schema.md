This Markdown file is designed for your frontend developer. It translates our SQLAlchemy schema into a clear data map, highlighting what fields go on which pages and the logic they need to handle.

***

# 🛠 GearGuard: API Data Schema & Interface Guide

This document outlines the database entities, fields, and relationships for the GearGuard Maintenance Tracker. All IDs use **UUID v4** and passwords are encrypted using **Argon2**.

---

## 1. Core Enums (Dropdown Values)
*Use these for select boxes and status badges.*

| Enum Name | Values |
| :--- | :--- |
| **UserRole** | `manager`, `technician`, `employee` |
| **RequestType** | `corrective` (Breakdown), `preventive` (Routine) |
| **MaintenanceStage** | `new`, `in_progress`, `repaired`, `scrap` |

---

## 2. Organization Tables
*These define the structural hierarchy (Multi-Company).*

### `Company`
*   `id`: UUID
*   `name`: String (e.g., "My Company (San Francisco)")

### `Department`
*   `id`: UUID
*   `name`: String (e.g., "Admin", "Production")
*   `company_id`: UUID (Foreign Key)

### `EquipmentCategory`
*   `id`: UUID
*   `name`: String (e.g., "Monitors", "Laptops", "CNC Machines")

---

## 3. Master Data (Equipment & Users)

### `User`
*   `id`: UUID
*   `full_name`: String
*   `email`: String (Unique)
*   `role`: Enum (`UserRole`)
*   `company_id`: UUID
*   `department_id`: UUID (Optional)
*   `team_id`: UUID (Optional - Only for Technicians)

### `Equipment`
*   `id`: UUID
*   `name`: String (e.g., "Samsung Monitor 15")
*   `serial_number`: String (Unique)
*   `category_id`: UUID
*   `department_id`: UUID
*   `company_id`: UUID
*   `employee_id`: UUID (The Person using it)
*   `technician_id`: UUID (Default Tech assigned)
*   `team_id`: UUID (The Maintenance Team responsible)
*   `purchase_date`: DateTime
*   `warranty_info`: Text (Optional)
*   `location`: String (Physical Room/Building)
*   `is_unusable`: Boolean (Default: `false`. True if Scrapped)

---

## 4. Maintenance Requests (Transactions)

### `MaintenanceRequest`
*   `id`: UUID
*   `subject`: String (What is wrong?)
*   `description`: Text
*   `request_type`: Enum (`RequestType`)
*   `stage`: Enum (`MaintenanceStage`)
*   `scheduled_date`: DateTime (Required for Calendar)
*   `duration`: Integer (Hours spent - updated upon completion)
*   `equipment_id`: UUID
*   `team_id`: UUID (Auto-filled from Equipment)
*   `category_id`: UUID (Auto-filled from Equipment)
*   `technician_id`: UUID (Assigned worker)
*   `company_id`: UUID
*   `created_by_id`: UUID

---

## 5. UI Implementation Logic (For Frontend Dev)

### A. The Equipment List (Wireframe Reference)
*   **Columns to show:** Name, Employee (User Name), Department (Name), Serial Number, Technician (User Name), Category (Name), Company (Name).
*   **Filters:** Group by Department, Group by Category.

### B. The Maintenance Kanban Board
*   **Stages:** Create 4 columns: `New` ➡️ `In Progress` ➡️ `Repaired` ➡️ `Scrap`.
*   **Overdue Indicator:** If `scheduled_date` < `today` AND `stage` != `repaired`, show a **RED** highlight.
*   **Technician Avatar:** Show the `technician_id` avatar on the card.

### C. The Maintenance Form (Flow Logic)
1.  **Auto-Fill Trigger:** When a user selects an `Equipment` from the dropdown:
    *   API returns the `team_id` and `category_id` linked to that equipment.
    *   The frontend should automatically select these values in the form.
2.  **Scrap Action:** If a technician moves a request to the `Scrap` column:
    *   The system will automatically flag the Equipment as `is_unusable = true`.
    *   Frontend should show a "Warning: Equipment Unusable" badge on that asset.

### D. The Calendar View
*   Filter only `request_type: preventive`.
*   Plot requests on the calendar using `scheduled_date`.

### E. Smart Buttons (Equipment Page)
*   **Maintenance Button:** On the Equipment details page, show a button labeled "Maintenance".
*   **Badge Count:** This button must show the count of requests where `equipment_id` matches and `stage` is NOT `repaired` or `scrap`.

---

## 6. API Endpoints (Planned)
*   `GET /equipment`: List assets with filters.
*   `POST /requests`: Create a new maintenance ticket (triggers auto-fill).
*   `PATCH /requests/{id}`: Move stage (e.g., New -> In Progress).
*   `GET /reports/pivot`: Data for the Graph/Pivot report (Requests by Team/Category).