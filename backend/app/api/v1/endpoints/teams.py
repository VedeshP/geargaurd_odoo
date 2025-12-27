from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from app.api.deps import get_db, get_current_user
from app.models.base import User, Team, Company
from app.schemas.team import TeamCreate, TeamCreateResponse

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