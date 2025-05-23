# backend/routers/protected.py
from fastapi import APIRouter, Depends, HTTPException, Request
from utils import verify_token

router = APIRouter()

@router.get("/protected")
def protected_route(request: Request):
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token")

    token = auth.split(" ")[1]
    decoded = verify_token(token)
    return {"message": "Access granted", "user": decoded}
