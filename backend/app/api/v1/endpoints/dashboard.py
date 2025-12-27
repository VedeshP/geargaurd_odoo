from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone

from app.api.deps import get_db, get_current_user
from app.models.base import User, Equipment, MaintenanceRequest, MaintenanceStage, UserRole
from app.schemas.dashboard import DashboardResponse

router = APIRouter()

@router.get("/metrics", response_model=DashboardResponse)
def get_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    company_id = current_user.company_id
    now = datetime.now(timezone.utc)

    # 1. Critical Equipment (Out of Service / Scrapped)
    critical_query = db.query(Equipment).filter(
        Equipment.company_id == company_id,
        Equipment.is_unusable == True
    ).all()
    
    critical_items = [
        {"id": eq.id, "name": eq.name, "status": "Out of Service"} 
        for eq in critical_query
    ]

    # 2. Open Requests Metrics
    # Count requests by stage for this company
    all_requests = db.query(MaintenanceRequest).filter(
        MaintenanceRequest.company_id == company_id
    ).all()

    new_count = len([r for r in all_requests if r.stage == MaintenanceStage.NEW])
    in_progress_count = len([r for r in all_requests if r.stage == MaintenanceStage.IN_PROGRESS])
    
    # Overdue = Not Repaired/Scrapped AND Scheduled Date is in the past
    overdue_count = len([
        r for r in all_requests 
        if r.stage not in [MaintenanceStage.REPAIRED, MaintenanceStage.SCRAP]
        and r.scheduled_date and r.scheduled_date.replace(tzinfo=timezone.utc) < now
    ])

    # 3. Technician Load
    total_techs = db.query(User).filter(
        User.company_id == company_id,
        User.role == UserRole.TECHNICIAN
    ).count()

    active_requests_count = new_count + in_progress_count
    
    # Logic for load percentage: (Active Tasks / (Capacity per tech * Total Techs))
    # Assuming 1 technician can comfortably handle 3 active tasks
    capacity_multiplier = 3
    if total_techs > 0:
        load_percentage = min(int((active_requests_count / (total_techs * capacity_multiplier)) * 100), 100)
    else:
        load_percentage = 0

    return {
        "success": True,
        "data": {
            "criticalEquipment": {
                "count": len(critical_items),
                "items": critical_items
            },
            "technicianLoad": {
                "percentage": load_percentage,
                "totalTechnicians": total_techs,
                "activeRequests": active_requests_count
            },
            "openRequests": {
                "total": active_requests_count,
                "overdue": overdue_count,
                "new": new_count,
                "inProgress": in_progress_count
            }
        }
    }