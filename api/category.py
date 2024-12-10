from typing import List
import fastapi
from fastapi import Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from api.utils.categories import create_category, get_category_by_id, get_all_category,update_category , soft_delete_category, restore_category
from db.db_setup import async_get_db
from pydantic_schema.category_schema import CategorySchema, CategoryUpdate, CategoryCreate

router = fastapi.APIRouter()

# Create category
@router.post("/categories", response_model=CategorySchema, status_code=201)
async def create_category_endpoint(category: CategoryCreate, db: AsyncSession = Depends(async_get_db)):
    db_category = await create_category(db, category)
    return db_category

# Get all category
@router.get("/categories", response_model=List[CategorySchema])
async def read_categories(skip: int=0, limit: int=100, db: AsyncSession = Depends(async_get_db)):
    query = await get_all_category(db, skip = skip, limit = limit)
    categories = query.scalars().all()
    return categories

# Get category by ID
@router.get("/categories/{category_id}", response_model=CategorySchema)
async def category_by_id(category_id: int, db: AsyncSession = Depends(async_get_db)):
    result = await get_category_by_id(db, category_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return result

# Update a category
@router.put("/categories/{category_id}", response_model=CategorySchema)
async def update_category_endpoint(category_id: int, category_update: CategoryUpdate, db: AsyncSession = Depends(async_get_db)):
    db_category = await update_category(db, category_id, category_update)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

# Soft delete
@router.delete("/categories/{category_id}", response_model=CategorySchema)
async def soft_delete_category_endpoint(category_id: int, db: AsyncSession = Depends(async_get_db)):
    delete_category = await soft_delete_category(db, category_id)
    if delete_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return delete_category

# Restore Soft delete
@router.post("/categories/{category_id}")
async def restore_category_endpoint(category_id: int, db: AsyncSession = Depends(async_get_db)):
    restored_category = await restore_category(db, category_id)
    if restored_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return restored_category