from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext

# Import database session and User model
from app.db.session import get_db
from app.modules.users.model import User 

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# Setup CryptContext for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    return pwd_context.hash(password)

# Schema (DTO) for receiving incoming data from the frontend
class UserCreateDTO(BaseModel):
    name: str
    phone: str
    password: str
    # Removed 'role' because it does not exist in the database model

# Signup Endpoint (POST /users/)
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreateDTO, db: Session = Depends(get_db)):
    try:
        # 1. Check if an account with this phone number already exists
        existing_user = db.query(User).filter(User.phone == user.phone).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="An account with this phone number already exists!")
        
        # 2. Hash (encrypt) the password for database security
        hashed_password = get_password_hash(user.password)
        
        # 3. Map data to the User database model (matching exact column names)
        new_user = User(
            full_name=user.name,           # Mapped to 'full_name' in the DB
            phone=user.phone,
            password_hash=hashed_password, # Mapped to 'password_hash' in the DB
            is_active=True
        )
        
        # 4. Save the new user to the database
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {"message": "Account created successfully", "user_id": new_user.id}
    
    except HTTPException as he:
        db.rollback()
        raise he
    except Exception as e:
        db.rollback()
        print("Signup Error:", e)
        raise HTTPException(status_code=500, detail="Failed to create account. Please try again.")