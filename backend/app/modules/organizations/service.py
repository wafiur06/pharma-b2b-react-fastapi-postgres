from sqlalchemy.orm import Session

from app.modules.organizations.enums import (
    OrganizationRole,
    OrganizationType,
)
from app.modules.organizations.membership_model import OrganizationUser
from app.modules.organizations.model import Organization
from app.modules.organizations.schema import OrganizationCreate
from app.modules.users.model import User
from sqlalchemy import select

def get_default_creator_role(
    organization_type: OrganizationType,
) -> OrganizationRole:

    role_map = {
        OrganizationType.PLATFORM: OrganizationRole.SUPER_ADMIN,
        OrganizationType.MANUFACTURER: OrganizationRole.COMPANY_ADMIN,
        OrganizationType.DISTRIBUTOR: OrganizationRole.COMPANY_ADMIN,
        OrganizationType.PHARMACY: OrganizationRole.PHARMACY_OWNER,
        OrganizationType.LOGISTICS_HUB: OrganizationRole.HUB_MANAGER,
    }

    return role_map[organization_type]


def create_organization(
    db: Session,
    organization_data: OrganizationCreate,
    creator: User,
) -> Organization:

    if organization_data.organization_type == OrganizationType.PLATFORM:
        raise ValueError(
            "Platform organization cannot be created through this endpoint."
        )

    try:
        organization = Organization(
            name=organization_data.name,
            organization_type=organization_data.organization_type,
            phone=organization_data.phone,
            email=organization_data.email,
            address=organization_data.address,
        )

        db.add(organization)

        # Get generated organization ID without committing yet.
        db.flush()

        creator_role = get_default_creator_role(
            organization_data.organization_type
        )

        membership = OrganizationUser(
            organization_id=organization.id,
            user_id=creator.id,
            role=creator_role,
        )

        db.add(membership)

        db.commit()
        db.refresh(organization)

        return organization

    except Exception:
        db.rollback()
        raise

def get_user_organizations(
    db: Session,
    user_id: int,
) -> list[dict]:

    statement = (
        select(
            Organization,
            OrganizationUser.role,
            OrganizationUser.is_active,
        )
        .join(
            OrganizationUser,
            OrganizationUser.organization_id == Organization.id,
        )
        .where(
            OrganizationUser.user_id == user_id
        )
    )

    rows = db.execute(statement).all()

    results = []

    for organization, role, membership_is_active in rows:
        results.append(
            {
                "organization_id": organization.id,
                "name": organization.name,
                "organization_type": organization.organization_type,
                "role": role,
                "organization_is_active": organization.is_active,
                "membership_is_active": membership_is_active,
            }
        )

    return results

def get_organization_membership(
    db: Session,
    organization_id: int,
    user_id: int,
) -> OrganizationUser | None:

    statement = select(OrganizationUser).where(
        OrganizationUser.organization_id == organization_id,
        OrganizationUser.user_id == user_id,
        OrganizationUser.is_active.is_(True),
    )

    return db.scalar(statement)