from typing import Optional, List
import fastapi
from fastapi import Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from api.utils.users import get_user, get_users_by_username, get_users, create_user, delete_user, update_user
from db.db_setup import async_get_db
from pydantic_schema.user_schema import UserCreate, User, UserUpdate


router = fastapi.APIRouter()

# Find all users
@router.get("/users", response_model=List[User])
async def read_users(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(async_get_db)):
    users = await get_users(db, skip=skip, limit=limit)
    return users

# Find user with ID
@router.get("/users/{user_id}", response_model=User)
async def read_user(user_id: int, db: AsyncSession = Depends(async_get_db)):
    db_user =  await get_user(db= db,user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Create a new User
@router.post("/users", response_model=User, status_code=201)
async def create_new_user(user: UserCreate, db: AsyncSession = Depends(async_get_db)):
    db_user = await get_users_by_username(db=db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username is already registered")
    new_user = await create_user(db=db, user=user)
    return new_user

# Update a user
@router.put("/users/{user_id}", response_model=User)
async def update_user_info(user_id: int, user_update: UserUpdate, db: AsyncSession = Depends(async_get_db)):
    updated_user = await update_user(db=db, user_id=user_id, user_update=user_update)

    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    return updated_user

# Delete a user
@router.delete("/users/{id}")
async def delete_user():
    ...

# Get all post of a user