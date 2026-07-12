from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    vehicles,
    drivers,
    trips,
    maintenance,
    fuel_expenses,
    dashboard,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(vehicles.router, prefix="/vehicles", tags=["vehicles"])
api_router.include_router(drivers.router, prefix="/drivers", tags=["drivers"])
api_router.include_router(trips.router, prefix="/trips", tags=["trips"])
api_router.include_router(maintenance.router, prefix="/maintenance", tags=["maintenance"])
api_router.include_router(fuel_expenses.router, prefix="/fuel-expenses", tags=["fuel-expenses"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])