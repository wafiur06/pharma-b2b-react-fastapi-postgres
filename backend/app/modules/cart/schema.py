from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class CartItemCreate(BaseModel):
    product_id: int
    supplier_id: int
    quantity: int = Field(ge=1, default=1)

class CartItemResponse(BaseModel):
    id: int
    cart_id: int
    product_id: int
    supplier_id: int
    quantity: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CartResponse(BaseModel):
    id: int
    pharmacy_id: int
    user_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)