from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user

from app.modules.depots.schema import (
    DepotCreate,
    DepotResponse,
)

from app.modules.depots.service import (
    create_depot,
)

from app.modules.users.model import User


router = APIRouter(
    prefix="/depots",
    tags=["Depots"],
)


@router.post(
    "",
    response_model=DepotResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_depot(
    depot_data: DepotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    try:

        depot = create_depot(
            db=db,
            depot_data=depot_data,
        )

        return depot


    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )