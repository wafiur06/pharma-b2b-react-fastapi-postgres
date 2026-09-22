from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    String,
    func,
)

from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Depot(Base):

    __tablename__ = "depots"


    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )


    organization_id: Mapped[int] = mapped_column(
        ForeignKey(
            "organizations.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )


    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )


    address: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )


    district: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )


    phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )


    latitude: Mapped[float | None] = mapped_column(
        nullable=True,
    )


    longitude: Mapped[float | None] = mapped_column(
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