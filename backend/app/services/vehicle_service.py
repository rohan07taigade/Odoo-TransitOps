from datetime import datetime, timezone
from fastapi import HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.vehicle import Vehicle, VehicleStatus
from app.schemas.vehicle import VehicleCreate, VehicleUpdate

async def create_vehicle(payload: VehicleCreate, session: AsyncSession) -> Vehicle:
    # registration number must be unique
    existing = await session.exec(select(Vehicle).where(Vehicle.registration_number == payload.registration_number))

    if existing.first():
        raise HTTPException(status_code=400, detail="Vehicle with this registration number already exists")
    
    vehicle = Vehicle(**payload.model_dump()) # status defaults to available
    session.add(vehicle)
    await session.commit()
    await session.refresh(vehicle)
    return vehicle

async def get_vehicle(vehicle_id: int, session: AsyncSession) -> Vehicle:
    vehicle = await session.get(Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle

async def list_vehicles(
        session: AsyncSession, 
        status: VehicleStatus,
        type: str | None = None,
        region: str | None = None
        ) -> list[Vehicle]:
    query = select(Vehicle)
    
    if status:
        query = query.where(Vehicle.status == status)
    if type:
        query = query.where(Vehicle.type == type)
    if region:
        query = query.where(Vehicle.region == region)
    
    vehicles = await session.exec(query)
    return vehicles.all()

async def get_dispatchable_vehicles(session: AsyncSession)-> list[Vehicle]:
    """
    used by trip creation (dispatcher's dropdown)
    rule : retired or in_shop vehicles must not appear in dispatch selection
    """
    query = select(Vehicle).where(Vehicle.status == VehicleStatus.available)
    vehicles = await session.exec(query)
    return vehicles.all()

async def update_vehicle(vehicle_id: int, payload: VehicleUpdate, session: AsyncSession) -> Vehicle:
    vehicle = await get_vehicle(vehicle_id, session)
    # block manual status changes into/ out of states that should only happen via trip_service or maintenance_service
    if payload.status and payload.status in (VehicleStatus.on_trip, VehicleStatus.in_shop):
        raise HTTPException(status_code=400, detail=f"Cannot manually set vehicle status to {payload.status}")
    
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vehicle, field, value)
    vehicle.updated_at = datetime.now(timezone.utc)
    session.add(vehicle)
    await session.commit()
    await session.refresh(vehicle)
    return vehicle


async def retire_vehicle(vehicle_id: int, session: AsyncSession) -> Vehicle:
    vehicle = await get_vehicle(vehicle_id, session)
    if vehicle.status == VehicleStatus.on_trip:
        raise HTTPException(status_code=400, detail="Cannot retire a vehicle that is currently on a trip")
    vehicle.status = VehicleStatus.retired
    vehicle.updated_at = datetime.now(timezone.utc)
    session.add(vehicle)
    await session.commit()
    await session.refresh(vehicle)
    return vehicle

# internal helpers
async def set_vehicle_status(vehicle_id: int, new_status: VehicleStatus, session: AsyncSession) -> Vehicle:
    vehicle = await get_vehicle(vehicle_id, session)
    if vehicle.status == VehicleStatus.retired and new_status != VehicleStatus.retired:
        raise HTTPException(status_code=400, detail="Retired vehicles cannot be reactivated")
    vehicle.status = new_status
    vehicle.updated_at = datetime.now(timezone.utc)
    session.add(vehicle)
    await session.commit()
    await session.refresh(vehicle)
    return vehicle

async def update_odometer(vehicle_id: int, final_odometer: float, session: AsyncSession) -> Vehicle:
    vehicle = await get_vehicle(vehicle_id, session)
    if final_odometer < vehicle.odometer_reading:
        raise HTTPException(status_code=400, detail="Final odometer reading cannot be less than current reading")
    vehicle.odometer_reading = final_odometer
    vehicle.updated_at = datetime.now(timezone.utc)
    session.add(vehicle)
    await session.commit()
    await session.refresh(vehicle)
    return vehicle

