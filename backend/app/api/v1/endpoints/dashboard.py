from sqlmodel import func, select
from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.dependencies import get_current_user
from app.db.database import get_session
from app.models.driver import Driver, DriverStatus
from app.models.maintenance import MaintenanceLog, MaintenanceStatus
from app.models.trip import Trip, TripStatus
from app.models.vehicle import Vehicle, VehicleStatus

router = APIRouter()


async def _count(session: AsyncSession, model, *conditions) -> int:
    query = select(func.count()).select_from(model)
    for condition in conditions:
        query = query.where(condition)
    result = await session.exec(query)
    return result.one()


@router.get("/")
async def get_dashboard(
    session: AsyncSession = Depends(get_session),
    user=Depends(get_current_user),
):
    total_vehicles = await _count(session, Vehicle)
    active_vehicles = await _count(session, Vehicle, Vehicle.status == VehicleStatus.on_trip)
    available_vehicles = await _count(session, Vehicle, Vehicle.status == VehicleStatus.available)
    vehicles_in_maintenance = await _count(session, Vehicle, Vehicle.status == VehicleStatus.in_shop)
    active_trips = await _count(session, Trip, Trip.status == TripStatus.dispatched)
    pending_trips = await _count(session, Trip, Trip.status == TripStatus.draft)
    drivers_on_duty = await _count(session, Driver, Driver.status == DriverStatus.on_trip)
    active_maintenance = await _count(
        session, MaintenanceLog, MaintenanceLog.status == MaintenanceStatus.active
    )

    fleet_utilization = 0.0
    if total_vehicles:
        fleet_utilization = round((active_vehicles / total_vehicles) * 100, 2)

    return {
        "active_vehicles": active_vehicles,
        "available_vehicles": available_vehicles,
        "vehicles_in_maintenance": vehicles_in_maintenance,
        "active_trips": active_trips,
        "pending_trips": pending_trips,
        "drivers_on_duty": drivers_on_duty,
        "active_maintenance": active_maintenance,
        "fleet_utilization": fleet_utilization,
    }
