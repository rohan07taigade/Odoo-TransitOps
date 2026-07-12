from datetime import date

from fastapi import HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.maintenance import MaintenanceLog, MaintenanceStatus
from app.models.vehicle import VehicleStatus
from app.schemas.maintenance_fuel import MaintenanceCreate, MaintenanceClose
from app.services import vehicle_service


async def create_maintenance(payload: MaintenanceCreate, created_by: int, session: AsyncSession) -> MaintenanceLog:
    vehicle = await vehicle_service.get_vehicle(payload.vehicle_id, session)
    if vehicle.status == VehicleStatus.retired:
        raise HTTPException(status_code=400, detail="Cannot add maintenance for retired vehicle")

    log = MaintenanceLog(
        **payload.model_dump(exclude_none=True),
        start_date=payload.start_date or date.today(),
        created_by=created_by,
    )
    session.add(log)
    await session.commit()
    await vehicle_service.set_vehicle_status(payload.vehicle_id, VehicleStatus.in_shop, session)
    await session.refresh(log)
    return log


async def list_maintenance(session: AsyncSession, status: MaintenanceStatus | None = None) -> list[MaintenanceLog]:
    query = select(MaintenanceLog)
    if status:
        query = query.where(MaintenanceLog.status == status)
    result = await session.exec(query)
    return result.all()


async def close_maintenance(log_id: int, payload: MaintenanceClose, session: AsyncSession) -> MaintenanceLog:
    log = await session.get(MaintenanceLog, log_id)
    if not log:
        raise HTTPException(status_code=404, detail="Maintenance log not found")
    if log.status != MaintenanceStatus.active:
        raise HTTPException(status_code=400, detail="Maintenance already closed")

    log.status = MaintenanceStatus.closed
    log.end_date = payload.end_date or date.today()
    session.add(log)
    await session.commit()

    vehicle = await vehicle_service.get_vehicle(log.vehicle_id, session)
    if vehicle.status != VehicleStatus.retired:
        await vehicle_service.set_vehicle_status(log.vehicle_id, VehicleStatus.available, session)

    await session.refresh(log)
    return log
