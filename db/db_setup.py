from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
# from sqlalchemy import create_engine
# alembic revision --autogenerate

# SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://arman:1913@localhost:5432/fastapi_lms"
ASYNC_SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://arman:1913@localhost:5432/penta_db"

# engine = create_engine(
#     SQLALCHEMY_DATABASE_URL, connect_args={}, future=True
# )
async_engine = create_async_engine(ASYNC_SQLALCHEMY_DATABASE_URL)

# SessionLocal = sessionmaker(
#     autocommit=False, autoflush=False, bind=engine, future=True
# )
AsyncSessionLocal = sessionmaker(
    async_engine, class_= AsyncSession, expire_on_commit= False
)

Base = declarative_base()

# DB Utilities
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

async def async_get_db():
        async with AsyncSessionLocal() as db:
            yield db
            await db.commit()