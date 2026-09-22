from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.modules.users.model import User
from app.modules.users.schema import UserCreate


def get_user_by_phone(
    db: Session,
    phone: str,
) -> User | None:
    statement = select(User).where(
        User.phone == phone
    )

    return db.scalar(statement)


def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:
    statement = select(User).where(
        User.email == email
    )

    return db.scalar(statement)


def create_user(
    db: Session,
    user_data: UserCreate,
) -> User:

    existing_phone = get_user_by_phone(
        db=db,
        phone=user_data.phone,
    )

    if existing_phone:
        raise ValueError(
            "A user with this phone number already exists."
        )

    if user_data.email:
        existing_email = get_user_by_email(
            db=db,
            email=user_data.email,
        )

        if existing_email:
            raise ValueError(
                "A user with this email already exists."
            )

    user = User(
        full_name=user_data.full_name,
        phone=user_data.phone,
        email=user_data.email,
        password_hash=hash_password(
            user_data.password
        ),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def get_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:
    statement = select(User).where(
        User.id == user_id
    )

    return db.scalar(statement)