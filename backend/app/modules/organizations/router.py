from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.modules.organizations.enums import OrganizationRole
from app.modules.organizations.membership_model import OrganizationUser
from app.modules.organizations.permissions import require_organization_roles

from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.organizations.schema import (
    MyOrganizationResponse,
    OrganizationCreate,
    OrganizationResponse,
)
from app.modules.organizations.service import (
    create_organization,
    get_user_organizations,
)
from app.modules.users.model import User


router = APIRouter(
    prefix="/organizations",
    tags=["Organizations"],
)


@router.post(
    "",
    response_model=OrganizationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_organization(
    organization_data: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        organization = create_organization(
            db=db,
            organization_data=organization_data,
            creator=current_user,
        )

        return organization

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.get(
    "/me",
    response_model=list[MyOrganizationResponse],
    status_code=status.HTTP_200_OK,
)
def get_my_organizations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_organizations(
        db=db,
        user_id=current_user.id,
    )

@router.get(
    "/{organization_id}/admin-check",
    status_code=status.HTTP_200_OK,
)
def organization_admin_check(
    organization_id: int,
    membership: OrganizationUser = Depends(
        require_organization_roles(
            OrganizationRole.COMPANY_ADMIN
        )
    ),
):
    return {
        "message": "Access granted.",
        "organization_id": organization_id,
        "user_id": membership.user_id,
        "role": membership.role.value,
    }