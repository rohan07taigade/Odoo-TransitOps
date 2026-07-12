from datetime import datetime
from enum import Enum

from sqlmodel import Field, SQLModel


class UserRole(str, Enum):
    admin = "admin"
    fleet_manager = "fleet_manager"
    dispatcher = "dispatcher"
    safety_officer = "safety_officer"
    financial_analyst = "financial_analyst"


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255)
    full_name: str = Field(max_length=150)
    role: UserRole = Field(index=True)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
