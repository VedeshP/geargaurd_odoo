import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Boolean, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

# --- ENUMS ---
PRIORITY_MAP = {
    "low": 1,
    "medium": 2,
    "high": 3
}

# Reverse map for GET requests
PRIORITY_REVERSE_MAP = {v: k for k, v in PRIORITY_MAP.items()}


class UserRole(str, enum.Enum):
    MANAGER = "manager"
    TECHNICIAN = "technician"
    EMPLOYEE = "employee"

class RequestType(str, enum.Enum):
    CORRECTIVE = "corrective"
    PREVENTIVE = "preventive"

class MaintenanceStage(str, enum.Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    REPAIRED = "repaired"
    SCRAP = "scrap"

class Company(Base):
    __tablename__ = "companies"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False) # e.g., "My Company (San Francisco)"
    
    # Relationships
    users = relationship("User", back_populates="company")
    equipment = relationship("Equipment", back_populates="company")
    teams = relationship("Team", back_populates="company")
    departments = relationship("Department", back_populates="company")

class Department(Base):
    __tablename__ = "departments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    
    company = relationship("Company", back_populates="departments")
    users = relationship("User", back_populates="department")
    equipment = relationship("Equipment", back_populates="department")

# --- MASTER DATA ---

class EquipmentCategory(Base):
    __tablename__ = "equipment_categories"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False)
    equipment = relationship("Equipment", back_populates="category")

class Team(Base):
    __tablename__ = "teams"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    
    company = relationship("Company", back_populates="teams")
    members = relationship("User", back_populates="team")
    requests = relationship("MaintenanceRequest", back_populates="team")

class Workcenter(Base):
    __tablename__ = "workcenters"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False) # e.g., "Assembly Line 1"
    code = Column(String(50), unique=True) # e.g., "WC-01"
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    
    # Relationships
    company = relationship("Company")
    equipment = relationship("Equipment", back_populates="workcenter")
    requests = relationship("MaintenanceRequest", back_populates="workcenter")

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="employee") # manager, technician, employee
    
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=True)
    
    company = relationship("Company", back_populates="users")
    department = relationship("Department", back_populates="users")
    team = relationship("Team", back_populates="members")
     # --- FIXED RELATIONSHIPS ---
    # 1. Equipment this user uses/owns
    owned_equipment = relationship("Equipment", back_populates="employee", foreign_keys="Equipment.employee_id")
    
    # 2. Equipment where this user is the DEFAULT technician
    assigned_equipment = relationship("Equipment", back_populates="technician", foreign_keys="Equipment.technician_id")
    
    # 3. Maintenance Requests where this user is the ASSIGNED technician (This was missing!)
    assigned_requests = relationship("MaintenanceRequest", back_populates="technician", foreign_keys="MaintenanceRequest.technician_id")
    
    # 4. Maintenance Requests this user CREATED
    created_requests = relationship("MaintenanceRequest", back_populates="creator", foreign_keys="MaintenanceRequest.created_by_id")

class Equipment(Base):
    __tablename__ = "equipment"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False) # "Samsung Monitor 15"
    serial_number = Column(String(100), unique=True, nullable=False) # "MT/125/22778837"
    
    category_id = Column(UUID(as_uuid=True), ForeignKey("equipment_categories.id"), nullable=False)
    workcenter_id = Column(UUID(as_uuid=True), ForeignKey("workcenters.id"), nullable=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    
    # Ownership/Responsibility (Wireframe columns)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True) # "Tejas Modi"
    technician_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True) # "Mitchell Admin"
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False) # The Team responsible
    
    purchase_date = Column(DateTime, nullable=True)
    location = Column(String(255), nullable=True)
    is_unusable = Column(Boolean, default=False)
    
    company = relationship("Company", back_populates="equipment")
    category = relationship("EquipmentCategory", back_populates="equipment")
    department = relationship("Department", back_populates="equipment")
    employee = relationship("User", foreign_keys=[employee_id], back_populates="owned_equipment")
    technician = relationship("User", foreign_keys=[technician_id], back_populates="assigned_equipment")
    requests = relationship("MaintenanceRequest", back_populates="equipment")
    workcenter = relationship("Workcenter", back_populates="equipment")

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Basic Info
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Enums for Workflow
    request_type = Column(Enum(RequestType), default=RequestType.CORRECTIVE, nullable=False)
    stage = Column(Enum(MaintenanceStage), default=MaintenanceStage.NEW, nullable=False)
    
    # Kanban & Calendar Data
    scheduled_date = Column(DateTime, nullable=True) # Used for Calendar View
    duration = Column(Integer, default=0) # "Hours Spent" (Required for 'Repaired' stage)
    
    # --- Foreign Keys ---
    
    # The "What"
    equipment_id = Column(UUID(as_uuid=True), ForeignKey("equipment.id"), nullable=True)
    workcenter_id = Column(UUID(as_uuid=True), ForeignKey("workcenters.id"), nullable=True)
    
    # The "Who" (Logic: Only team members should pick this up)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False)
    technician_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)   
    
    # The "Where" (Multi-company segregation)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    
    # Tracking/Auto-fill Data (Required for Page 2: Auto-fill Equipment Category)
    # We store these directly on the request for historical reporting snapshot
    category_id = Column(UUID(as_uuid=True), ForeignKey("equipment_categories.id"), nullable=False)

    # priority setting as per forntend wireframe
    priority = Column(Integer, default=1, nullable=False)  # Values: 1, 2, or 3
    
    # Audit Trail
    created_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    instructions = Column(Text, nullable=True)
    is_blocked = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    # --- Relationships ---

    # Link back to equipment
    equipment = relationship("Equipment", back_populates="requests")
    
    # Link to the Maintenance Team
    team = relationship("Team", back_populates="requests")
    
    # fixed relationships
    technician = relationship("User", foreign_keys=[technician_id], back_populates="assigned_requests")
    creator = relationship("User", foreign_keys=[created_by_id], back_populates="created_requests")
    
    # Link to the Company
    company = relationship("Company")
    
    # Link to Category (for the Pivot/Graph reports)
    category = relationship("EquipmentCategory")

    workcenter = relationship("Workcenter", back_populates="requests")