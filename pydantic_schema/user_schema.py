from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: str
    phone: str
    username: str
    role_id: int

class UserUpdate(BaseModel):
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    username: Optional[str]

    class Config:
        orm_mode = True

class UserCreate(UserBase):
    ...

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True