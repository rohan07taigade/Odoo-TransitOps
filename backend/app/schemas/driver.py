from datetime import date as dt_date
from datetime import datetime

from pydantic import BaseModel

from app.models.driver import DriverStatus


class DriverCreate(BaseModel):
    name: str
    license_number: str
    license_category: str
    license_expiry_date: dt_date
    contact_number: str
    safety_score: float = 100.0
    status: DriverStatus = DriverStatus.available


class DriverUpdate(BaseModel):
    name: str | None = None
    license_category: str | None = None
    license_expiry_date: dt_date | None = None
    contact_number: str | None = None
    safety_score: float | None = None
    status: DriverStatus | None = None


class DriverRead(BaseModel):
    id: int
    name: str
    license_number: str
    license_category: str
    license_expiry_date: dt_date
    contact_number: str
    safety_score: float
    status: DriverStatus
    created_at: datetime
