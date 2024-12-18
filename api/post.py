from typing import List
import fastapi
from fastapi import Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from api.utils.posts import create_post, get_post_by_id, get_active_posts, get_posts_by_category, delete_post, update_post, restore_post
from db.db_setup import async_get_db
from pydantic_schema.post_schema import PostCreate, Post, PostUpdate, PostUp
from api.utils.jwt_util import check_roles
from infrastructure.security.Route_intercept import RouterInterceptor
from starlette.requests import Request


router = fastapi.APIRouter(prefix="/penta-blog/api", route_class=RouterInterceptor)

# Get all posts
@router.get("/posts", response_model=List[Post])
@check_roles(["Admin","Moderator","User"])
async def get_all_post(request: Request, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(async_get_db)):
    posts = await get_active_posts(db, skip=skip, limit=limit)  # Your function to get all posts
    return posts

# Get a post using ID
@router.get("/posts/{post_id}", response_model=Post)
@check_roles(["Admin","Moderator","User"])
async def get_post(request: Request, post_id: int, db: AsyncSession = Depends(async_get_db)):
    post = await get_post_by_id(db, post_id)
    if not post or post.is_deleted:
        raise HTTPException(status_code=404, detail="Post not found or is deleted")
    return post

# Update a post
@router.put("/posts/{post_id}", response_model=PostUp)
@check_roles(["Admin","Moderator","User"])
async def update_existing_post(request: Request, post_id: int, post_update: PostUpdate, db: AsyncSession = Depends(async_get_db)):
    return await update_post(db, post_id, post_update)

# Create a new post
@router.post("/posts", response_model=Post, status_code=201)
@check_roles(["Admin","Moderator","User"])
async def create_new_post(request: Request, post: PostCreate, db: AsyncSession = Depends(async_get_db)):

    db_post = await create_post(db, post)
    return db_post

# Soft delete
@router.delete("/posts/{user_id}", response_model=Post)
@check_roles(["Admin","Moderator","User"])
async def delete_post(request: Request, user_id: int, db: AsyncSession = Depends(async_get_db)):
    post = await delete_post(db, user_id)
    return post

# Restore soft delete
@router.put("/posts/{post_id}/restore", response_model=Post)
@check_roles(["Admin","Moderator","User"])
async def restore_soft_deleted_post(request: Request, post_id: int, db: AsyncSession = Depends(async_get_db)):
    post = await restore_post(db, post_id)
    return post

# Get the Posts using category
@router.get("/posts/category/{category_id}", response_model=List[Post])
@check_roles(["Admin","Moderator","User"])
async def get_posts_by_category_endpoint(request: Request, category_id: int, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(async_get_db)):
    posts = await get_posts_by_category(db, category_id, skip=skip, limit=limit)
    if not posts:
        raise HTTPException(status_code=404, detail="No posts found in this category")
    return posts