from pydantic import BaseModel
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    description: str
    is_deleted: bool = False

class CategoryUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    is_deleted: Optional[bool] = False

class CategoryCreate(CategoryBase):
    ...

class Category(CategoryBase):
    id: int

    class Config:
        orm_mode = True