from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from api.utils.jwt_util import create_access_token, authenticate_user
from db.db_setup import async_get_db

router = APIRouter(prefix="/penta-blog/api")

@router.post("/login", response_model=dict)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(async_get_db)
):
    """
    Authenticate the user and return a JWT token.
    """
    authenticated_user = await authenticate_user(db, form_data.username, form_data.password)
    if not authenticated_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = authenticated_user["user"]
    role_name = authenticated_user["role_name"]
    # Generate JWT token
    token_data = {"sub": user.username, "role": role_name}
    token = create_access_token(data=token_data)
    return {"access_token": token, "token_type": "bearer"}

@router.post("/logout")
async def logout():
    return {"message": "Logout successful"}
