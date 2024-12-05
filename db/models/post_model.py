from pydantic import BaseModel
from datetime import datetime

class PostBase(BaseModel):
    title: str
    content: str

class PostCreate(PostBase):
    ...

class Post(PostBase):
    id: int
    category_id: int
    customer_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True