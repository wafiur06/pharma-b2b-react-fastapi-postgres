from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class DepotCreate(BaseModel):

    organization_id: int

    name: str = Field(
        min_length=2,
        max_length=150,
    )

    address: str | None = Field(
        default=None,
        max_length=255,
    )

    district: str | None = Field(
        default=None,
        max_length=100,
    )

    phone: str | None = Field(
        default=None,
        max_length=20,
    )

    latitude: float | None = None

    longitude: float | None = None


class DepotResponse(BaseModel):

    id: int

    organization_id: int

    name: str

    address: str | None

    district: str | None

    phone: str | None

    latitude: float | None

    longitude: float | None

    is_active: bool

    created_at: datetime

    updated_at: datetime


    model_config = ConfigDict(
        from_attributes=True
    )