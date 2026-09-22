from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.users.model import User
from app.modules.client_services.model import ReturnRequest, Offer, SupportTicket
from app.modules.orders.model import Order

router = APIRouter(
    prefix="/services",
    tags=["Client Services"]
)

# 1. Returns API
@router.get("/returns")
def get_returns(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(ReturnRequest).filter(ReturnRequest.user_id == current_user.id).all()

@router.post("/returns")
def create_return(data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_return = ReturnRequest(
        user_id=current_user.id, 
        product_name=data.get("product_name", "N/A"), 
        reason=data.get("reason"), 
        order_id=data.get("order_id")
    )
    db.add(new_return)
    db.commit()
    return {"message": "Return request submitted."}

# 2. Offers API
@router.get("/offers")
def get_offers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Offer).all()

# 3. Support Tickets API
@router.get("/support/tickets")
def get_tickets(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(SupportTicket).filter(SupportTicket.user_id == current_user.id).all()

@router.post("/support/tickets")
def create_ticket(data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ticket = SupportTicket(user_id=current_user.id, subject=data.get("subject"), message=data.get("message"))
    db.add(ticket)
    db.commit()
    return {"message": "Support ticket created."}

# 4. Order Tracking API
@router.get("/tracking/{order_id}")
def track_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return {"order_id": order.id, "status": order.status, "amount": order.total_amount}