from fastapi import APIRouter, Query
from typing import Optional
from datetime import date, datetime
from ..models import LeaderboardResponse, SubmitScoreResponse, SubmitScoreRequest, GameMode, LeaderboardEntry
from ..database import db

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("", response_model=LeaderboardResponse)
async def get_leaderboard(mode: Optional[GameMode] = None):
    entries = db.leaderboard
    if mode:
        entries = [e for e in entries if e.gameMode == mode]
    
    # Sort by score descending
    entries.sort(key=lambda x: x.score, reverse=True)
    
    # Re-rank
    for i, entry in enumerate(entries):
        entry.rank = i + 1
        
    return LeaderboardResponse(success=True, entries=entries)

@router.post("", response_model=SubmitScoreResponse)
async def submit_score(request: SubmitScoreRequest):
    # In a real app, we would get the user from the session/token
    # For this mock, we'll assume a default user if not logged in, or error
    # Since we don't have auth middleware yet, let's mock a user for now or error
    
    # For simplicity in this mock, let's assume we can't submit without auth
    # But since we can't easily auth, let's allow it for now with a placeholder user
    # or just return error as per spec requirements "Must be logged in"
    
    return SubmitScoreResponse(success=False, error="Must be logged in to submit score")
