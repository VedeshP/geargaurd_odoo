from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, Query
from uuid import UUID
from datetime import datetime

from app.api.deps import get_db, get_current_user
from app.models.base import User, Team, Company
from app.schemas.team import TeamCreate, TeamCreateResponse
from app.schemas.team import TeamUpdate, TeamUpdateResponse, TeamMembersResponse
from app.models.base import Equipment, MaintenanceRequest, MaintenanceStage


router = APIRouter()

@router.post("", response_model=TeamCreateResponse, status_code=status.HTTP_201_CREATED)
def create_team(
    team_in: TeamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Verify/Find Company
    # We use the current_user's company_id for security, 
    # but we can also check the name provided in the request
    company = db.query(Company).filter(Company.name == team_in.company).first()
    if not company:
        # Fallback to current user's company if name doesn't match
        company_id = current_user.company_id
        company_name = db.query(Company).get(company_id).name
    else:
        company_id = company.id
        company_name = company.name

    # 2. Create the Team
    new_team = Team(
        name=team_in.name,
        description=team_in.description,
        company_id=company_id,
        is_active=True
    )
    db.add(new_team)
    db.flush() # Get team ID without committing yet

    # 3. Process Members (Link existing users to this team)
    member_data_out = []
    for member in team_in.members:
        user = db.query(User).filter(User.id == member.userId).first()
        if user:
            user.team_id = new_team.id # Assign user to the new team
            member_data_out.append({
                "id": str(user.id)[:8], # Simplified ID for response example
                "userId": user.id,
                "name": user.full_name,
                "email": user.email,
                "role": user.role.value if hasattr(user.role, 'value') else str(user.role)
            })

    db.commit()
    db.refresh(new_team)

    return {
        "success": True,
        "data": {
            "id": str(new_team.id)[:8], # Matching your "4" example
            "name": new_team.name,
            "company": company_name,
            "description": new_team.description,
            "members": member_data_out,
            "isActive": new_team.is_active,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        "message": "Team created successfully"
    }


@router.patch("/{team_id}", response_model=TeamUpdateResponse)
def update_team(
    team_id: UUID,
    team_in: TeamUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    team = db.query(Team).filter(Team.id == team_id, Team.company_id == current_user.company_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    if team_in.name: team.name = team_in.name
    if team_in.description: team.description = team_in.description

    member_out = []
    if team_in.members:
        # First, remove existing members from this team (unlink them)
        db.query(User).filter(User.team_id == team.id).update({User.team_id: None})
        
        # Link the new members provided in the request
        for m in team_in.members:
            user = db.query(User).filter(User.id == m['userId']).first()
            if user:
                user.team_id = team.id
                member_out.append({
                    "id": str(user.id)[:8],
                    "userId": user.id,
                    "name": user.full_name,
                    "email": user.email,
                    "role": m.get('role', 'technician')
                })

    db.commit()
    db.refresh(team)

    return {
        "success": True,
        "data": {
            "id": str(team.id)[:8],
            "name": team.name,
            "description": team.description,
            "members": member_out,
            "updatedAt": datetime.utcnow()
        },
        "message": "Team updated successfully"
    }

# --- 5. DELETE TEAM (With Dependency Check) ---
@router.delete("/{team_id}")
def delete_team(
    team_id: UUID,
    force: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    team = db.query(Team).filter(Team.id == team_id, Team.company_id == current_user.company_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Dependency Check
    equipment_count = db.query(Equipment).filter(Equipment.team_id == team_id).count()
    active_req_count = db.query(MaintenanceRequest).filter(
        MaintenanceRequest.team_id == team_id,
        MaintenanceRequest.stage.in_([MaintenanceStage.NEW, MaintenanceStage.IN_PROGRESS])
    ).count()

    if not force and (equipment_count > 0 or active_req_count > 0):
        return {
            "success": False,
            "error": {
                "code": "TEAM_HAS_DEPENDENCIES",
                "message": "Cannot delete team with assigned equipment or active maintenance requests",
                "details": {
                    "assignedEquipment": equipment_count,
                    "activeRequests": active_req_count
                }
            }
        }

    # Soft Delete
    team.is_active = False
    db.commit()

    return {
        "success": True,
        "data": {"id": str(team.id)[:8], "isActive": False, "updatedAt": datetime.utcnow()},
        "message": "Team deleted successfully"
    }

# --- 6. GET TEAM MEMBERS (With Statistics) ---
@router.get("/{team_id}/members", response_model=TeamMembersResponse)
def get_team_members(
    team_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    members = db.query(User).filter(User.team_id == team_id).all()
    
    member_details = []
    for member in members:
        # Active: New or In-Progress
        active = db.query(MaintenanceRequest).filter(
            MaintenanceRequest.technician_id == member.id,
            MaintenanceRequest.stage.in_([MaintenanceStage.NEW, MaintenanceStage.IN_PROGRESS])
        ).count()

        # Completed: Repaired
        completed_reqs = db.query(MaintenanceRequest).filter(
            MaintenanceRequest.technician_id == member.id,
            MaintenanceRequest.stage == MaintenanceStage.REPAIRED
        ).all()

        # Average duration calculation
        durations = [r.duration for r in completed_reqs if r.duration > 0]
        avg_time = sum(durations) / len(durations) if durations else 0

        member_details.append({
            "id": member.id,
            "userId": member.id,
            "name": member.full_name,
            "email": member.email,
            "role": member.role.value if hasattr(member.role, 'value') else str(member.role),
            "statistics": {
                "activeRequests": active,
                "completedRequests": len(completed_reqs),
                "averageCompletionTime": f"{avg_time:.1f} hours"
            }
        })

    return {
        "success": True,
        "data": {"members": member_details}
    }