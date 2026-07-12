from datetime import date

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.expense import Expense
from app.models.fuel import FuelLog
from app.schemas.maintenance_fuel import ExpenseCreate, FuelLogCreate
from app.services import vehicle_service


async def create_fuel_log(payload: FuelLogCreate, created_by: int, session: AsyncSession) -> FuelLog:
    await vehicle_service.get_vehicle(payload.vehicle_id, session)
    log = FuelLog(
        **payload.model_dump(exclude_none=True),
        date=payload.date or date.today(),
        created_by=created_by,
    )
    session.add(log)
    await session.commit()
    await session.refresh(log)
    return log


async def list_fuel_logs(session: AsyncSession, vehicle_id: int | None = None) -> list[FuelLog]:
    query = select(FuelLog)
    if vehicle_id:
        query = query.where(FuelLog.vehicle_id == vehicle_id)
    result = await session.exec(query)
    return result.all()


async def create_expense(payload: ExpenseCreate, created_by: int, session: AsyncSession) -> Expense:
    await vehicle_service.get_vehicle(payload.vehicle_id, session)
    expense = Expense(
        **payload.model_dump(exclude_none=True),
        date=payload.date or date.today(),
        created_by=created_by,
    )
    session.add(expense)
    await session.commit()
    await session.refresh(expense)
    return expense


async def list_expenses(session: AsyncSession, vehicle_id: int | None = None) -> list[Expense]:
    query = select(Expense)
    if vehicle_id:
        query = query.where(Expense.vehicle_id == vehicle_id)
    result = await session.exec(query)
    return result.all()
