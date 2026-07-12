from datetime import date as dt_date
from datetime import datetime
from enum import Enum

from sqlmodel import Field, SQLModel


class DriverStatus(str, Enum):
    available = "available"
    on_trip = "on_trip"
    off_duty = "off_duty"
    suspended = "suspended"


class Driver(SQLModel, table=True):
    __tablename__ = "drivers"

    id: int | None = Field(default=None, primary_key=True)
    user_id: int | None = Field(default=None, foreign_key="users.id")
    name: str = Field(max_length=150, index=True)
    license_number: str = Field(unique=True, index=True, max_length=100)
    license_category: str = Field(max_length=50)
    license_expiry_date: dt_date = Field(index=True)
    contact_number: str = Field(max_length=30)
    safety_score: float = Field(default=100.0, ge=0.0, le=100.0)
    status: DriverStatus = Field(default=DriverStatus.available, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
