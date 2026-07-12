from datetime import datetime

from fastapi import HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.driver import DriverStatus
from app.models.trip import Trip, TripStatus
from app.models.vehicle import VehicleStatus
from app.schemas.trip import TripComplete, TripCreate
from app.services import driver_service, vehicle_service


async def create_trip(payload: TripCreate, created_by: int, session: AsyncSession) -> Trip:
    vehicle = await vehicle_service.get_vehicle(payload.vehicle_id, session)
    driver = await driver_service.get_driver(payload.driver_id, session)

    if vehicle.status in (VehicleStatus.retired, VehicleStatus.in_shop):
        raise HTTPException(status_code=400, detail="Vehicle cannot be selected for dispatch")
    if payload.cargo_weight > vehicle.max_load_capacity:
        raise HTTPException(status_code=400, detail="Cargo exceeds vehicle capacity")
    driver_service.ensure_driver_dispatchable(driver)

    trip = Trip(**payload.model_dump(), created_by=created_by)
    session.add(trip)
    await session.commit()
    await session.refresh(trip)
    return trip


async def list_trips(session: AsyncSession, status: TripStatus | None = None) -> list[Trip]:
    query = select(Trip)
    if status:
        query = query.where(Trip.status == status)
    result = await session.exec(query)
    return result.all()


async def get_trip(trip_id: int, session: AsyncSession) -> Trip:
    trip = await session.get(Trip, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


async def dispatch_trip(trip_id: int, session: AsyncSession) -> Trip:
    trip = await get_trip(trip_id, session)
    if trip.status != TripStatus.draft:
        raise HTTPException(status_code=400, detail="Only draft trips can be dispatched")

    vehicle = await vehicle_service.get_vehicle(trip.vehicle_id, session)
    driver = await driver_service.get_driver(trip.driver_id, session)

    if vehicle.status != VehicleStatus.available:
        raise HTTPException(status_code=400, detail="Vehicle not available")
    if trip.cargo_weight > vehicle.max_load_capacity:
        raise HTTPException(status_code=400, detail="Cargo exceeds vehicle capacity")
    driver_service.ensure_driver_dispatchable(driver)
    if driver.status != DriverStatus.available:
        raise HTTPException(status_code=400, detail="Driver not available")

    trip.status = TripStatus.dispatched
    trip.dispatched_at = datetime.utcnow()
    session.add(trip)
    await session.commit()
    await vehicle_service.set_vehicle_status(trip.vehicle_id, VehicleStatus.on_trip, session)
    await driver_service.set_driver_status(trip.driver_id, DriverStatus.on_trip, session)
    await session.refresh(trip)
    return trip


async def complete_trip(trip_id: int, payload: TripComplete, session: AsyncSession) -> Trip:
    trip = await get_trip(trip_id, session)
    if trip.status != TripStatus.dispatched:
        raise HTTPException(status_code=400, detail="Only dispatched trips can be completed")

    trip.actual_distance = payload.actual_distance
    trip.final_odometer = payload.final_odometer
    trip.status = TripStatus.completed
    trip.completed_at = datetime.utcnow()
    session.add(trip)
    await session.commit()

    await vehicle_service.update_odometer(trip.vehicle_id, payload.final_odometer, session)
    await vehicle_service.set_vehicle_status(trip.vehicle_id, VehicleStatus.available, session)
    await driver_service.set_driver_status(trip.driver_id, DriverStatus.available, session)
    await session.refresh(trip)
    return trip


async def cancel_trip(trip_id: int, session: AsyncSession) -> Trip:
    trip = await get_trip(trip_id, session)
    if trip.status not in (TripStatus.draft, TripStatus.dispatched):
        raise HTTPException(status_code=400, detail="Trip cannot be cancelled from current state")

    was_dispatched = trip.status == TripStatus.dispatched
    trip.status = TripStatus.cancelled
    trip.cancelled_at = datetime.utcnow()
    session.add(trip)
    await session.commit()

    if was_dispatched:
        await vehicle_service.set_vehicle_status(trip.vehicle_id, VehicleStatus.available, session)
        await driver_service.set_driver_status(trip.driver_id, DriverStatus.available, session)

    await session.refresh(trip)
    return trip
