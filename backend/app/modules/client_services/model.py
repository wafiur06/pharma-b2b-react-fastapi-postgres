from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, func
from app.db.base import Base

class ReturnRequest(Base):
    __tablename__ = "return_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_id = Column(Integer, nullable=True)
    product_name = Column(String(150), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String(50), default="Pending") # Pending, Approved, Rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Offer(Base):
    __tablename__ = "offers"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    discount_percentage = Column(Float, nullable=False)
    valid_until = Column(DateTime(timezone=True), nullable=True)

class SupportTicket(Base):
    __tablename__ = "support_tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="Open") # Open, Resolved
    created_at = Column(DateTime(timezone=True), server_default=func.now())