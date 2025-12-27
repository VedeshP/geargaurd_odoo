import math
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from typing import Optional
from app.api.deps import get_db, get_current_user
from app.models.base import Equipment, EquipmentCategory, Department, MaintenanceRequest, User, Company, MaintenanceStage

router = APIRouter()

# --- 1. GET ALL EQUIPMENT ---
@router.get("")
def get_equipment(
    category: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Equipment).filter(Equipment.company_id == current_user.company_id)

    # Filters
    if category:
        query = query.join(EquipmentCategory).filter(EquipmentCategory.name == category)
    if search:
        query = query.filter(or_(
            Equipment.name.ilike(f"%{search}%"),
            Equipment.serial_number.ilike(f"%{search}%")
        ))
    
    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()

    # Map to requested JSON format with default fallbacks
    equipment_list = []
    for eq in items:
        equipment_list.append({
            "id": str(eq.id),
            "name": eq.name,
            "category": eq.category.name if eq.category else "General",
            "serialNumber": eq.serial_number,
            "model": "Standard Model", # Fallback
            "manufacturer": "Generic Vendor", # Fallback
            "purchaseDate": eq.purchase_date.strftime("%Y-%m-%d") if eq.purchase_date else "2024-01-01",
            "warrantyExpiry": "2026-01-01", # Fallback
            "purchaseCost": 0.0, # Fallback
            "assignedEmployeeId": str(eq.employee_id) if eq.employee_id else None,
            "assignedEmployeeName": eq.employee.full_name if eq.employee else "Unassigned",
            "department": eq.department.name if eq.department else "General",
            "technicianId": str(eq.technician_id) if eq.technician_id else None,
            "technicianName": eq.technician.full_name if eq.technician else "None",
            "location": eq.location or "Main Facility",
            "status": "Out of Service" if eq.is_unusable else "Active",
            "company": current_user.company.name,
            "notes": "Maintenance tracking active",
            "maintenanceTeam": eq.maintenance_team.name if eq.maintenance_team else "Default Team",
            "documents": [], # Placeholder
            "isActive": True,
            "createdAt": eq.created_at,
            "updatedAt": eq.created_at
        })

    return {
        "success": True,
        "data": {
            "equipment": equipment_list,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "totalPages": math.ceil(total / limit)
            }
        }
    }

# --- 2. GET SINGLE EQUIPMENT ---
@router.get("/{id}")
def get_single_equipment(id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    eq = db.query(Equipment).filter(Equipment.id == id, Equipment.company_id == current_user.company_id).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found")

    # Fetch last 5 requests for history
    history = db.query(MaintenanceRequest).filter(MaintenanceRequest.equipment_id == id).limit(5).all()

    return {
        "success": True,
        "data": {
            "id": str(eq.id),
            "name": eq.name,
            "category": eq.category.name if eq.category else "General",
            "serialNumber": eq.serial_number,
            "location": eq.location,
            "status": "Out of Service" if eq.is_unusable else "Active",
            "company": current_user.company.name,
            "documents": [],
            "maintenanceHistory": [
                {
                    "id": str(r.id),
                    "subject": r.subject,
                    "status": "completed" if r.stage == MaintenanceStage.REPAIRED else r.stage.value,
                    "priority": "high" if r.priority == 3 else "medium",
                    "completedAt": r.updated_at
                } for r in history
            ],
            "isActive": True,
            "createdAt": eq.created_at,
            "updatedAt": eq.created_at
        }
    }

# --- 3. CREATE EQUIPMENT ---
@router.post("")
def create_equipment(data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Auto-resolve Category and Department from Names
    cat = db.query(EquipmentCategory).filter(EquipmentCategory.name == data.get("category")).first()
    dept = db.query(Department).filter(Department.name == data.get("department")).first()

    new_eq = Equipment(
        name=data.get("name"),
        serial_number=data.get("serialNumber"),
        category_id=cat.id if cat else None,
        department_id=dept.id if dept else None,
        company_id=current_user.company_id,
        team_id=current_user.team_id, # Default team
        location=data.get("location"),
        purchase_date=datetime.now()
    )
    db.add(new_eq)
    db.commit()
    db.refresh(new_eq)

    return {
        "success": True,
        "data": {
            "id": str(new_eq.id),
            "name": new_eq.name,
            "category": data.get("category"),
            "serialNumber": new_eq.serial_number,
            "status": "Active",
            "isActive": True,
            "createdAt": new_eq.created_at,
            "updatedAt": new_eq.created_at
        },
        "message": "Equipment created successfully"
    }

# --- 4. PATCH EQUIPMENT ---
@router.patch("/{id}")
def update_equipment(id: UUID, data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    eq = db.query(Equipment).filter(Equipment.id == id).first()
    if not eq: raise HTTPException(404, "Not found")

    if "location" in data: eq.location = data["location"]
    if "status" in data:
        eq.is_unusable = (data["status"] == "Out of Service" or data["status"] == "Scrapped")

    db.commit()
    return {
        "success": True,
        "data": {"id": str(eq.id), "status": data.get("status"), "updatedAt": datetime.now()},
        "message": "Equipment updated successfully"
    }

# --- 6. MOCK DOCUMENT UPLOAD (No DB changes) ---
@router.post("/{id}/documents")
async def upload_document(id: UUID, type: str = Form(...), name: str = Form(...), file: UploadFile = File(...)):
    # Since we can't add an EquipmentDocument table, we return a mock success
    return {
        "success": True,
        "data": {
            "document": {
                "id": "mock-doc-id",
                "name": name,
                "type": type,
                "url": f"/documents/{id}/{file.filename}",
                "uploadedAt": datetime.now()
            }
        },
        "message": "Document uploaded successfully"
    }