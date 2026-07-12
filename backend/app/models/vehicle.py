from datetime import datetime, timezone
from enum import Enum
from sqlmodel import SQLModel, Field

class VehicleType(str, Enum):
    truck = "truck"
    van = "van"
    minivan = "minivan"
    trailer = "trailer"

class VehicleStatus(str, Enum):
    available = "available"
    on_trip = "on_trip"
    in_shop = "in_shop"
    retired = "retired"

class Vehicle(SQLModel, table=True):
    __tablename__ = "vehicles"

    id: int = Field(default=None, primary_key=True)
    registration_number: str = Field(unique=True, index=True, max_length=20)
    name_model: str = Field(max_length=100)
    type: VehicleType
    max_load_capacity: float = Field(default=0.0, ge=0.0) #kg
    odometer_reading: float = Field(default=0.0, ge=0.0) #km
    acquisition_cost: float = Field(default=0.0, ge=0.0) #Rs
    status: VehicleStatus = Field(default=VehicleStatus.available, index=True)
    region: str = Field(max_length=100, index=True, default=None)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))