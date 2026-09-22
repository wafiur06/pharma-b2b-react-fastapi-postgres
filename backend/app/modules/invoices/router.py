from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.users.model import User
from app.modules.invoices.model import Invoice

router = APIRouter(
    prefix="/invoices",
    tags=["Invoices"]
)

@router.get("/")
def get_my_invoices(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    try:
        # শুধুমাত্র লগইন করা ইউজারের ইনভয়েসগুলো আনা হচ্ছে
        invoices = db.query(Invoice).filter(Invoice.user_id == current_user.id).all()
        return invoices
    except Exception as e:
        print("Error fetching invoices:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch invoices")