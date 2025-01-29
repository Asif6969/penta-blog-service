from db.models.post_model import Post
from db.models.category_model import Category
from pydantic_schema.post_schema import PostCreate, PostUpdate
from db.db_setup import AsyncSession
from sqlalchemy import update, and_
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload
from fastapi import HTTPException

# (1)Create a Post after checking if Category exist
async def create_post(db: AsyncSession, posts: PostCreate):
    # Check if category exists and is not deleted
    query = select(Category).where(Category.id == posts.category_id, Category.is_deleted == False)
    result = await db.execute(query)
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found or is deleted")

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
    query = (
        select(Post)
        .join(Category, Post.category_id == Category.id)
        .where(Post.is_deleted == False, Category.is_deleted == False)
        .options(joinedload(Post.category))
        .offset(skip)
        .limit(limit)
    )
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
async def update_post(db: AsyncSession, post_id: int, user_id: int, post_update: PostUpdate):
    query = select(Post).where(and_(Post.id == post_id, Post.user_id == user_id))
    result = await db.execute(query)
    post = result.scalar_one_or_none()

    if not post or post.is_deleted:
        raise HTTPException(status_code=404, detail="Post not found or is deleted")

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
async def delete_post(db, user_id: int):
    # Query all posts for the user and mark them as deleted
    stmt = (
        update(Post)
        .where(Post.user_id == user_id, Post.is_deleted == False)  # Add condition for non-deleted posts
        .values(is_deleted=True)  # Soft delete (mark posts as deleted)
        .execution_options(synchronize_session="fetch")
    )
    
    # Execute the query and commit changes
    result = await db.execute(stmt)
    await db.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="No posts found for the given user to delete")

    return {"message": f"Soft deleted {result.rowcount} posts for user {user_id}"}

# (6)Restore the Soft delete
async def restore_post(db, user_id: int):
    # Restore all soft-deleted posts for the user
    stmt = (
        update(Post)
        .where(Post.user_id == user_id, Post.is_deleted == True)
        .values(is_deleted=False)
        .execution_options(synchronize_session="fetch")
    )
    
    result = await db.execute(stmt)
    await db.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="No posts found to restore for the given user")

    return {"message": f"Restored {result.rowcount} posts for user {user_id}"}


# (7)Get post sorted by Category
async def get_posts_by_category(db: AsyncSession, category_id: int, skip: int = 0, limit: int = 100):
    if category_id is None:  # If category_id is None, get all posts
        # Fetch all active posts
        query = select(Post).where(Post.is_deleted == False).offset(skip).limit(limit)
    else:  # Fetch posts based on category_id
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