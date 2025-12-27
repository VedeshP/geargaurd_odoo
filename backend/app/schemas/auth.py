from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from app.schemas.user import UserOut

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: Optional[str] = None # This will be the User UUID string

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str


class LoginData(BaseModel):
    user: UserOut
    token: str
    refreshToken: str

class LoginResponse(BaseModel):
    success: bool = True
    data: LoginData

class RefreshResponse(BaseModel):
    success: bool = True
    data: dict # Will contain {"token": "...", "refreshToken": "..."}