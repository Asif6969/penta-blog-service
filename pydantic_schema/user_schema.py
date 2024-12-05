from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: str
    phone: str
    username: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    username: Optional[str] = None

    class Config:
        orm_mode = True

class UserCreate(UserBase):
    ...

class User(UserBase):
    id: int
    role_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True