from db.models.user_model import User
from pydantic_schema.user_schema import UserCreate, UserUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete

# Get one user via id
async def get_user(db: AsyncSession, user_id: int):
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    return result.scalar_one_or_none()

# Get one user via username
async def get_users_by_username(db: AsyncSession, username: str):
    query = select(User).where(User.username == username)
    result = await db.execute(query)
    return result.scalar_one_or_none()

# Get all users
async def get_users(db: AsyncSession, skip: int = 0, limit: int = 100):
    query = select(User).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

# Create a new user
async def create_user(db: AsyncSession, user: UserCreate):
    db_user = User(email=user.email, role=user.role)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

# Update user
async def update_user(db: AsyncSession, user_id: int, user_update: UserUpdate):
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        return None

    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


# Delete user
async def delete_user(db: AsyncSession, user_id: int):
    query = delete(User).where(User.id == user_id)
    await db.execute(query)
    await db.commit()