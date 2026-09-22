from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.inventory.model import InventoryLot
from app.modules.inventory.schema import InventoryLotCreate
from app.modules.catalog.product_model import Product
from app.modules.depots.model import Depot


def get_lot_by_batch(
    db: Session,
    depot_id: int,
    product_id: int,
    batch_number: str,
) -> InventoryLot | None:
    statement = select(InventoryLot).where(
        InventoryLot.depot_id == depot_id,
        InventoryLot.product_id == product_id,
        InventoryLot.batch_number == batch_number,
    )
    return db.scalar(statement)


def create_inventory_lot(
    db: Session,
    data: InventoryLotCreate,
) -> InventoryLot:
    # 1. Depot Check
    depot = db.get(Depot, data.depot_id)
    if not depot:
        raise ValueError("Depot not found.")

    # 2. Product Check
    product = db.get(Product, data.product_id)
    if not product:
        raise ValueError("Product not found.")

    # 3. Duplicate Batch Check
    existing = get_lot_by_batch(
        db=db,
        depot_id=data.depot_id,
        product_id=data.product_id,
        batch_number=data.batch_number,
    )
    if existing:
        raise ValueError("This batch already exists for this product in the given depot.")

    # 4. Save
    lot = InventoryLot(
        depot_id=data.depot_id,
        product_id=data.product_id,
        batch_number=data.batch_number,
        mfg_date=data.mfg_date,
        expiry_date=data.expiry_date,
        available_quantity=data.available_quantity,
        reserved_quantity=0,
    )

    db.add(lot)
    db.commit()
    db.refresh(lot)
    return lot