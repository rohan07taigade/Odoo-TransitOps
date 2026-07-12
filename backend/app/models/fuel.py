from datetime import date as dt_date
from datetime import datetime

from sqlmodel import Field, SQLModel


class FuelLog(SQLModel, table=True):
    __tablename__ = "fuel_logs"

    id: int | None = Field(default=None, primary_key=True)
    vehicle_id: int = Field(foreign_key="vehicles.id", index=True)
    trip_id: int | None = Field(default=None, foreign_key="trips.id", index=True)
    liters: float = Field(gt=0.0)
    cost: float = Field(ge=0.0)
    date: dt_date = Field(default_factory=dt_date.today)
    odometer_reading: float | None = Field(default=None, ge=0.0)
    created_by: int = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
