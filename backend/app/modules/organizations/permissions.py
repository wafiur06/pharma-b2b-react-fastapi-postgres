from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.organizations.enums import OrganizationRole
from app.modules.organizations.membership_model import OrganizationUser
from app.modules.organizations.service import get_organization_membership
from app.modules.users.model import User


def require_organization_roles(
    *allowed_roles: OrganizationRole,
):
    def role_checker(
        organization_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
    ) -> OrganizationUser:

        membership = get_organization_membership(
            db=db,
            organization_id=organization_id,
            user_id=current_user.id,
        )

        if membership is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not an active member of this organization.",
            )

        if membership.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )

        return membership

    return role_checker