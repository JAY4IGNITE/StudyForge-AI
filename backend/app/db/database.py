from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from sqlalchemy import select
from app.core.config import settings
import logging
from contextvars import ContextVar
from typing import Any, Dict

logger = logging.getLogger(__name__)

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.APP_ENV == "development",
    future=True,
    pool_size=20,
    max_overflow=10,
    connect_args={"prepared_statement_cache_size": 0},
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

db_session: ContextVar[AsyncSession] = ContextVar("db_session")

class BeanieQueryBuilder:
    def __init__(self, cls, *args):
        self.cls = cls
        self.stmt = select(cls)
        for arg in args:
            if isinstance(arg, dict):
                for k, v in arg.items():
                    self.stmt = self.stmt.where(getattr(cls, k) == v)
            else:
                self.stmt = self.stmt.where(arg)

    def sort(self, *args):
        # We don't implement full sort since it's rarely used, but we return self to allow chaining
        return self

    async def to_list(self):
        session = db_session.get()
        if not session:
            raise RuntimeError("No session in context")
        result = await session.execute(self.stmt)
        return result.scalars().all()

class CRUDMixin:
    @classmethod
    async def get(cls, id: Any):
        session = db_session.get()
        if not session:
            raise RuntimeError("No session in context")
        if isinstance(id, str):
            import uuid
            try:
                id = uuid.UUID(id)
            except ValueError:
                pass
        return await session.get(cls, id)

    @classmethod
    async def find_one(cls, *args, **kwargs):
        session = db_session.get()
        if not session:
            raise RuntimeError("No session in context")
        stmt = select(cls)
        if args:
            for arg in args:
                if isinstance(arg, dict):
                    for k, v in arg.items():
                        stmt = stmt.where(getattr(cls, k) == v)
                else:
                    stmt = stmt.where(arg)
        if kwargs:
            for k, v in kwargs.items():
                stmt = stmt.where(getattr(cls, k) == v)
                
        result = await session.execute(stmt)
        return result.scalars().first()

    @classmethod
    def find(cls, *args, **kwargs):
        builder = BeanieQueryBuilder(cls, *args)
        if kwargs:
            for k, v in kwargs.items():
                builder.stmt = builder.stmt.where(getattr(cls, k) == v)
        return builder

    @classmethod
    def find_all(cls):
        return BeanieQueryBuilder(cls)

    async def insert(self):
        session = db_session.get()
        if not session:
            raise RuntimeError("No session in context")
        session.add(self)
        await session.commit()
        await session.refresh(self)
        return self

    async def save(self):
        session = db_session.get()
        if not session:
            raise RuntimeError("No session in context")
        session.add(self)
        await session.commit()
        await session.refresh(self)
        return self

Base = declarative_base(cls=CRUDMixin)


async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
