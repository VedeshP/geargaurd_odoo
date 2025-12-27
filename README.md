# GearGuard - Equipment Maintenance Tracker

**Odoo Hackathon Solution**

A full-stack equipment maintenance management system built with FastAPI (Python) and React + TypeScript. GearGuard helps teams track equipment, schedule maintenance, manage work orders, and monitor overall operational health.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

---

## ✨ Features

- **Dashboard**: Real-time metrics and KPIs for maintenance operations
- **Equipment Management**: Track all equipment with categories, status, and maintenance history
- **Maintenance Scheduling**: Plan and track preventive and corrective maintenance
- **Calendar View**: Visual maintenance calendar with FullCalendar integration
- **Team Management**: Organize technicians and assign maintenance tasks
- **Reporting**: Generate insights on equipment performance and maintenance costs
- **Authentication**: Secure JWT-based authentication system

---

## 🛠 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **TanStack Router** - Type-safe routing
- **Zustand** - State management
- **Axios** - HTTP client
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **FullCalendar** - Calendar interface
- **Recharts** - Data visualization
- **React Hook Form + Zod** - Form handling and validation

---

## 📁 Project Structure

```
geargaurd_odoo/
│
├── backend/                      # FastAPI backend application
│   ├── app/
│   │   ├── api/                  # API routes
│   │   │   ├── deps.py           # Dependency injection
│   │   │   └── v1/               # API version 1 endpoints
│   │   ├── core/                 # Core configurations
│   │   │   ├── config.py         # App configuration
│   │   │   └── security.py       # Security utilities (JWT, hashing)
│   │   ├── db/                   # Database configuration
│   │   │   └── session.py        # Database session management
│   │   ├── models/               # SQLAlchemy ORM models
│   │   │   ├── base.py
│   │   │   ├── user.py
│   │   │   ├── team.py
│   │   │   ├── equipment.py
│   │   │   └── maintenance.py
│   │   ├── schemas/              # Pydantic schemas for validation
│   │   │   ├── auth.py
│   │   │   ├── user.py
│   │   │   ├── team.py
│   │   │   ├── equipment.py
│   │   │   ├── maintenance.py
│   │   │   └── dashboard.py
│   │   ├── services/             # Business logic layer
│   │   │   ├── equipment_logic.py
│   │   │   └── maintenance_logic.py
│   │   └── main.py               # Application entry point
│   ├── init_db.py                # Database initialization script
│   ├── populate_db.py            # Seed data script
│   └── requirements.txt          # Python dependencies
│
├── frontend/                     # React frontend application
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── shared/           # Shared components
│   │   │   └── ui/               # shadcn/ui components
│   │   ├── features/             # Feature-based modules
│   │   │   ├── auth/             # Authentication
│   │   │   ├── dashboard/        # Dashboard & KPIs
│   │   │   ├── equipment/        # Equipment management
│   │   │   ├── equipment-categories/  # Category management
│   │   │   ├── maintenance/      # Maintenance records
│   │   │   ├── maintenance-calendar/  # Calendar view
│   │   │   ├── profile/          # User profile
│   │   │   ├── reporting/        # Reports & analytics
│   │   │   └── teams/            # Team management
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utility libraries
│   │   │   ├── api.ts            # Axios configuration
│   │   │   └── utils.ts          # Helper functions
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service layer
│   │   │   ├── auth-service.ts
│   │   │   ├── equipment-service.ts
│   │   │   ├── maintenance-service.ts
│   │   │   ├── teams-service.ts
│   │   │   ├── categories-service.ts
│   │   │   └── dashboard-service.ts
│   │   ├── stores/               # Zustand state stores
│   │   │   ├── user-store.ts
│   │   │   ├── equipment-store.ts
│   │   │   ├── maintenance-store.ts
│   │   │   ├── teams-store.ts
│   │   │   └── equipment-categories-store.ts
│   │   ├── App.tsx               # Root component
│   │   └── main.tsx              # Application entry
│   ├── public/                   # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── image/                        # Design requirements & mockups
│   ├── DASHBOARD_REQUIREMENTS/
│   ├── MAINTENANCE_CALENDAR_PLAN/
│   └── TEAMS_MAINTENANCE_INTEGRATION/
│
├── resources/                    # Additional documentation
│   └── project-structure.md
│
├── shadcn-admin/                 # shadcn admin template (reference)
│
├── API_DOCUMENTATION.md          # Complete API documentation
├── schema.md                     # Database schema documentation
├── requirements.txt              # Root Python dependencies
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+**
- **Node.js 18+** and **npm/pnpm**
- **PostgreSQL** database

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost/gearguard
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. **Initialize the database:**
   ```bash
   python init_db.py
   ```

6. **Populate with sample data (optional):**
   ```bash
   python populate_db.py
   ```

7. **Run the development server:**
   ```bash
   cd app
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`
   
   - Interactive API docs: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
   
   The app will be available at `http://localhost:5173`

### Default Login Credentials

After running `populate_db.py`, you can use:
- **Email:** `admin@gearguard.com`
- **Password:** Check the `populate_db.py` file for the default password

---

## 📚 API Documentation

Comprehensive API documentation is available in [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

### Key Endpoints

- **Authentication:** `/api/v1/auth/*`
- **Users:** `/api/v1/users/*`
- **Teams:** `/api/v1/teams/*`
- **Equipment:** `/api/v1/equipment/*`
- **Equipment Categories:** `/api/v1/equipment-categories/*`
- **Maintenance:** `/api/v1/maintenance/*`
- **Dashboard:** `/api/v1/dashboard/*`

All API endpoints are prefixed with `/api/v1`.

---

## 🗄 Database Schema

The database schema documentation is available in [schema.md](schema.md).

### Core Models

- **User** - System users with roles (Admin, Technician, Viewer)
- **Team** - Maintenance teams with assigned technicians
- **Equipment** - Equipment inventory with status tracking
- **EquipmentCategory** - Equipment categorization
- **Maintenance** - Maintenance records (preventive and corrective)

---

## 🎯 Key Features by Module

### Dashboard
- Real-time KPIs (total equipment, active maintenance, overdue tasks)
- Equipment status distribution charts
- Upcoming maintenance timeline
- Recent maintenance activities
- Cost analysis and trends

### Equipment Management
- Complete CRUD operations
- Filter by category, status, location
- Equipment details with maintenance history
- Status tracking (operational, under maintenance, retired)
- Cost and warranty tracking

### Maintenance Module
- Create and manage maintenance records
- Preventive vs. corrective maintenance tracking
- Priority levels and status management
- Technician assignment
- Cost tracking and parts management
- Notes and documentation

### Calendar View
- Visual maintenance scheduling
- Drag-and-drop interface
- Color-coded by priority
- Quick view and edit capabilities
- Upcoming and overdue indicators

### Team Management
- Create and manage teams
- Assign team leaders
- Add/remove team members
- View team workload and assignments

### Reporting
- Equipment performance metrics
- Maintenance cost analysis
- Team productivity reports
- Custom date range filtering
- Export capabilities

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration for secure cross-origin requests
- Role-based access control (RBAC) ready
- Environment-based configuration

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

---

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project was developed for the Odoo Hackathon.

---

## 🤝 Team

Built with ❤️ for the Odoo Hackathon

---

## 📞 Support

For questions or support, please refer to:
- [API Documentation](API_DOCUMENTATION.md)
- [Database Schema](schema.md)
- [Project Structure](resources/project-structure.md)

---

**Happy Coding! 🚀**