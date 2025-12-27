from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class CriticalItem(BaseModel):
    id: UUID
    name: str
    status: str

class CriticalEquipment(BaseModel):
    count: int
    items: List[CriticalItem]

class TechnicianLoad(BaseModel):
    percentage: int
    totalTechnicians: int
    activeRequests: int

class OpenRequests(BaseModel):
    total: int
    overdue: int
    new: int
    inProgress: int

class DashboardData(BaseModel):
    criticalEquipment: CriticalEquipment
    technicianLoad: TechnicianLoad
    openRequests: OpenRequests

class DashboardResponse(BaseModel):
    success: bool = True
    data: DashboardData