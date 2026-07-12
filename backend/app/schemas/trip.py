from datetime import datetime

from pydantic import BaseModel

from app.models.trip import TripStatus


class TripCreate(BaseModel):
    source: str
    destination: str
    vehicle_id: int
    driver_id: int
    cargo_weight: float
    planned_distance: float


class TripComplete(BaseModel):
    actual_distance: float
    final_odometer: float


class TripRead(BaseModel):
    id: int
    source: str
    destination: str
    vehicle_id: int
    driver_id: int
    cargo_weight: float
    planned_distance: float
    actual_distance: float | None
    final_odometer: float | None
    status: TripStatus
    created_by: int
    dispatched_at: datetime | None
    completed_at: datetime | None
    cancelled_at: datetime | None
    created_at: datetime
