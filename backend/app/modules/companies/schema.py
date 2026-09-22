from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CompanyCreate(BaseModel):

    organization_id: int

    license_number: str | None = Field(
        default=None,
        max_length=100,
    )

    registration_number: str | None = Field(
        default=None,
        max_length=100,
    )

    contact_person: str | None = Field(
        default=None,
        max_length=150,
    )

    website: str | None = Field(
        default=None,
        max_length=255,
    )

    description: str | None = None


class CompanyResponse(BaseModel):

    id: int

    organization_id: int

    license_number: str | None

    registration_number: str | None

    contact_person: str | None

    website: str | None

    description: str | None

    is_verified: bool

    created_at: datetime

    updated_at: datetime


    model_config = ConfigDict(
        from_attributes=True
    )