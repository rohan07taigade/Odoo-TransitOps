from fastapi import APIRouter, Depends, Query
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.dependencies import get_current_user, require_role
from app.db.database import get_session
from app.schemas.maintenance_fuel import (
    ExpenseCreate,
    ExpenseRead,
    FuelLogCreate,
    FuelLogRead,
)
from app.services import fuel_expense_service

router = APIRouter()


@router.post("/fuel-logs", response_model=FuelLogRead)
async def create_fuel_log(
    payload: FuelLogCreate,
    session: AsyncSession = Depends(get_session),
    user=Depends(require_role(["financial_analyst", "dispatcher", "admin"])),
):
    return await fuel_expense_service.create_fuel_log(payload, user.id, session)


@router.get("/fuel-logs", response_model=list[FuelLogRead])
async def list_fuel_logs(
    vehicle_id: int | None = Query(default=None),
    session: AsyncSession = Depends(get_session),
    user=Depends(get_current_user),
):
    return await fuel_expense_service.list_fuel_logs(session, vehicle_id)


@router.post("/expenses", response_model=ExpenseRead)
async def create_expense(
    payload: ExpenseCreate,
    session: AsyncSession = Depends(get_session),
    user=Depends(require_role(["financial_analyst", "admin"])),
):
    return await fuel_expense_service.create_expense(payload, user.id, session)


@router.get("/expenses", response_model=list[ExpenseRead])
async def list_expenses(
    vehicle_id: int | None = Query(default=None),
    session: AsyncSession = Depends(get_session),
    user=Depends(get_current_user),
):
    return await fuel_expense_service.list_expenses(session, vehicle_id)
