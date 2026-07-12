from fastapi import APIRouter, Depends, Query
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.dependencies import get_current_user, require_role
from app.db.database import get_session
from app.models.maintenance import MaintenanceStatus
from app.schemas.maintenance_fuel import MaintenanceClose, MaintenanceCreate, MaintenanceRead
from app.services import maintenance_service

router = APIRouter()


@router.post("/", response_model=MaintenanceRead)
async def create_maintenance(
    payload: MaintenanceCreate,
    session: AsyncSession = Depends(get_session),
    user=Depends(require_role(["fleet_manager", "admin"])),
):
    return await maintenance_service.create_maintenance(payload, user.id, session)


@router.get("/", response_model=list[MaintenanceRead])
async def list_maintenance(
    status: MaintenanceStatus | None = Query(default=None),
    session: AsyncSession = Depends(get_session),
    user=Depends(get_current_user),
):
    return await maintenance_service.list_maintenance(session, status)


@router.post("/{log_id}/close", response_model=MaintenanceRead)
async def close_maintenance(
    log_id: int,
    payload: MaintenanceClose,
    session: AsyncSession = Depends(get_session),
    user=Depends(require_role(["fleet_manager", "admin"])),
):
    return await maintenance_service.close_maintenance(log_id, payload, session)
