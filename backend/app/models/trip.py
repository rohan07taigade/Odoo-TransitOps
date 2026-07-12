from datetime import datetime
from enum import Enum

from sqlmodel import Field, SQLModel


class TripStatus(str, Enum):
    draft = "draft"
    dispatched = "dispatched"
    completed = "completed"
    cancelled = "cancelled"


class Trip(SQLModel, table=True):
    __tablename__ = "trips"

    id: int | None = Field(default=None, primary_key=True)
    source: str = Field(max_length=150)
    destination: str = Field(max_length=150)
    vehicle_id: int = Field(foreign_key="vehicles.id", index=True)
    driver_id: int = Field(foreign_key="drivers.id", index=True)
    cargo_weight: float = Field(ge=0.0)
    planned_distance: float = Field(ge=0.0)
    actual_distance: float | None = Field(default=None, ge=0.0)
    final_odometer: float | None = Field(default=None, ge=0.0)
    status: TripStatus = Field(default=TripStatus.draft, index=True)
    created_by: int = Field(foreign_key="users.id")
    dispatched_at: datetime | None = None
    completed_at: datetime | None = None
    cancelled_at: datetime | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
