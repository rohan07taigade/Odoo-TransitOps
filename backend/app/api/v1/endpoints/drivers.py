from fastapi import APIRouter, Depends, Query
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.dependencies import get_current_user, require_role
from app.db.database import get_session
from app.models.driver import DriverStatus
from app.schemas.driver import DriverCreate, DriverRead, DriverUpdate
from app.services import driver_service

router = APIRouter()


@router.post("/", response_model=DriverRead)
async def create_driver(
    payload: DriverCreate,
    session: AsyncSession = Depends(get_session),
    user=Depends(require_role(["safety_officer", "admin"])),
):
    return await driver_service.create_driver(payload, session)


@router.get("/", response_model=list[DriverRead])
async def list_drivers(
    status: DriverStatus | None = Query(default=None),
    session: AsyncSession = Depends(get_session),
    user=Depends(get_current_user),
):
    return await driver_service.list_drivers(session, status)


@router.get("/{driver_id}", response_model=DriverRead)
async def get_driver(
    driver_id: int,
    session: AsyncSession = Depends(get_session),
    user=Depends(get_current_user),
):
    return await driver_service.get_driver(driver_id, session)


@router.patch("/{driver_id}", response_model=DriverRead)
async def update_driver(
    driver_id: int,
    payload: DriverUpdate,
    session: AsyncSession = Depends(get_session),
    user=Depends(require_role(["safety_officer", "admin"])),
):
    return await driver_service.update_driver(driver_id, payload, session)
