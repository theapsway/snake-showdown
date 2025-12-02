from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from ..models import AuthResponse, LoginRequest, SignupRequest, User
from ..database import db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    user = db.users.get(request.email)
    if not user:
        return AuthResponse(success=False, error="User not found. Please sign up first.")
    
    if db.passwords.get(request.email) != request.password:
        return AuthResponse(success=False, error="Invalid password.")
    
    return AuthResponse(success=True, user=user)

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    if request.email in db.users:
        return AuthResponse(success=False, error="Email already registered.")
    
    for user in db.users.values():
        if user.username.lower() == request.username.lower():
            return AuthResponse(success=False, error="Username already taken.")
    
    new_user = User(
        id=f"user-{int(datetime.now().timestamp())}",
        username=request.username,
        email=request.email,
        createdAt=datetime.now()
    )
    
    db.users[new_user.email] = new_user
    db.passwords[new_user.email] = request.password
    
    return AuthResponse(success=True, user=new_user)

@router.post("/logout")
async def logout():
    return {"success": True}

@router.get("/me", response_model=AuthResponse)
async def get_current_user():
    # In a real app, we would get the user from the session/token
    # For this mock, we'll just return an error as we don't have session management
    return AuthResponse(success=False, error="Not logged in")
