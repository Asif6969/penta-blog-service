from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PostBase(BaseModel):
    title: str
    content: str
    is_deleted: bool = False
    category_id: int
    user_id: int

class PostUpdate(BaseModel):
    title: Optional[str]
    content: Optional[str]
    category_id: Optional[int]

    class Config:
        orm_mode = True

class PostCreate(PostBase):
    ...

class Post(PostBase):
    id: int
    created_at: datetime
    updated_at: datetime


    class Config:
        orm_mode = True