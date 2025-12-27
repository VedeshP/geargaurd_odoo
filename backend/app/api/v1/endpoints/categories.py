from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional

from app.api.deps import get_db, get_current_user
from app.models.base import User, EquipmentCategory, Equipment

router = APIRouter()

# --- 1. GET ALL CATEGORIES ---
@router.get("")
def get_categories(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    categories = db.query(EquipmentCategory).all()
    
    result = []
    for cat in categories:
        # Calculate equipment count on the fly
        count = db.query(Equipment).filter(Equipment.category_id == cat.id).count()
        
        result.append({
            "id": str(cat.id),
            "name": cat.name,
            "description": "Asset category for " + cat.name,
            "parentCategory": None,
            "icon": "📁",
            "equipmentCount": count,
            "isActive": True,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })

    return {
        "success": True,
        "data": {"categories": result}
    }

# --- 2. CREATE CATEGORY ---
@router.post("", status_code=status.HTTP_201_CREATED)
def create_category(data: dict, db: Session = Depends(get_db)):
    # Check if exists
    existing = db.query(EquipmentCategory).filter(EquipmentCategory.name == data.get("name")).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")

    new_cat = EquipmentCategory(
        id=uuid4(),
        name=data.get("name")
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)

    return {
        "success": True,
        "data": {
            "id": str(new_cat.id),
            "name": new_cat.name,
            "description": data.get("description"),
            "parentCategory": data.get("parentCategory"),
            "icon": data.get("icon", "📡"),
            "equipmentCount": 0,
            "isActive": True,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        },
        "message": "Equipment category created successfully"
    }

# --- 3. PATCH CATEGORY ---
@router.patch("/{id}")
def update_category(id: UUID, data: dict, db: Session = Depends(get_db)):
    cat = db.query(EquipmentCategory).filter(EquipmentCategory.id == id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    if "name" in data:
        cat.name = data["name"]
    
    db.commit()
    
    return {
        "success": True,
        "data": {
            "id": str(cat.id),
            "name": cat.name,
            "description": data.get("description", "Updated description"),
            "updatedAt": datetime.now()
        },
        "message": "Equipment category updated successfully"
    }

# --- 4. DELETE CATEGORY (With Dependency Check) ---
@router.delete("/{id}")
def delete_category(id: UUID, db: Session = Depends(get_db)):
    cat = db.query(EquipmentCategory).filter(EquipmentCategory.id == id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    # Constraint Check: Does this category have equipment?
    equipment_count = db.query(Equipment).filter(Equipment.category_id == id).count()

    if equipment_count > 0:
        return {
            "success": False,
            "error": {
                "code": "CATEGORY_HAS_EQUIPMENT",
                "message": "Cannot delete category with assigned equipment",
                "details": {
                    "equipmentCount": equipment_count
                }
            }
        }

    # If no equipment, we perform the delete (or simulated soft delete)
    db.delete(cat)
    db.commit()

    return {
        "success": True,
        "data": {
            "id": str(id),
            "isActive": False,
            "updatedAt": datetime.now()
        },
        "message": "Equipment category deleted successfully"
    }