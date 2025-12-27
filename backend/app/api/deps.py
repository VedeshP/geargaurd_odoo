from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.db.session import SessionLocal # Assuming you created this
from app.models.base import User
from app.core.security import SECRET_KEY, ALGORITHM
from app.schemas.auth import TokenPayload
import uuid

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
        
        # Convert string to UUID object to match DB type
        try:
            user_uuid = uuid.UUID(user_id_str)
        except ValueError:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    # Query using the UUID object
    user = db.query(User).filter(User.id == user_uuid).first()
    
    if user is None:
        raise credentials_exception
    return user