from db.models.role_model import Role
from db.models.user_model import User
from pydantic_schema.role_schema import RoleCreate, RoleUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

# Creating a new role
async def create_role(db: AsyncSession, role: RoleCreate):
    result = await db.execute(select(Role).filter(Role.name == role.name))
    db_role = result.scalars().first()

    if db_role:
        return None  # Role already exists

    new_role = Role(role_name=role.name, description=role.description)
    db.add(new_role)
    await db.commit()
    await db.refresh(new_role)
    return new_role

# Get all roles
async def get_roles(db: AsyncSession, skip: int = 0, limit: int = 100):
    query = select(Role).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

# Get a specific role
async def get_role_by_id(db: AsyncSession, role_id: int):
    query = select(Role).filter(Role.id == role_id)
    result = await db.execute(query)
    db_role = result.scalars().first()
    return db_role

# Update specific role
async def update_role(db: AsyncSession, role_id: int, role_update = RoleUpdate):
    query = select(Role).filter(Role.role_id == role_id)
    result = await db.execute(select(Role).filter(Role.role_id == role_id))
    db_role = result.scalars().first()
    if not db_role:
        return None  # Role not found

    update_data = role_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_role, key, value)

    db.add(db_role)
    await db.commit()
    await db.refresh(db_role)
    return db_role

# Assign a role to a user
async def assign_role_to_user(db: AsyncSession, user_id: int, role_id: int):
    result_user = await db.execute(select(User).filter(User.id == user_id))
    db_user = result_user.scalars().first()

    result_role = await db.execute(select(Role).filter(Role.role_id == role_id))
    db_role = result_role.scalars().first()

    if not db_user or not db_role:
        return None  # User or role not found

    db_user.role_id = role_id
    await db.commit()
    await db.refresh(db_user)
    return db_user