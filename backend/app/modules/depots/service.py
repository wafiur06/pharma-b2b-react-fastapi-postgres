from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.depots.model import Depot
from app.modules.depots.schema import DepotCreate
from app.modules.organizations.model import Organization


def get_organization_by_id(
    db: Session,
    organization_id: int,
) -> Organization | None:

    statement = select(Organization).where(
        Organization.id == organization_id
    )

    return db.scalar(statement)


def get_depot_by_name(
    db: Session,
    organization_id: int,
    name: str,
) -> Depot | None:

    statement = select(Depot).where(
        Depot.organization_id == organization_id,
        Depot.name == name,
    )

    return db.scalar(statement)


def create_depot(
    db: Session,
    depot_data: DepotCreate,
) -> Depot:

    organization = get_organization_by_id(
        db=db,
        organization_id=depot_data.organization_id,
    )

    if organization is None:
        raise ValueError(
            "Organization not found."
        )


    existing_depot = get_depot_by_name(
        db=db,
        organization_id=depot_data.organization_id,
        name=depot_data.name,
    )

    if existing_depot:
        raise ValueError(
            "Depot already exists for this organization."
        )


    depot = Depot(
        organization_id=depot_data.organization_id,
        name=depot_data.name,
        address=depot_data.address,
        district=depot_data.district,
        phone=depot_data.phone,
        latitude=depot_data.latitude,
        longitude=depot_data.longitude,
    )


    db.add(depot)
    db.commit()
    db.refresh(depot)

    return depot