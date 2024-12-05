from pydantic import BaseModel

class RoleBase(BaseModel):
    name: str
    description: str

class RoleCreate(RoleBase):
    ...

class Role(RoleBase):
    id: int

    class Config:
        orm_mode = True