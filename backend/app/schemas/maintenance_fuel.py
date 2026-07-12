from datetime import date as dt_date
from datetime import datetime

from pydantic import BaseModel

from app.models.expense import ExpenseCategory
from app.models.maintenance import MaintenanceStatus


class MaintenanceCreate(BaseModel):
    vehicle_id: int
    type: str
    description: str = ""
    cost: float = 0.0
    start_date: dt_date | None = None


class MaintenanceClose(BaseModel):
    end_date: dt_date | None = None


class MaintenanceRead(BaseModel):
    id: int
    vehicle_id: int
    type: str
    description: str
    cost: float
    status: MaintenanceStatus
    start_date: dt_date
    end_date: dt_date | None
    created_by: int
    created_at: datetime


class FuelLogCreate(BaseModel):
    vehicle_id: int
    trip_id: int | None = None
    liters: float
    cost: float
    date: dt_date | None = None
    odometer_reading: float | None = None


class FuelLogRead(BaseModel):
    id: int
    vehicle_id: int
    trip_id: int | None
    liters: float
    cost: float
    date: dt_date
    odometer_reading: float | None
    created_at: datetime


class ExpenseCreate(BaseModel):
    vehicle_id: int
    category: ExpenseCategory
    amount: float
    date: dt_date | None = None
    description: str = ""


class ExpenseRead(BaseModel):
    id: int
    vehicle_id: int
    category: ExpenseCategory
    amount: float
    date: dt_date
    description: str
    created_at: datetime
