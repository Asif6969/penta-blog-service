from typing import List
import fastapi
from fastapi import Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from api.utils.posts import create_post, get_post_by_id, get_active_posts, get_posts_by_category, delete_post, update_post, restore_post
from db.db_setup import async_get_db
from pydantic_schema.post_schema import PostCreate, Post, PostUpdate, PostUp
from pydantic_schema.user_schema import User
from api.utils.jwt_util import get_current_user, check_roles


router = fastapi.APIRouter(prefix="/penta-blog/api")

# Get all posts
@router.get("/posts", response_model=List[Post])
@check_roles(["Admin","Moderator","User"])
async def get_all_post(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(async_get_db), current_user: dict = Depends(get_current_user)):
    posts = await get_active_posts(db, skip=skip, limit=limit)  # Your function to get all posts
    return posts

# Get a post using ID
@router.get("/posts/{post_id}", response_model=Post)
@check_roles(["Admin","Moderator","User"])
async def get_post(post_id: int, db: AsyncSession = Depends(async_get_db), current_user: dict = Depends(get_current_user)):
    post = await get_post_by_id(db, post_id)
    if not post or post.is_deleted:
        raise HTTPException(status_code=404, detail="Post not found or is deleted")
    return post

# Update a post
@router.put("/posts/{post_id}", response_model=PostUp)
@check_roles(["Admin","Moderator","User"])
async def update_existing_post(post_id: int, post_update: PostUpdate, db: AsyncSession = Depends(async_get_db), current_user: User = Depends(get_current_user)):
    return await update_post(db, post_id, post_update)

# Create a new post
@router.post("/posts", response_model=Post, status_code=201)
@check_roles(["Admin","Moderator","User"])
async def create_new_post(post: PostCreate, db: AsyncSession = Depends(async_get_db), current_user: User = Depends(get_current_user)):

    db_post = await create_post(db, post)
    return db_post

# Soft delete
@router.delete("/posts/{user_id}", response_model=Post)
@check_roles(["Admin","Moderator","User"])
async def delete_post(user_id: int, db: AsyncSession = Depends(async_get_db), current_user: dict = Depends(get_current_user)):
    post = await delete_post(db, user_id)
    return post

# Restore soft delete
@router.put("/posts/{post_id}/restore", response_model=Post)
@check_roles(["Admin","Moderator","User"])
async def restore_soft_deleted_post(post_id: int, db: AsyncSession = Depends(async_get_db), current_user: dict = Depends(get_current_user)):
    post = await restore_post(db, post_id)
    return post

# Get the Posts using category
@router.get("/posts/category/{category_id}", response_model=List[Post])
@check_roles(["Admin","Moderator","User"])
async def get_posts_by_category_endpoint(category_id: int, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(async_get_db), current_user: dict = Depends(get_current_user)):
    posts = await get_posts_by_category(db, category_id, skip=skip, limit=limit)
    if not posts:
        raise HTTPException(status_code=404, detail="No posts found in this category")
    return posts