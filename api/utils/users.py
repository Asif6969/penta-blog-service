from db.models.user_model import User
from pydantic_schema.user_schema import UserCreate, UserUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from api.utils.jwt_util import hash_password

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
    hashed_password = hash_password(user.password)
    db_user = User(name=user.name, email=user.email, username=user.username, password=hashed_password, phone=user.phone, role_id=user.role_id)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

# Update user
async def update_user(db: AsyncSession, user_id: int, user_update: UserUpdate):
    # Fetch the existing user
    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalar_one_or_none()

    if not db_user:
        return None  # User not found

    update_data = user_update.model_dump(exclude_unset=True)

    # Check if password is being updated
    if "password" in update_data:
        update_data["password"] = hash_password(update_data["password"])  # Hash the new password

    # Update user fields
    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

# Delete user
async def delete_user(db: AsyncSession, user_id: int):
    existing_user = await db.execute(select(User).where(User.id == user_id))
    if not existing_user.scalar_one_or_none():
        return False
    query = delete(User).where(User.id == user_id)
    await db.execute(query)
    await db.commit()
    return True