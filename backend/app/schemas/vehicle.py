from sqlmodel import SQLModel
from app.models.vehicle import VehicleType, VehicleStatus
from datetime import datetime
class VehicleCreate(SQLModel):
    registration_number: str
    name_model: str
    type: VehicleType
    max_load_capacity: float = 0.0 #kg
    odometer_reading: float = 0.0 #km
    acquisition_cost: float = 0.0 #Rs
    region: str = None

class VehicleUpdate(SQLModel):
    name_model: str = None
    max_load_capacity: float = None #kg
    region: str = None
    status: VehicleStatus | None = None


class VehicleRead(SQLModel):
    id: int
    registration_number: str
    name_model: str
    type: VehicleType
    max_load_capacity: float #kg
    odometer_reading: float #km
    acquisition_cost: float #Rs
    status: VehicleStatus
    region: str | None

    created_at: datetime
    updated_at: datetime


class VehicleReportRead(SQLModel):
    total_fuel_cost: float
    total_maintenance_cost: float 
    total_operational_cost: float # fuel + maintenance
    fuel_efficiency: float | None # distance/fuel, None if no trips yet
    roi: float