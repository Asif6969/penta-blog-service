from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PostBase(BaseModel):
    title: str
    content: str
    category_id: int
    user_id: int

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[int] = None

    class Config:
        orm_mode = True

class PostCreate(PostBase):
    ...

class Post(PostBase):
    id: int
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class PostUp(PostBase):
    id: int
    is_deleted: bool = False
    updated_at: datetime

    class Config:
        orm_mode = True