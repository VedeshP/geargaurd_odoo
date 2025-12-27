from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_
from datetime import datetime, timezone
import math

from app.api.deps import get_db, get_current_user
from app.models.base import User, MaintenanceRequest, MaintenanceStage, RequestType, Equipment
from app.schemas.maintenance import MaintenanceListResponse, RequestDetailResponse, RequestCreate, RequestCreateResponse, RequestDeleteResponse, RequestUpdateResponse, RequestUpdate

from typing import Optional
from uuid import UUID

router = APIRouter()

@router.get("", response_model=MaintenanceListResponse)
def get_maintenance_requests(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    equipmentId: Optional[UUID] = None,
    teamId: Optional[UUID] = None,
    isActive: bool = True,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Base query filtered by Company
    query = db.query(MaintenanceRequest).filter(
        MaintenanceRequest.company_id == current_user.company_id,
        MaintenanceRequest.is_active == isActive
    )

    # 1. Filter by Status (Handling the "Overdue" special case)
    if status:
        if status == "overdue":
            now = datetime.now(timezone.utc)
            query = query.filter(
                MaintenanceRequest.stage.in_([MaintenanceStage.NEW, MaintenanceStage.IN_PROGRESS]),
                MaintenanceRequest.scheduled_date < now
            )
        elif status == "completed":
            query = query.filter(MaintenanceRequest.stage == MaintenanceStage.REPAIRED)
        else:
            # Maps "new", "in-progress" to MaintenanceStage enums
            status_map = {"new": MaintenanceStage.NEW, "in-progress": MaintenanceStage.IN_PROGRESS}
            if status in status_map:
                query = query.filter(MaintenanceRequest.stage == status_map[status])

    # 2. Filter by Priority (Map string to Integer)
    if priority:
        priority_map = {"high": 3, "medium": 2, "low": 1}
        if priority in priority_map:
            query = query.filter(MaintenanceRequest.priority == priority_map[priority])

    # 3. Specific ID Filters
    if equipmentId:
        query = query.filter(MaintenanceRequest.equipment_id == equipmentId)
    if teamId:
        query = query.filter(MaintenanceRequest.team_id == teamId)

    # 4. Pagination Calculation
    total_count = query.count()
    total_pages = math.ceil(total_count / limit) if total_count > 0 else 0
    requests_raw = query.offset((page - 1) * limit).limit(limit).all()

    # 5. Format Response to match JSON example
    formatted_requests = []
    priority_rev_map = {3: "high", 2: "medium", 1: "low"}
    
    for req in requests_raw:
        formatted_requests.append({
            "id": str(req.id),
            "subject": req.subject,
            "equipmentId": req.equipment_id,
            "teamId": req.team_id,
            "technicianId": req.technician_id,
            "categoryId": req.category_id,
            "companyId": req.company_id,
            "maintenanceFor": "equipment" if req.equipment_id else "workcenter",
            "workCenter": req.workcenter_id,
            "maintenanceType": req.request_type.value,
            "priority": priority_rev_map.get(req.priority, "low"),
            "status": "completed" if req.stage == MaintenanceStage.REPAIRED else req.stage.value,
            "requestDate": req.created_at,
            "scheduledDate": req.scheduled_date,
            "duration": req.duration,
            "notes": req.description,
            "instructions": req.instructions,
            "isBlocked": req.is_blocked,
            "isArchived": req.is_archived,
            "isActive": req.is_active,
            "createdAt": req.created_at,
            "updatedAt": req.updated_at,
        })

    return {
        "success": True,
        "data": {
            "requests": formatted_requests,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total_count,
                "totalPages": total_pages
            }
        }
    }


@router.get("/{request_id}", response_model=RequestDetailResponse)
def get_maintenance_request_detail(
    request_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch request with eager loading for nested objects
    # We filter by company_id to ensure a user can't see requests from other companies
    request = db.query(MaintenanceRequest).options(
        joinedload(MaintenanceRequest.equipment),
        joinedload(MaintenanceRequest.team),
        joinedload(MaintenanceRequest.technician)
    ).filter(
        MaintenanceRequest.id == request_id,
        MaintenanceRequest.company_id == current_user.company_id
    ).first()

    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maintenance request not found"
        )

    # Priority mapping logic
    priority_map = {3: "high", 2: "medium", 1: "low"}
    
    # Status mapping logic (Matching your JSON example)
    status_str = "new"
    if request.stage == MaintenanceStage.REPAIRED:
        status_str = "completed"
    else:
        status_str = request.stage.value

    # Construct the response
    return {
        "success": True,
        "data": {
            "id": request.id,
            "subject": request.subject,
            "equipmentId": request.equipment_id,
            "equipment": request.equipment,
            "teamId": request.team_id,
            "team": request.team,
            "technicianId": request.technician_id,
            # For the technician, we map our User model fields to match your JSON
            "technician": {
                "id": request.technician.id,
                "userId": request.technician.id, # Using ID as userId
                "full_name": request.technician.full_name,
                "email": request.technician.email
            } if request.technician else None,
            "priority": priority_map.get(request.priority, "low"),
            "status": status_str,
            "request_type": request.request_type.value,
            "created_at": request.created_at,
            "description": request.description,
            "updated_at": request.updated_at
        }
    }


