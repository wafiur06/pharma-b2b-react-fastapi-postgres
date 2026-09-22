from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.modules.organizations.enums import OrganizationType
from app.modules.organizations.enums import OrganizationRole

class OrganizationCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=200,
    )

    organization_type: OrganizationType

    phone: str | None = Field(
        default=None,
        max_length=20,
    )

    email: str | None = Field(
        default=None,
        max_length=255,
    )

    address: str | None = None


class OrganizationResponse(BaseModel):
    id: int
    name: str
    organization_type: OrganizationType
    phone: str | None
    email: str | None
    address: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )




class MyOrganizationResponse(BaseModel):
    organization_id: int
    name: str
    organization_type: OrganizationType
    role: OrganizationRole
    organization_is_active: bool
    membership_is_active: bool