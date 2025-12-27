from pydantic import BaseModel
from typing import List, Optional
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