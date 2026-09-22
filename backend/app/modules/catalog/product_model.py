from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    String,
    func,
    Column,
    Integer,
    Numeric,
)

from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    generic_id = Column(Integer, nullable=False)
    manufacturer_id = Column(Integer, nullable=False)
    brand_name = Column(String(150), nullable=False)
    strength = Column(String(100), nullable=True)
    dosage_form = Column(String(100), nullable=True)
    pack_size = Column(String(100), nullable=True)
    
    # --- এই দুটি নতুন কলাম যোগ করুন ---
    price = Column(Numeric(10, 2), default=0.00)
    stock = Column(Integer, default=0)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    __tablename__ = "products"


    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )


    generic_id: Mapped[int] = mapped_column(
        ForeignKey(
            "generics.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )


    manufacturer_id: Mapped[int] = mapped_column(
        ForeignKey(
            "organizations.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )


    brand_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )


    strength: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )


    dosage_form: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )


    pack_size: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )


    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )


    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )