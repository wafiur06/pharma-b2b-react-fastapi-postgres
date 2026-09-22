from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.users.model import User

from app.modules.cart.schema import CartItemCreate, CartItemResponse
from app.modules.cart.service import add_item_to_cart

router = APIRouter(
    prefix="/cart",
    tags=["Cart"],
)

@router.post(
    "/items",
    response_model=CartItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_to_cart(
    pharmacy_id: int,
    item_data: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return add_item_to_cart(
            db=db, 
            pharmacy_id=pharmacy_id, 
            user_id=current_user.id, 
            item_data=item_data
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )