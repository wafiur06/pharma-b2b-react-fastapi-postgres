from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field


class InventoryLotCreate(BaseModel):
    depot_id: int
    product_id: int
    batch_number: str = Field(min_length=1, max_length=100)
    mfg_date: date | None = None
    expiry_date: date
    available_quantity: int = Field(ge=0, default=0)


class InventoryLotResponse(BaseModel):
    id: int
    depot_id: int
    product_id: int
    batch_number: str
    mfg_date: date | None
    expiry_date: date
    available_quantity: int
    reserved_quantity: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)