from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.companies.model import CompanyProfile
from app.modules.companies.schema import CompanyCreate
from app.modules.organizations.model import Organization


def get_company_by_organization(
    db: Session,
    organization_id: int,
) -> CompanyProfile | None:

    statement = select(CompanyProfile).where(
        CompanyProfile.organization_id == organization_id
    )

    return db.scalar(statement)


def get_organization_by_id(
    db: Session,
    organization_id: int,
) -> Organization | None:

    statement = select(Organization).where(
        Organization.id == organization_id
    )

    return db.scalar(statement)


def create_company_profile(
    db: Session,
    company_data: CompanyCreate,
) -> CompanyProfile:


    organization = get_organization_by_id(
        db=db,
        organization_id=company_data.organization_id,
    )


    if organization is None:
        raise ValueError(
            "Organization not found."
        )


    existing_company = get_company_by_organization(
        db=db,
        organization_id=company_data.organization_id,
    )


    if existing_company:
        raise ValueError(
            "Company profile already exists for this organization."
        )


    company = CompanyProfile(
        organization_id=company_data.organization_id,
        license_number=company_data.license_number,
        registration_number=company_data.registration_number,
        contact_person=company_data.contact_person,
        website=company_data.website,
        description=company_data.description,
    )


    db.add(company)
    db.commit()
    db.refresh(company)


    return company