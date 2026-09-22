from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.users.model import User
from typing import List
from app.modules.catalog.product_model import Product

from app.modules.catalog.schema import (
    GenericCreate,
    GenericResponse,
    ProductCreate,
    ProductResponse,
    SupplierProductCreate,
    SupplierProductResponse,
)
from app.modules.catalog.service import (
    create_generic,
    create_product,
    create_supplier_product,
)

router = APIRouter(
    prefix="/catalog",
    tags=["Catalog"],
)


# --- 1. Generic Endpoints ---
@router.post(
    "/generics",
    response_model=GenericResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_generic(
    generic_data: GenericCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_generic(db=db, generic_data=generic_data)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


# --- 2. Product Endpoints ---
@router.post(
    "/products",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        product = create_product(
            db=db,
            product_data=product_data,
        )
        return product
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


# --- 3. Supplier Product Endpoints ---
@router.post(
    "/supplier-products",
    response_model=SupplierProductResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_supplier_product(
    data: SupplierProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_supplier_product(db=db, data=data)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )



# --- Product List Endpoint (GET) ---
@router.get(
    "/products",
    response_model=List[ProductResponse],
)
def get_all_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ডেটাবেস থেকে সব প্রোডাক্ট ফেচ করা হচ্ছে
    products = db.query(Product).all() 
    return products