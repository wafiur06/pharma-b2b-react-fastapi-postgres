import uuid
from decimal import Decimal
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.orders.model import (
    Order, OrderItem, OrderStatus,
    SupplierOrder, SupplierOrderItem, SupplierOrderStatus
)
from app.modules.cart.model import Cart, CartItem
from app.modules.catalog.supplier_product_model import SupplierProduct
from app.modules.inventory.model import InventoryLot

def generate_order_number(prefix: str) -> str:
    # MVP এর জন্য একটি সিম্পল ইউনিক নম্বর জেনারেট করা
    short_uuid = str(uuid.uuid4())[:8].upper()
    return f"{prefix}-{short_uuid}"

def checkout_cart(db: Session, pharmacy_id: int, user_id: int) -> Order:
    # ১. ইউজারের অ্যাক্টিভ কার্ট বের করা
    cart = db.scalar(select(Cart).where(
        Cart.pharmacy_id == pharmacy_id,
        Cart.user_id == user_id,
        Cart.is_active == True
    ))

    if not cart:
        raise ValueError("No active cart found for this pharmacy.")

    # ২. কার্টের আইটেমগুলো নিয়ে আসা
    cart_items = db.scalars(select(CartItem).where(CartItem.cart_id == cart.id)).all()
    if not cart_items:
        raise ValueError("Cart is empty.")

    # ৩. Master Order তৈরি করা
    master_order = Order(
        order_number=generate_order_number("ORD"),
        pharmacy_id=pharmacy_id,
        user_id=user_id,
        status=OrderStatus.PENDING,
        subtotal=Decimal("0.00"),
        total=Decimal("0.00")
    )
    db.add(master_order)
    db.flush() # ডাটাবেজ থেকে master_order.id পাওয়ার জন্য

    master_total = Decimal("0.00")
    
    # Supplier অনুযায়ী আইটেম গ্রুপ করার জন্য ডিকশনারি
    supplier_groups = {} 

    # ৪. আইটেম প্রসেস এবং Supplier অনুযায়ী Split করা (Order Split Engine)
    for item in cart_items:
        # Supplier Product টেবিল থেকে দাম বের করা
        sp = db.scalar(select(SupplierProduct).where(
            SupplierProduct.product_id == item.product_id,
            SupplierProduct.supplier_id == item.supplier_id
        ))
        
        # যদি প্রাইস না পাওয়া যায়, তবে ডিফল্ট 0.00 ধরবে (Error এড়ানোর জন্য)
        unit_price = sp.trade_price if sp else Decimal("0.00") 
        total_price = unit_price * Decimal(item.quantity)
        master_total += total_price

        # Master Order-এর আইটেম হিসেবে যুক্ত করা
        order_item = OrderItem(
            order_id=master_order.id,
            product_id=item.product_id,
            supplier_id=item.supplier_id,
            quantity=item.quantity,
            unit_price=unit_price,
            total_price=total_price
        )
        db.add(order_item)

        # Supplier Grouping (সাব-অর্ডার তৈরির জন্য)
        if item.supplier_id not in supplier_groups:
            supplier_groups[item.supplier_id] = {"items": [], "subtotal": Decimal("0.00")}
        
        supplier_groups[item.supplier_id]["items"].append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "unit_price": unit_price,
            "total_price": total_price
        })
        supplier_groups[item.supplier_id]["subtotal"] += total_price

    master_order.subtotal = master_total
    master_order.total = master_total

    # ৫. প্রতিটি কোম্পানির জন্য আলাদা আলাদা Supplier Order (Sub-order) তৈরি করা
    for supplier_id, group_data in supplier_groups.items():
        supplier_order = SupplierOrder(
            order_id=master_order.id,
            supplier_id=supplier_id,
            supplier_order_number=generate_order_number(f"SO-{supplier_id}"),
            subtotal=group_data["subtotal"],
            total=group_data["subtotal"],
            status=SupplierOrderStatus.PENDING
        )
        db.add(supplier_order)
        db.flush() # supplier_order.id পাওয়ার জন্য

        for s_item in group_data["items"]:
            supplier_order_item = SupplierOrderItem(
                supplier_order_id=supplier_order.id,
                product_id=s_item["product_id"],
                requested_quantity=s_item["quantity"],
                confirmed_quantity=0, # কোম্পানি কনফার্ম না করা পর্যন্ত 0 থাকবে
                unit_price=s_item["unit_price"],
                total_price=s_item["total_price"]
            )
            db.add(supplier_order_item)

    # ৬. কার্টটিকে নিষ্ক্রিয় (Deactivate) করে দেওয়া
    cart.is_active = False

    db.commit()
    db.refresh(master_order)
    return master_order
def get_supplier_orders(db: Session, supplier_id: int):
    # নির্দিষ্ট সাপ্লায়ারের সবগুলো সাব-অর্ডার নতুন থেকে পুরনো ক্রমানুসারে নিয়ে আসবে
    statement = select(SupplierOrder).where(
        SupplierOrder.supplier_id == supplier_id
    ).order_by(SupplierOrder.created_at.desc())
    
    return db.scalars(statement).all()

def get_pharmacy_orders(db: Session, pharmacy_id: int):
    # নির্দিষ্ট ফার্মেসির মাস্টার অর্ডারগুলো নতুন থেকে পুরনো ক্রমানুসারে নিয়ে আসবে
    statement = select(Order).where(
        Order.pharmacy_id == pharmacy_id
    ).order_by(Order.created_at.desc())
    
    return db.scalars(statement).all()

def update_supplier_order_status(
    db: Session, 
    supplier_order_id: int, 
    new_status: SupplierOrderStatus
) -> SupplierOrder:
    
    supplier_order = db.get(SupplierOrder, supplier_order_id)
    if not supplier_order:
        raise ValueError("Supplier order not found.")
    
    # === Inventory Deduction Logic (স্টক মাইনাস করা) ===
    # যদি নতুন স্ট্যাটাস DELIVERED হয় এবং আগের স্ট্যাটাস DELIVERED না থাকে
    if new_status == SupplierOrderStatus.DELIVERED and supplier_order.status != SupplierOrderStatus.DELIVERED:
        
        # এই অর্ডারের ভেতরের সব আইটেম (প্রোডাক্ট) বের করে আনা
        items = db.scalars(
            select(SupplierOrderItem).where(SupplierOrderItem.supplier_order_id == supplier_order_id)
        ).all()
        
        for item in items:
            # ইনভেন্টরি থেকে এমন একটি লট খোঁজা যেখানে পর্যাপ্ত স্টক আছে
            statement = select(InventoryLot).where(
                InventoryLot.product_id == item.product_id,
                InventoryLot.available_quantity >= item.requested_quantity
            )
            lot = db.scalar(statement)
            
            if not lot:
                raise ValueError(f"Not enough stock for Product ID {item.product_id}. Cannot deliver.")
            
            # স্টক মাইনাস করা হচ্ছে
            lot.available_quantity -= item.requested_quantity
            db.add(lot) # আপডেট হওয়া লটটি ডাটাবেজে সেভ করার জন্য প্রস্তুত করা

    # স্ট্যাটাস আপডেট করা
    supplier_order.status = new_status
    
    # ডাটাবেজে সেভ করা
    db.commit()
    db.refresh(supplier_order)
    
    return supplier_order