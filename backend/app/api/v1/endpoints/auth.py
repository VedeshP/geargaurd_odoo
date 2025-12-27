from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.api.deps import get_db
from app.models.base import User, Company
from app.schemas.auth import Token, LoginRequest, RefreshRequest
from app.core.security import (
    verify_password, 
    create_access_token, 
    create_refresh_token,
    REFRESH_SECRET_KEY,
    ALGORITHM
)

from app.schemas.user import UserCreate, UserOut
from app.core.security import get_password_hash

router = APIRouter()

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    # 1. Check User
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # 2. Verify Argon2 Password
    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # 3. Generate Tokens
    return {
        "access_token": create_access_token(subject=user.id),
        "refresh_token": create_refresh_token(subject=user.id),
        "token_type": "bearer",
    }

@router.post("/refresh", response_model=Token)
def refresh_token(data: RefreshRequest, db: Session = Depends(get_db)):
    """
    Takes a refresh token and returns a new access token.
    """
    try:
        payload = jwt.decode(data.refresh_token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "access_token": create_access_token(subject=user.id),
        "refresh_token": data.refresh_token, # Send same refresh token back or rotate it
        "token_type": "bearer",
    }


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user and link them to a company.
    """
    # 1. Check if user already exists
    user_exists = db.query(User).filter(User.email == user_in.email).first()
    if user_exists:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists."
        )

    # 2. Verify Company exists
    company = db.query(Company).filter(Company.id == user_in.company_id).first()
    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found. You must provide a valid Company ID."
        )

    # 3. Hash the password with Argon2
    hashed_password = get_password_hash(user_in.password)

    # 4. Create User Record
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        role=user_in.role,
        company_id=user_in.company_id,
        department_id=user_in.department_id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user