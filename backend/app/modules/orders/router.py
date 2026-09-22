from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Database এবং Auth ডিপেন্ডেন্সি ইমপোর্ট
from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.users.model import User

# আপনার Order মডেল ইমপোর্ট (যদি ফাইলের নাম ভিন্ন থাকে, তবে একটু মিলিয়ে নেবেন)
from app.modules.orders.model import Order

# যদি আপনার আলাদা schema.py ফাইল থাকে, তবে নিচের লাইন থেকে # সরিয়ে ইমপোর্ট করে নেবেন
# from app.modules.orders.schema import OrderCreate 

router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)

# 1. Get All Orders (Filtered by Current User)
@router.get("/")
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # লগইন করা ইউজারকে চেক করা হচ্ছে
):
    try:
        # ডাটাবেস থেকে শুধুমাত্র লগইন করা ইউজারের (current_user.id) অর্ডারগুলো ফিল্টার করে আনা হচ্ছে
        user_orders = db.query(Order).filter(Order.user_id == current_user.id).all()
        return user_orders
    except Exception as e:
        print("Error fetching orders:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch orders.")


# 2. Delete Order (শুধুমাত্র নিজের অর্ডার ডিলিট করা যাবে)
@router.delete("/{order_id}")
def delete_my_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # অর্ডারটি খোঁজা হচ্ছে এবং চেক করা হচ্ছে যে এটি এই ইউজারের কি না
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Order not found or you don't have permission to delete this order."
        )
        
    db.delete(order)
    db.commit()
    return {"message": "Order deleted successfully"}


# 3. Create Custom Order
# (বিঃদ্রঃ আপনার যদি আগে থেকে Create Order এর কোনো কোড বা সার্ভিস থেকে থাকে, তবে সেটি এখানে বসিয়ে দেবেন)
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_new_order(
    order_data: dict, # আপনার OrderCreate স্কিমা থাকলে dict এর বদলে সেটি দেবেন
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # এখানে আপনার অর্ডার সেভ করার লজিক বা সার্ভিস কল হবে। 
        # খেয়াল রাখবেন সেভ করার সময় যেন user_id=current_user.id দেওয়া হয়।
        
        # উদাহরণস্বরূপ:
        # new_order = Order(user_id=current_user.id, total_amount=..., status="pending")
        # db.add(new_order)
        # db.commit()
        
        return {"message": "Order placed successfully!"}
    except Exception as e:
        print("Error creating order:", e)
        raise HTTPException(status_code=500, detail="Failed to create order.")