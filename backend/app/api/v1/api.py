from fastapi import APIRouter
from app.api.v1.endpoints import auth, dashboard, requests, teams, equipment, categories

api_router = APIRouter()

# Prefixed Auth endpoints: /api/v1/auth/login, /api/v1/auth/signup, etc.
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(requests.router, prefix="/maintenance/requests", tags=["Maintenance"])
api_router.include_router(teams.router, prefix="/teams", tags=["Teams"])
api_router.include_router(equipment.router, prefix="/equipment", tags=["Equipment"])
api_router.include_router(categories.router, prefix="/equipment-categories", tags=["Equipment Categories"])
# Future endpoints will be added here like this:
# api_router.include_router(equipment.router, prefix="/equipment", tags=["Equipment"])