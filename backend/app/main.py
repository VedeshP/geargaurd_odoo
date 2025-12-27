import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router

app = FastAPI(
    title="GearGuard: The Ultimate Maintenance Tracker",
    description="Backend API for the GearGuard hackathon solution (Inspired by Odoo)",
    version="1.0.0"
)

# --- CORS CONFIGURATION ---
# Allowing all origins for hackathon speed and frontend-backend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows any origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PATCH, etc.)
    allow_headers=["*"],  # Allows all headers (Authorization, Content-Type, etc.)
)

# --- ROUTER REGISTRATION ---
# All API endpoints will be prefixed with /api/v1
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "message": "Welcome to GearGuard API",
        "docs": "/docs",
        "status": "active"
    }

if __name__ == "__main__":
    # To run: python app/main.py
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)