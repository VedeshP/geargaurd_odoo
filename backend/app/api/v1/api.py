from fastapi import APIRouter
from app.api.v1.endpoints import auth, dashboard, requests #, equipment, requests, teams

api_router = APIRouter()

# Prefixed Auth endpoints: /api/v1/auth/login, /api/v1/auth/signup, etc.
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(requests.router, prefix="/maintenance/requests", tags=["Maintenance"])
# Future endpoints will be added here like this:
# api_router.include_router(equipment.router, prefix="/equipment", tags=["Equipment"])