from db.models.post_model import Post
from db.models.category_model import Category
from db.models.user_model import User
from pydantic_schema.post_schema import PostCreate, PostUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from pydantic_schema.user_schema import TokenData

# (1)Create a Post after checking if Category exist
async def create_post(db: AsyncSession, posts: PostCreate, user: TokenData):
    # Check if category exists and is not deleted
    query = select(Category).where(Category.id == posts.category_id, Category.is_deleted == False)
    result = await db.execute(query)
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found or is deleted")

    query = select(User).where(User.username == user.username)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found or is deleted")

    db_post = Post(
        title = posts.title,
        content = posts.content,
        category_id = posts.category_id,
        user_id = posts.user_id
    )

    try:
        db.add(db_post)
        await db.commit()
        await db.refresh(db_post)
        return db_post
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Post creation failed")

# (2)Getting all the posts while checking soft delete
async def get_active_posts(db: AsyncSession, skip: int = 0, limit: int = 100):
    query = select(Post).where(Post.is_deleted == False).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

# (3)Getting a specific post using post id
async def get_post_by_id(db: AsyncSession, post_id: int):
    query = select(Post).where(Post.id == post_id, Post.is_deleted == False)
    result = await db.execute(query)
    post = result.scalar_one_or_none()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found or is deleted")

    return post

# (4)Updating a post
async def update_post(db: AsyncSession, post_id: int, post_update: PostUpdate, user: TokenData):
    query = select(Post).where(Post.id == post_id)
    result = await db.execute(query)
    post = result.scalar_one_or_none()

    if not post or post.is_deleted:
        raise HTTPException(status_code=404, detail="Post not found or is deleted")

    query = select(User).where(User.username == user.username)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found or is deleted")

    update_data = post_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        if key == "category_id":
            # Check if the category exists and is not deleted
            category_query = select(Category).where(Category.id == value, Category.is_deleted == False)
            category_result = await db.execute(category_query)
            category = category_result.scalar_one_or_none()

            if not category:
                raise HTTPException(status_code=404, detail="Category not found or is deleted")
            setattr(post, key, value)
        else:
            setattr(post, key, value)

    await db.commit()
    await db.refresh(post)
    return post

# (5)Soft deleting Post via user id
async def delete_post(db: AsyncSession, user_id: int):
    query = select(Post).where(Post.user_id == user_id)
    result = await db.execute(query)
    post = result.scalar_one_or_none()

    if not post or post.is_deleted:
        raise HTTPException(status_code=404, detail="Post not found or is already deleted")

    post.is_deleted = True
    await db.commit()
    return {"message": "Post soft-deleted successfully"}

# (6)Restore the Soft delete
async def restore_post(db: AsyncSession, post_id: int):
    query = select(Post).where(Post.id == post_id)
    result = await db.execute(query)
    post = result.scalar_one_or_none()

    if not post or not post.is_deleted:
        raise HTTPException(status_code=404, detail="Post not found or is not deleted")

    post.is_deleted = False
    await db.commit()
    return {"message": "Post restored successfully"}


# (7)Get post sorted by Category
async def get_posts_by_category(db: AsyncSession, category_id: int, skip: int = 0, limit: int = 100):
    query = select(Post).where(Post.category_id == category_id, Post.is_deleted == False).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

# (8)Getting a specific post using post id
async def get_post_by_user(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100):
    query = select(Post).where(Post.user_id == user_id, Post.is_deleted == False).offset(skip).limit(limit)
    result = await db.execute(query)
    post = result.scalars().all()

    if not post:
        raise HTTPException(status_code=404, detail="Post of user not found or is deleted")

    return post