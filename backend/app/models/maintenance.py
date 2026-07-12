from datetime import date as dt_date
from datetime import datetime
from enum import Enum

from sqlmodel import Field, SQLModel


class MaintenanceStatus(str, Enum):
    active = "active"
    closed = "closed"


class MaintenanceLog(SQLModel, table=True):
    __tablename__ = "maintenance_logs"

    id: int | None = Field(default=None, primary_key=True)
    vehicle_id: int = Field(foreign_key="vehicles.id", index=True)
    type: str = Field(max_length=100)
    description: str = Field(default="", max_length=500)
    cost: float = Field(default=0.0, ge=0.0)
    status: MaintenanceStatus = Field(default=MaintenanceStatus.active, index=True)
    start_date: dt_date = Field(default_factory=dt_date.today)
    end_date: dt_date | None = None
    created_by: int = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
