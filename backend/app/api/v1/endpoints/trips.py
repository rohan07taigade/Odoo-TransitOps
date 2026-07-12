from fastapi import APIRouter, Depends, Query
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.dependencies import get_current_user, require_role
from app.db.database import get_session
from app.models.trip import TripStatus
from app.schemas.trip import TripComplete, TripCreate, TripRead
from app.services import trip_service

router = APIRouter()


@router.post("/", response_model=TripRead)
async def create_trip(
    payload: TripCreate,
    session: AsyncSession = Depends(get_session),
    user=Depends(require_role(["dispatcher", "admin"])),
):
    return await trip_service.create_trip(payload, user.id, session)


@router.get("/", response_model=list[TripRead])
async def list_trips(
    status: TripStatus | None = Query(default=None),
    session: AsyncSession = Depends(get_session),
    user=Depends(get_current_user),
):
    return await trip_service.list_trips(session, status)


@router.post("/{trip_id}/dispatch", response_model=TripRead)
async def dispatch_trip(
    trip_id: int,
    session: AsyncSession = Depends(get_session),
    user=Depends(require_role(["dispatcher", "admin"])),
):
    return await trip_service.dispatch_trip(trip_id, session)


@router.post("/{trip_id}/complete", response_model=TripRead)
async def complete_trip(
    trip_id: int,
    payload: TripComplete,
    session: AsyncSession = Depends(get_session),
    user=Depends(require_role(["dispatcher", "admin"])),
):
    return await trip_service.complete_trip(trip_id, payload, session)


@router.post("/{trip_id}/cancel", response_model=TripRead)
async def cancel_trip(
    trip_id: int,
    session: AsyncSession = Depends(get_session),
    user=Depends(require_role(["dispatcher", "admin"])),
):
    return await trip_service.cancel_trip(trip_id, session)
