from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str

class UserBase(BaseModel):
    name: str
    email: str
    phone: str
    username: str
    role_id: Optional[int] = 2

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None

    class Config:
        orm_mode = True

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class UserRole(BaseModel):
    name: str
    email: str
    phone: str
    username: str
    role: str
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True