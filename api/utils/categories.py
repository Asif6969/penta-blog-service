from db.models.category_model import Category
from pydantic_schema.category_schema import Category, CategoryCreate, CategoryUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

# Create a category
async def create_category(db: AsyncSession, category_data: CategoryCreate):
    db_category = Category(
        name = category_data.name,
        description= category_data.description
    )
    db.add(db_category)
    await db.commit()
    await db.refresh(db_category)
    return db_category

# Get all category
async def get_all_category(db: AsyncSession, skip: int=0, limit: int=100):
    query = select(Category).where(Category.is_deleted==False).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalar().all()

# Get a specific category
async def get_category_by_id(db: AsyncSession, category_id: int):
    query = select(Category).where(Category.id == category_id, Category.is_deleted == False)
    result = await db.execute(query)
    return result.scalar_one_or_none()

# Update category
async def update_category(db: AsyncSession, category_id: int, category_update: CategoryUpdate):
    query = select(Category).where(Category.id == category_id, Category.is_deleted == False)
    result = await db.execute(query)
    category = result.scalar_one_or_none()

    if category is None:
        return None

    update_data = category_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)

    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category

# Soft delete
async def soft_delete_category(db: AsyncSession, category_id: int):
    query = select(Category).where(Category.id == category_id)
    result = await db.execute(query)
    category = result.scalar_one_or_none()

    if category is None:
        return None

    category.is_deleted = True
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category

# Restore soft delete
async def restore_category(db: AsyncSession, category_id: int):
    query = select(Category).where(Category.id == category_id, Category.is_deleted == True)
    result = await db.execute(query)
    category = result.scalar_one_or_none()

    if category is None:
        return None

    category.is_deleted = False
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category