import importlib
import logging
import pkgutil

from sqlmodel import SQLModel
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.database import get_engine
from app.models.user import User, UserRole

logger = logging.getLogger(__name__)


def import_models() -> None:
    """
    Import model modules so SQLModel metadata knows all tables.
    Broken/incomplete model files get logged and skipped.
    """
    import app.models as models_pkg

    for module in pkgutil.iter_modules(models_pkg.__path__):
        module_name = f"{models_pkg.__name__}.{module.name}"
        try:
            importlib.import_module(module_name)
        except Exception as exc:
            logger.warning("Skipping model module %s: %s", module_name, exc)


async def init_db() -> None:
    import_models()
    engine = get_engine()

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    async with AsyncSession(engine) as session:
        result = await session.exec(select(User).where(User.email == settings.FIRST_SUPERUSER_EMAIL))
        existing = result.first()
        if not existing:
            session.add(
                User(
                    email=settings.FIRST_SUPERUSER_EMAIL,
                    password_hash=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                    full_name="System Administrator",
                    role=UserRole.admin,
                    is_active=True,
                )
            )
            await session.commit()


if __name__ == "__main__":
    import asyncio

    logging.basicConfig(level=logging.INFO)
    asyncio.run(init_db())
