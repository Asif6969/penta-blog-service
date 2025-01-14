from fastapi import APIRouter, HTTPException, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from api.utils.jwt_util import create_access_token, authenticate_user, create_refresh_token, validate_refresh_token
from db.db_setup import async_get_db
from datetime import datetime, timedelta, timezone

router = APIRouter(prefix="/penta-blog/api")

@router.post("/login", response_model=dict)
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(async_get_db),
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
    token_data = {"sub": user.username, "id": user.id, "role": role_name}
    refresh_token = create_refresh_token(user=token_data)
    token_data2 = validate_refresh_token(refresh_token)
    token = create_access_token(data=token_data2)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,  # Set to True for HTTPS in production
        max_age=3600 * 24 * 30,  # 30 days
        expires=datetime.now(timezone.utc) + timedelta(days=30),  # Expiration time
        samesite="lax",  # Prevents CSRF attacks
    )
    return {"access_token": token, "token_type": "bearer"}

@router.post("/logout")
async def logout():
    return {"message": "Logout successful"}
