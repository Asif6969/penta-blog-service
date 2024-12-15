from typing import List
import fastapi
from fastapi import Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from api.utils.roles import get_roles, get_role_by_id, assign_role_to_user, update_role, create_role
from db.db_setup import async_get_db
from pydantic_schema.role_schema import Role, RoleUpdate, RoleCreate
from pydantic_schema.user_schema import User
from api.utils.jwt_util import JWTBearer

router = fastapi.APIRouter(prefix="/Penta-blog/api")

# Create new role
@router.post("/roles", response_model=Role, dependencies=[Depends(JWTBearer())])
async def make_roles(roles: RoleCreate, db: AsyncSession = Depends(async_get_db)):
    role_data = RoleCreate(name=roles.name, description=roles.description)
    new_role = await create_role(db=db, role=role_data)
    if not new_role:
        raise HTTPException(status_code=400, detail="Role already exist")
    return new_role

# Fetch all roles
@router.get("/roles", response_model=List[Role], dependencies=[Depends(JWTBearer())])
async def get_roles_available(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(async_get_db)):
    roles = await get_roles(db=db, skip=skip, limit=limit)
    return roles

# Fetch role by ID
@router.get("/roles/{role_id}", response_model=Role, dependencies=[Depends(JWTBearer())])
async def get_role_by_id_endpoint(role_id: int, db: AsyncSession = Depends(async_get_db)):
    role = await get_role_by_id(db, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

# Update a role
@router.put("/roles/{role_id}", response_model=Role, dependencies=[Depends(JWTBearer())])
async def update_role_endpoint(role_id: int, role: RoleUpdate, db: AsyncSession = Depends(async_get_db)):
    updated_role = await update_role(db=db, role_id=role_id, role_update=role)
    if not updated_role:
        raise HTTPException(status_code=404, detail="Role not found")
    return updated_role

# Assign a role to a user
@router.put("/users/{user_id}/assign-role/{role_id}", response_model=User, dependencies=[Depends(JWTBearer())])
async def assign_role_to_user_endpoint(user_id: int, role_id: int, db: AsyncSession = Depends(async_get_db)):
    user_with_role = await assign_role_to_user(db, user_id, role_id)
    if not user_with_role:
        raise HTTPException(status_code=404, detail="User or role not found")
    return user_with_role