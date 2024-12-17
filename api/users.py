from typing import List
import fastapi
from fastapi import Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from api.utils.users import get_user, get_users_by_username, get_users, create_user, delete_user, update_user
from api.utils.posts import get_post_by_user
from db.db_setup import async_get_db
from pydantic_schema.user_schema import UserCreate, User, UserUpdate
from pydantic_schema.post_schema import Post
from api.utils.jwt_util import get_current_user, check_roles

router = fastapi.APIRouter(prefix="/penta-blog/api")

# Find all users
@router.get("/users", response_model=List[User])
@check_roles(["Admin", "Moderator"])
async def read_users(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(async_get_db), current_user: dict = Depends(get_current_user)):
    users = await get_users(db=db, skip=skip, limit=limit)
    if users is None:
        raise HTTPException(status_code=404, detail="User not found")
    return users

# Find user with ID
@router.get("/users/{user_id}", response_model=User)
@check_roles(["Admin", "Moderator"])
async def read_user(user_id: int, db: AsyncSession = Depends(async_get_db), current_user: dict = Depends(get_current_user)):
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
@check_roles(["User"])
async def update_user_info(user_id: int, user_update: UserUpdate, db: AsyncSession = Depends(async_get_db), current_user: dict = Depends(get_current_user)):
    updated_user = await update_user(db=db, user_id=user_id, user_update=user_update)

    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    return updated_user

# Delete a user
@router.delete("/users/{user_id}", status_code=204)
@check_roles(["Admin", "User"])
async def delete_user_id(user_id: int, db: AsyncSession = Depends(async_get_db), current_user: dict = Depends(get_current_user)):
    success = await delete_user(db = db, user_id = user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted successfully"}

# Get all post of a user
@router.get("/users/{user_id}/posts", response_model=List[Post])
@check_roles(["Admin","Moderator","User"])
async def read_user_post(user_id: int,skip: int = 0, limit: int = 100, db: AsyncSession = Depends(async_get_db), current_user: dict = Depends(get_current_user)):
    posts = await get_post_by_user(db = db, user_id= user_id, skip=skip, limit=limit)
    if not posts:
        raise HTTPException(status_code=404, detail="No posts found for this user")
    return posts

######### DELETE this block later after test ###################
@router.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    return {"message": f"Hello, {current_user['username']}. You have access to this route!"}