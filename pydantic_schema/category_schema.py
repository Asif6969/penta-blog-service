from pydantic import BaseModel
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    description: str
    is_deleted: bool = False

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_deleted: Optional[bool] = None

class CategoryCreate(CategoryBase):
    ...

class CategorySchema(CategoryBase):
    id: int

    class Config:
        orm_mode = True