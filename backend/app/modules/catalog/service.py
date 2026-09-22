from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.catalog.generic_model import Generic
from app.modules.catalog.product_model import Product
from app.modules.catalog.schema import GenericCreate, ProductCreate
from app.modules.organizations.model import Organization
from app.modules.catalog.supplier_product_model import SupplierProduct
from app.modules.catalog.schema import GenericCreate, ProductCreate, SupplierProductCreate

# ==========================================
# Generic Services (আগের লজিক)
# ==========================================
def get_generic_by_name(
    db: Session,
    name: str,
) -> Generic | None:
    statement = select(Generic).where(Generic.name == name)
    return db.scalar(statement)


def create_generic(
    db: Session,
    generic_data: GenericCreate,
) -> Generic:
    existing = get_generic_by_name(
        db=db,
        name=generic_data.name,
    )

    if existing:
        raise ValueError("Generic medicine already exists.")

    generic = Generic(
        name=generic_data.name,
        description=generic_data.description,
    )

    db.add(generic)
    db.commit()
    db.refresh(generic)

    return generic


# ==========================================
# Product Services (নতুন লজিক)
# ==========================================
def get_product_by_name(
    db: Session,
    brand_name: str,
    manufacturer_id: int,
) -> Product | None:
    statement = select(Product).where(
        Product.brand_name == brand_name,
        Product.manufacturer_id == manufacturer_id,
    )
    return db.scalar(statement)


def get_manufacturer(
    db: Session,
    manufacturer_id: int,
) -> Organization | None:
    statement = select(Organization).where(Organization.id == manufacturer_id)
    return db.scalar(statement)


def create_product(
    db: Session,
    product_data: ProductCreate,
) -> Product:
    # 1. Generic চেক করা
    generic = db.get(Generic, product_data.generic_id)
    if generic is None:
        raise ValueError("Generic medicine not found.")

    # 2. Manufacturer চেক করা
    manufacturer = get_manufacturer(
        db=db,
        manufacturer_id=product_data.manufacturer_id,
    )
    if manufacturer is None:
        raise ValueError("Manufacturer organization not found.")

    if manufacturer.organization_type.value != "MANUFACTURER":
        raise ValueError("Organization is not a manufacturer.")

    # 3. Duplicate চেক করা
    existing = get_product_by_name(
        db=db,
        brand_name=product_data.brand_name,
        manufacturer_id=product_data.manufacturer_id,
    )
    if existing:
        raise ValueError("Product already exists.")

    # 4. প্রোডাক্ট ডাটাবেজে সংরক্ষণ করা
    product = Product(
        generic_id=product_data.generic_id,
        manufacturer_id=product_data.manufacturer_id,
        brand_name=product_data.brand_name,
        strength=product_data.strength,
        dosage_form=product_data.dosage_form,
        pack_size=product_data.pack_size,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product

def get_supplier_product_by_supplier_and_product(
    db: Session,
    supplier_id: int,
    product_id: int,
    depot_id: int | None = None,
) -> SupplierProduct | None:
    statement = select(SupplierProduct).where(
        SupplierProduct.supplier_id == supplier_id,
        SupplierProduct.product_id == product_id,
        SupplierProduct.depot_id == depot_id,
    )
    return db.scalar(statement)


def create_supplier_product(
    db: Session,
    data: SupplierProductCreate,
) -> SupplierProduct:
    # 1. Supplier / Organization Check
    supplier = db.get(Organization, data.supplier_id)
    if supplier is None:
        raise ValueError("Supplier organization not found.")

    if supplier.organization_type.value not in ["MANUFACTURER", "DISTRIBUTOR"]:
        raise ValueError("Organization must be a Manufacturer or Distributor.")

    # 2. Product Check
    product = db.get(Product, data.product_id)
    if product is None:
        raise ValueError("Product not found.")

    # 3. Duplicate Check
    existing = get_supplier_product_by_supplier_and_product(
        db=db,
        supplier_id=data.supplier_id,
        product_id=data.product_id,
        depot_id=data.depot_id,
    )
    if existing:
        raise ValueError("This product is already listed for this supplier/depot.")

    # 4. Save
    supplier_product = SupplierProduct(
        supplier_id=data.supplier_id,
        depot_id=data.depot_id,
        product_id=data.product_id,
        supplier_sku=data.supplier_sku,
        trade_price=data.trade_price,
        mrp=data.mrp,
        minimum_order_qty=data.minimum_order_qty,
        discount_percent=data.discount_percent,
    )

    db.add(supplier_product)
    db.commit()
    db.refresh(supplier_product)
    return supplier_product