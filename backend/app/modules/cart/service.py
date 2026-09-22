from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.cart.model import Cart, CartItem
from app.modules.cart.schema import CartItemCreate
from app.modules.organizations.model import Organization
from app.modules.catalog.product_model import Product

def get_or_create_cart(db: Session, pharmacy_id: int, user_id: int) -> Cart:
    # আগে চেক করব ইউজারের কোনো অ্যাক্টিভ কার্ট আছে কিনা
    statement = select(Cart).where(
        Cart.pharmacy_id == pharmacy_id,
        Cart.user_id == user_id,
        Cart.is_active == True
    )
    cart = db.scalar(statement)
    
    # না থাকলে নতুন কার্ট তৈরি করব
    if not cart:
        cart = Cart(pharmacy_id=pharmacy_id, user_id=user_id, is_active=True)
        db.add(cart)
        db.commit()
        db.refresh(cart)
        
    return cart

def add_item_to_cart(
    db: Session, 
    pharmacy_id: int, 
    user_id: int, 
    item_data: CartItemCreate
) -> CartItem:
    
    # 1. Pharmacy Check
    pharmacy = db.get(Organization, pharmacy_id)
    if not pharmacy or pharmacy.organization_type.value != "PHARMACY":
        raise ValueError("Invalid pharmacy.")

    # 2. Supplier Check
    supplier = db.get(Organization, item_data.supplier_id)
    if not supplier or supplier.organization_type.value not in ["MANUFACTURER", "DISTRIBUTOR"]:
        raise ValueError("Invalid supplier.")

    # 3. Product Check
    product = db.get(Product, item_data.product_id)
    if not product:
        raise ValueError("Product not found.")

    # 4. Get or Create Cart
    cart = get_or_create_cart(db, pharmacy_id, user_id)

    # 5. Add or Update Item in Cart
    statement = select(CartItem).where(
        CartItem.cart_id == cart.id,
        CartItem.product_id == item_data.product_id,
        CartItem.supplier_id == item_data.supplier_id
    )
    cart_item = db.scalar(statement)

    if cart_item:
        # আগে থেকে থাকলে Quantity বাড়িয়ে দেব
        cart_item.quantity += item_data.quantity
    else:
        # নতুন হলে অ্যাড করব
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=item_data.product_id,
            supplier_id=item_data.supplier_id,
            quantity=item_data.quantity
        )
        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)
    return cart_item