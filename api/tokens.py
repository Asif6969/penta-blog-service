from fastapi import APIRouter, HTTPException, Request, Response
from api.utils.jwt_util import create_access_token, validate_refresh_token
from jose import jwt, JWTError, ExpiredSignatureError

router = APIRouter(prefix="/penta-blog/api")

@router.post("/refresh-token")
def refresh_token_access(request: Request, response: Response):
    # Retrieve the refresh token from the HTTP-only cookie
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token is missing")

    try:
        # Validate and decode the refresh token
        payload = validate_refresh_token(refresh_token)
        user_id = payload.get("id")
        username = payload.get("sub")
        role = payload.get("role")

        if not user_id or not username:
            raise HTTPException(status_code=401, detail="Invalid refresh token payload")

        # Create a new access token
        new_access_token = create_access_token(
            {"id": user_id, "sub": username, "role": role}
        )

        return {"access_token": new_access_token, "token_type": "bearer"}

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token has expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
