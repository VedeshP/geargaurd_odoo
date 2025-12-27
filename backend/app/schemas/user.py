from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from app.models.base import UserRole

# Data required to create a user
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    company_id: UUID # Required because of our multi-company schema
    department_id: Optional[UUID] = None
    role: Optional[UserRole] = UserRole.EMPLOYEE # Default to employee

# Data returned to the frontend (excludes password)
class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: UserRole
    company_id: UUID
    department_id: Optional[UUID]

    class Config:
        from_attributes = True # Allows Pydantic to read SQLAlchemy models