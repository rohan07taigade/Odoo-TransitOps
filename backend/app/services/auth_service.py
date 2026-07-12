from datetime import timedelta

from fastapi import HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.models.user import User


async def authenticate_user(email: str, password: str, session: AsyncSession) -> User:
    result = await session.exec(select(User).where(User.email == email))
    user = result.first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is deactivated")
    return user


def build_access_token(user: User) -> str:
    return create_access_token(
        subject=user.id,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
