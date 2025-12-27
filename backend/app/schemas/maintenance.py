from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.models.base import RequestType, MaintenanceStage

class RequestResponseItem(BaseModel):
    id: UUID
    subject: str
    equipmentId: Optional[UUID] = Field(None, alias="equipment_id")
    teamId: UUID = Field(..., alias="team_id")
    technicianId: Optional[UUID] = Field(None, alias="technician_id")
    categoryId: UUID = Field(..., alias="category_id")
    companyId: UUID = Field(..., alias="company_id")
    maintenanceFor: str # Derived: "equipment" or "workcenter"
    workCenter: Optional[UUID] = Field(None, alias="workcenter_id")
    maintenanceType: str
    priority: str # String representation: high, medium, low
    status: str
    requestDate: datetime = Field(..., alias="created_at")
    scheduledDate: Optional[datetime] = Field(None, alias="scheduled_date")
    duration: Optional[int] = None
    notes: Optional[str] = Field(None, alias="description")
    instructions: Optional[str] = None
    isBlocked: bool = Field(False, alias="is_blocked")
    isArchived: bool = Field(False, alias="is_archived")
    isActive: bool = Field(True, alias="is_active")
    createdAt: datetime = Field(..., alias="created_at")
    updatedAt: datetime = Field(..., alias="updated_at")

    class Config:
        from_attributes = True
        populate_by_name = True

class Pagination(BaseModel):
    page: int
    limit: int
    total: int
    totalPages: int

class MaintenanceListResponse(BaseModel):
    success: bool = True
    data: dict # Contains {"requests": [...], "pagination": {...}}



# Nested schemas for the Detail View
class EquipmentShort(BaseModel):
    id: UUID
    name: str
    serialNumber: str = Field(..., alias="serial_number")

    class Config:
        from_attributes = True
        populate_by_name = True

class TeamShort(BaseModel):
    id: UUID
    name: str

    class Config:
        from_attributes = True

class TechnicianShort(BaseModel):
    id: UUID
    userId: UUID # In our schema, this is the same as ID
    name: str = Field(..., alias="full_name")
    email: str

    class Config:
        from_attributes = True
        populate_by_name = True

# The Main Detail Response Schema
class RequestDetailData(BaseModel):
    id: UUID
    subject: str
    equipmentId: Optional[UUID] = Field(None, alias="equipment_id")
    equipment: Optional[EquipmentShort]
    teamId: UUID = Field(..., alias="team_id")
    team: TeamShort
    technicianId: Optional[UUID] = Field(None, alias="technician_id")
    technician: Optional[TechnicianShort]
    priority: str
    status: str
    maintenanceType: str = Field(..., alias="request_type")
    requestDate: datetime = Field(..., alias="created_at")
    notes: Optional[str] = Field(None, alias="description")
    createdAt: datetime = Field(..., alias="created_at")
    updatedAt: datetime = Field(..., alias="updated_at")

    class Config:
        from_attributes = True
        populate_by_name = True

class RequestDetailResponse(BaseModel):
    success: bool = True
    data: RequestDetailData



class RequestCreate(BaseModel):
    subject: str
    equipmentId: Optional[UUID] = None
    workcenterId: Optional[UUID] = None
    teamId: Optional[UUID] = None
    technicianId: Optional[UUID] = None
    categoryId: Optional[UUID] = None
    priority: str = "medium" # low, medium, high
    maintenanceType: str = "corrective" # corrective, preventive
    scheduledDate: Optional[datetime] = None
    duration: Optional[str] = "00:00" # HH:mm format
    notes: Optional[str] = None
    instructions: Optional[str] = None

    @field_validator('priority')
    def validate_priority(cls, v):
        if v not in ["low", "medium", "high"]:
            return "medium"
        return v

class RequestCreateDataOut(BaseModel):
    id: UUID
    subject: str
    equipmentId: Optional[UUID]
    teamId: UUID
    technicianId: Optional[UUID]
    priority: str
    status: str
    createdAt: datetime
    updatedAt: datetime
    isActive: bool

class RequestCreateResponse(BaseModel):
    success: bool = True
    data: RequestCreateDataOut
    message: str = "Maintenance request created successfully"


class RequestUpdate(BaseModel):
    status: Optional[str] = None # new, in-progress, completed, scrap
    technicianId: Optional[UUID] = None
    scheduledDate: Optional[datetime] = None
    notes: Optional[str] = None
    priority: Optional[str] = None

class RequestUpdateDataOut(BaseModel):
    id: UUID
    subject: str
    status: str
    technicianId: Optional[UUID]
    scheduledDate: Optional[datetime]
    updatedAt: datetime

class RequestUpdateResponse(BaseModel):
    success: bool = True
    data: RequestUpdateDataOut
    message: str

class RequestDeleteResponse(BaseModel):
    success: bool = True
    data: dict
    message: str