from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/Penta-blog/api/login")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Create JWT token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Verify JWT token
# def verify_token(token: str):
#     try:
#         # Decode the token and validate expiration with `verify_exp`
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_exp": True})
#         if not payload.get("sub"):
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Missing subject in token",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )
#         return payload
#     except JWTError as e:
#         # Check for the specific error message related to expiration
#         if "Signature has expired" in str(e):
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Token has expired",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )
#         # Handle any other JWT-related errors
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid token",
#             headers={"WWW-Authenticate": "Bearer"},
#         )


# async def get_current_user(db: AsyncSession = Depends(async_get_db), token: str = Depends(oauth2_scheme)):
#     # Decode the token and extract the username (sub) from the payload
#     payload = verify_token(token)
#     username = payload.get("sub")
#
#     if not username:
#         raise HTTPException(status_code=401, detail="Could not validate credentials")
#
#     # Query the user from the database
#     result = await db.execute(select(User).filter_by(username=username))
#     user = result.scalar_one_or_none()
#
#     if not user:
#         raise HTTPException(status_code=401, detail="User not found")
#
#     # Fetch the role from the 'role' table using the role_id from the user
#     role_result = await db.execute(select(Role).filter_by(id=user.role_id))
#     role = role_result.scalar_one_or_none()
#
#     if not role:
#         raise HTTPException(status_code=401, detail="Role not found")
#
#     # Return user data with the role name
#     return {
#         "username": user.username,
#         "role": role.name  # Get the role name from the role table
#     }

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