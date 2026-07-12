from fastapi import APIRouter, Depends, Query
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.database import get_session
from app.core.dependencies import get_current_user, require_role
from app.models.vehicle import VehicleStatus
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleRead
from app.services import vehicle_service

router = APIRouter()


@router.post("/", response_model=VehicleRead)
async def create_vehicle(
    payload: VehicleCreate,
    session: AsyncSession = Depends(get_session),
    user=Depends(require_role(["fleet_manager", "admin"])),
):
    return await vehicle_service.create_vehicle(payload, session)


@router.get("/", response_model=list[VehicleRead])
async def list_vehicles(
    status: VehicleStatus | None = Query(default=None),
    type: str | None = Query(default=None),
    region: str | None = Query(default=None),
    session: AsyncSession = Depends(get_session),
    user=Depends(get_current_user),   # any authenticated role can view
):
    return await vehicle_service.list_vehicles(session, status, type, region)


@router.get("/available", response_model=list[VehicleRead])
async def get_dispatchable_vehicles(
    session: AsyncSession = Depends(get_session),
    user=Depends(get_current_user),
):
    """Used by the Dispatcher's trip-creation dropdown."""
    return await vehicle_service.get_dispatchable_vehicles(session)


@router.get("/{vehicle_id}", response_model=VehicleRead)
async def get_vehicle(
    vehicle_id: int,
    session: AsyncSession = Depends(get_session),
    user=Depends(get_current_user),
):
    return await vehicle_service.get_vehicle(vehicle_id, session)


@router.patch("/{vehicle_id}", response_model=VehicleRead)
async def update_vehicle(
    vehicle_id: int,
    payload: VehicleUpdate,
    session: AsyncSession = Depends(get_session),
    user=Depends(require_role(["fleet_manager", "admin"])),
):
    return await vehicle_service.update_vehicle(vehicle_id, payload, session)


@router.post("/{vehicle_id}/retire", response_model=VehicleRead)
async def retire_vehicle(
    vehicle_id: int,
    session: AsyncSession = Depends(get_session),
    user=Depends(require_role(["fleet_manager", "admin"])),
):
    return await vehicle_service.retire_vehicle(vehicle_id, session)