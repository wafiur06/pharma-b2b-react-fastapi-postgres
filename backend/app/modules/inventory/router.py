from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.users.model import User

from app.modules.inventory.schema import InventoryLotCreate, InventoryLotResponse
from app.modules.inventory.service import create_inventory_lot


router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"],
)

@router.get("/", response_model=List[dict])
def get_inventory_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # এখানে আপনার ডেটাবেস থেকে ইনভেন্টরি ডেটা ফেচ করার লজিক দেবেন।
    # আপাতত টেস্ট করার জন্য ফাঁকা লিস্ট রিটার্ন করতে পারেন:
    return []
@router.post(
    "/lots",
    response_model=InventoryLotResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_inventory_lot(
    data: InventoryLotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_inventory_lot(db=db, data=data)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
    