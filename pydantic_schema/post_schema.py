from pydantic import BaseModel
from datetime import datetime


class PostBase(BaseModel):
    title: str
    text: str
    is_deleted: bool = False

class PostCreate(PostBase):
    ...

class Post(PostBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category_id: int
    user_id: int

    class Config:
        orm_mode = True