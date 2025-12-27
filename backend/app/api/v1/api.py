from fastapi import APIRouter
from app.api.v1.endpoints import auth #, equipment, requests, teams

api_router = APIRouter()

# Prefixed Auth endpoints: /api/v1/auth/login, /api/v1/auth/signup, etc.
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Future endpoints will be added here like this:
# api_router.include_router(equipment.router, prefix="/equipment", tags=["Equipment"])
# api_router.include_router(requests.router, prefix="/requests", tags=["Maintenance"])