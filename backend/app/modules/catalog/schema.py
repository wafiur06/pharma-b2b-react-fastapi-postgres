from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from decimal import Decimal

# --- Generic Schemas ---
class GenericCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=150,
    )
    description: str | None = None


class GenericResponse(BaseModel):
    id: int
    name: str
    description: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# --- Product Schemas ---
class ProductCreate(BaseModel):
    generic_id: int
    manufacturer_id: int
    brand_name: str = Field(
        min_length=2,
        max_length=150,
    )
    strength: str | None = None
    dosage_form: str | None = None
    pack_size: str | None = None
    price: Decimal = Field(default=Decimal("0.00"), ge=0)
    stock: int = Field(default=0, ge=0)


class ProductResponse(BaseModel):
    id: int
    generic_id: int
    manufacturer_id: int
    brand_name: str
    strength: str | None
    dosage_form: str | None
    pack_size: str | None
    price: Decimal
    stock: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# --- Supplier Product Schemas ---
class SupplierProductCreate(BaseModel):
    supplier_id: int
    depot_id: int | None = None
    product_id: int
    supplier_sku: str | None = None
    trade_price: Decimal = Field(gt=0, decimal_places=2)
    mrp: Decimal = Field(gt=0, decimal_places=2)
    minimum_order_qty: int = Field(default=1, ge=1)
    discount_percent: Decimal = Field(default=Decimal("0.00"), ge=0, le=100)


class SupplierProductResponse(BaseModel):
    id: int
    supplier_id: int
    depot_id: int | None
    product_id: int
    supplier_sku: str | None
    trade_price: Decimal
    mrp: Decimal
    minimum_order_qty: int
    discount_percent: Decimal
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)