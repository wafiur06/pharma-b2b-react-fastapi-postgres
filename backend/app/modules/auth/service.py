from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.modules.auth.schema import LoginRequest, TokenResponse
from app.modules.users.service import get_user_by_phone


def login_user(
    db: Session,
    login_data: LoginRequest,
) -> TokenResponse:

    user = get_user_by_phone(
        db=db,
        phone=login_data.phone,
    )

    if user is None:
        raise ValueError(
            "Invalid phone number or password."
        )

    if not user.is_active:
        raise PermissionError(
            "User account is inactive."
        )

    password_is_valid = verify_password(
        login_data.password,
        user.password_hash,
    )

    if not password_is_valid:
        raise ValueError(
            "Invalid phone number or password."
        )

    access_token = create_access_token(
        subject=str(user.id)
    )

    return TokenResponse(
        access_token=access_token,
    )