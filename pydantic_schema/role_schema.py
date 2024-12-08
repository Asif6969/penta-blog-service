from pydantic import BaseModel
from typing import Optional

class RoleBase(BaseModel):
    name: str
    description: str

class RoleUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]

    class Config:
        orm_mode = True

class RoleCreate(RoleBase):
    ...

class Role(RoleBase):
    id: int

    class Config:
        orm_mode = True