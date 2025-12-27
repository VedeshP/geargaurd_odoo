from pydantic import BaseModel
from typing import List, Optional, Dict
from uuid import UUID
from datetime import datetime

class TeamMemberSchema(BaseModel):
    userId: UUID # The ID of the technician
    name: str
    email: str
    role: str

class TeamCreate(BaseModel):
    name: str
    company: str # Company Name
    description: Optional[str] = None
    members: List[TeamMemberSchema]

class TeamCreateResponse(BaseModel):
    success: bool = True
    data: dict # Matches your detailed response structure
    message: str = "Team created successfully"





class MemberStats(BaseModel):
    activeRequests: int
    completedRequests: int
    averageCompletionTime: str

class TeamMemberDetail(BaseModel):
    id: UUID
    userId: UUID
    name: str
    email: str
    role: str
    statistics: Optional[MemberStats] = None

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    members: Optional[List[Dict]] = None

class TeamUpdateResponse(BaseModel):
    success: bool = True
    data: dict
    message: str

class TeamMembersResponse(BaseModel):
    success: bool = True
    data: Dict[str, List[TeamMemberDetail]]