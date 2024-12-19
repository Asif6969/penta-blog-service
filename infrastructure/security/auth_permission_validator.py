from urllib.request import Request

from fastapi import HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED
import jwt
SECRET_KEY = "1fd26fc70cb30cddcc77020a29a1c70db62ef9c6c5707b1a371237bff5a328b5"


class AuthPermissionValidator:
    @staticmethod
    async def validate_permission(request: Request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid token",
            )

        token = auth_header.split(" ")[1]

        # Token validation logic (e.g., decode JWT)
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return payload
            # Additional permission checks can go here
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token")