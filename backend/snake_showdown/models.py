from datetime import date, datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class GameMode(str, Enum):
    pass_through = "pass-through"
    walls = "walls"

class Direction(str, Enum):
    UP = "UP"
    DOWN = "DOWN"
    LEFT = "LEFT"
    RIGHT = "RIGHT"

class Position(BaseModel):
    x: int
    y: int

class SnakeSegment(Position):
    dotSide: str  # 'left' | 'right'

class GameState(BaseModel):
    snake: List[SnakeSegment]
    food: Position
    direction: Direction
    score: int
    isGameOver: bool
    isPaused: bool
    gameMode: GameMode
    speed: int

class User(BaseModel):
    id: str
    username: str
    email: EmailStr
    createdAt: datetime

class LeaderboardEntry(BaseModel):
    id: str
    rank: int
    username: str
    score: int
    gameMode: GameMode
    date: date

class ActivePlayer(BaseModel):
    id: str
    username: str
    gameState: GameState
    startedAt: datetime

class AuthResponse(BaseModel):
    success: bool
    user: Optional[User] = None
    error: Optional[str] = None

class LeaderboardResponse(BaseModel):
    success: bool
    entries: List[LeaderboardEntry]
    error: Optional[str] = None

class ActivePlayersResponse(BaseModel):
    success: bool
    players: List[ActivePlayer]
    error: Optional[str] = None

class SubmitScoreResponse(BaseModel):
    success: bool
    entry: Optional[LeaderboardEntry] = None
    error: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class SubmitScoreRequest(BaseModel):
    score: int
    gameMode: GameMode
