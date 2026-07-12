from datetime import date as dt_date
from datetime import datetime
from enum import Enum

from sqlmodel import Field, SQLModel


class ExpenseCategory(str, Enum):
    toll = "toll"
    maintenance = "maintenance"
    other = "other"


class Expense(SQLModel, table=True):
    __tablename__ = "expenses"

    id: int | None = Field(default=None, primary_key=True)
    vehicle_id: int = Field(foreign_key="vehicles.id", index=True)
    category: ExpenseCategory = Field(index=True)
    amount: float = Field(ge=0.0)
    date: dt_date = Field(default_factory=dt_date.today)
    description: str = Field(default="", max_length=500)
    created_by: int = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
