from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
from app.db.base import Base

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True) # কোন অর্ডারের ইনভয়েস
    
    invoice_number = Column(String(50), unique=True, index=True, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(20), default="Unpaid") # Unpaid, Paid, Overdue
    
    due_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())