@router.post("", response_model=RequestCreateResponse, status_code=status.HTTP_201_CREATED)
def create_maintenance_request(
    req_in: RequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Logic: Must have either Equipment or Workcenter
    if not req_in.equipmentId and not req_in.workcenterId:
        raise HTTPException(status_code=400, detail="Must provide either an Equipment ID or a Workcenter ID")

    # 2. AUTO-FILL LOGIC (The PDF Requirement)
    # If Equipment is selected, fetch defaults from it
    final_team_id = req_in.teamId
    final_category_id = req_in.categoryId
    
    if req_in.equipmentId:
        equipment = db.query(Equipment).filter(Equipment.id == req_in.equipmentId).first()
        if not equipment:
            raise HTTPException(status_code=404, detail="Equipment not found")
        
        # If user didn't provide a Team or Category, grab from Equipment
        if not final_team_id:
            final_team_id = equipment.team_id
        if not final_category_id:
            final_category_id = equipment.category_id

    # Check if we finally have a Team and Category (required for DB)
    if not final_team_id or not final_category_id:
        raise HTTPException(status_code=400, detail="Maintenance Team and Category are required.")

    # 3. MAPPING
    priority_map = {"high": 3, "medium": 2, "low": 1}
    
    # Duration Parsing: "01:30" -> 90 minutes or just 1 hour
    # For simplicity, we convert to total hours (integer) as per our schema
    try:
        hours, minutes = map(int, req_in.duration.split(":"))
        total_hours = hours + (1 if minutes > 30 else 0)
    except:
        total_hours = 0

    # 4. CREATE RECORD
    new_request = MaintenanceRequest(
        subject=req_in.subject,
        description=req_in.notes,
        instructions=req_in.instructions,
        request_type=RequestType.CORRECTIVE if req_in.maintenanceType == "corrective" else RequestType.PREVENTIVE,
        stage=MaintenanceStage.NEW,
        priority=priority_map.get(req_in.priority, 2),
        scheduled_date=req_in.scheduledDate,
        duration=total_hours,
        equipment_id=req_in.equipmentId,
        workcenter_id=req_in.workcenterId,
        team_id=final_team_id,
        category_id=final_category_id,
        technician_id=req_in.technicianId,
        company_id=current_user.company_id,
        created_by_id=current_user.id
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    # 5. RESPONSE
    return {
        "success": True,
        "data": {
            "id": new_request.id,
            "subject": new_request.subject,
            "equipmentId": new_request.equipment_id,
            "teamId": new_request.team_id,
            "technicianId": new_request.technician_id,
            "priority": req_in.priority,
            "status": "new",
            "createdAt": new_request.created_at,
            "updatedAt": new_request.updated_at,
            "isActive": new_request.is_active
        },
        "message": "Maintenance request created successfully"
    }


@router.patch("/{request_id}", response_model=RequestUpdateResponse)
def update_maintenance_request(
    request_id: UUID,
    req_in: RequestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Fetch Request
    request = db.query(MaintenanceRequest).filter(
        MaintenanceRequest.id == request_id,
        MaintenanceRequest.company_id == current_user.company_id
    ).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    # 2. Status Mapping & Scrap Logic
    if req_in.status:
        status_map = {
            "new": MaintenanceStage.NEW,
            "in-progress": MaintenanceStage.IN_PROGRESS,
            "completed": MaintenanceStage.REPAIRED,
            "scrap": MaintenanceStage.SCRAP
        }
        
        new_stage = status_map.get(req_in.status)
        if new_stage:
            request.stage = new_stage
            
            # --- SCRAP LOGIC (Automation Feature) ---
            if new_stage == MaintenanceStage.SCRAP and request.equipment_id:
                equipment = db.query(Equipment).get(request.equipment_id)
                if equipment:
                    equipment.is_unusable = True # Mark as unusable
                    # Odoo-style note logging would happen here
        
    # 3. Update Other Fields
    if req_in.technicianId:
        request.technician_id = req_in.technicianId
    if req_in.scheduledDate:
        request.scheduled_date = req_in.scheduledDate
    if req_in.notes:
        request.description = req_in.notes
    if req_in.priority:
        p_map = {"high": 3, "medium": 2, "low": 1}
        request.priority = p_map.get(req_in.priority, 1)

    request.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(request)

    return {
        "success": True,
        "data": {
            "id": request.id,
            "subject": request.subject,
            "status": req_in.status if req_in.status else request.stage.value,
            "technicianId": request.technician_id,
            "scheduledDate": request.scheduled_date,
            "updatedAt": request.updated_at
        },
        "message": "Maintenance request updated successfully"
    }

@router.delete("/{request_id}", response_model=RequestDeleteResponse)
def delete_maintenance_request(
    request_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Soft Delete Implementation
    request = db.query(MaintenanceRequest).filter(
        MaintenanceRequest.id == request_id,
        MaintenanceRequest.company_id == current_user.company_id
    ).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    request.is_active = False # Soft delete
    request.updated_at = datetime.utcnow()
    db.commit()

    return {
        "success": True,
        "data": {
            "id": request.id,
            "isActive": False,
            "updatedAt": request.updated_at
        },
        "message": "Maintenance request deleted successfully"
    }