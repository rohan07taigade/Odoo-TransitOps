from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.dependencies import get_current_user
from app.db.database import get_session
from app.schemas.auth import Token, UserSummary
from app.services import auth_service

router = APIRouter()


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_session),
):
    user = await auth_service.authenticate_user(form_data.username, form_data.password, session)
    return Token(access_token=auth_service.build_access_token(user))


@router.get("/me", response_model=UserSummary)
async def me(user=Depends(get_current_user)):
    return UserSummary(id=user.id, email=user.email, full_name=user.full_name, role=user.role)
