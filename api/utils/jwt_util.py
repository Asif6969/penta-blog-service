from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError, ExpiredSignatureError
from passlib.context import CryptContext
from typing import Optional
from db.db_setup import AsyncSession
from sqlalchemy.future import select
from db.models.user_model import User
from db.models.role_model import Role
from fastapi import HTTPException, status, Request
from functools import wraps
from infrastructure.security.Route_intercept import AuthPermissionValidator



SECRET_KEY = "1fd26fc70cb30cddcc77020a29a1c70db62ef9c6c5707b1a371237bff5a328b5"  # Use a secure key for production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/Penta-blog/api/login")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Create JWT refresh token
def create_refresh_token(user: dict):
    to_encode = user.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def validate_refresh_token(refresh_token: str):
    try:
        # Decode the token
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # Token is valid, return payload
    except ExpiredSignatureError:
        raise ValueError("The token has expired")
    except JWTError:
        raise ValueError("Invalid token")

# Create JWT access token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Verify login
async def authenticate_user(db: AsyncSession, username: str, plain_password: str):
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()

    if not user:
        return None

    # Verify the password
    if not verify_password(plain_password, user.password):
        return None

    # Fetch the role name
    role_result = await db.execute(select(Role.name).where(Role.id == user.role_id))
    role_name = role_result.scalar_one_or_none()

    # Add the role name to the user dictionary
    return {"user": user, "role_name": role_name}

# Role-checking decorator for async routes
def check_roles(required_roles: list):
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            # Validate the token and get the user's role
            current_user = await AuthPermissionValidator.validate_permission(request)
            if current_user["role"] not in required_roles:
                raise HTTPException(
                    status_code=403,
                    detail="You don't have access to this resource"
                )

            # Add current_user as the first argument (or adjust if necessary)
            return await func(current_user, *args, **kwargs)

        return wrapper

    return decorator