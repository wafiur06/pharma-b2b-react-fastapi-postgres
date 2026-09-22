from pydantic import BaseModel, Field

# Schema for Login Request
class LoginRequest(BaseModel):
    phone: str = Field(
        min_length=10,
        max_length=20,
    )

    password: str = Field(
        min_length=8,
        max_length=128,
    )

# Schema for Token Response
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"