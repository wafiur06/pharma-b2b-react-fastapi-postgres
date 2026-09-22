from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from app.modules.orders.model import OrderStatus, SupplierOrderStatus


# --- Master Order Schema ---
class OrderResponse(BaseModel):
    id: int
    order_number: str
    pharmacy_id: int
    user_id: int
    subtotal: Decimal
    total: Decimal
    status: OrderStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Supplier Order Schema ---
class SupplierOrderResponse(BaseModel):
    id: int
    order_id: int
    supplier_id: int
    supplier_order_number: str
    subtotal: Decimal
    total: Decimal
    status: SupplierOrderStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SupplierOrderStatusUpdate(BaseModel):
    status: SupplierOrderStatus