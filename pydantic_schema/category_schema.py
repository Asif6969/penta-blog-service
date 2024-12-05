from pydantic import BaseModel

class CategoryBase(BaseModel):
    name: str
    description: str
    is_deleted: bool = False

class CategoryCreate(CategoryBase):
    ...

class Category(CategoryBase):
    id: int

    class Config:
        orm_mode = True