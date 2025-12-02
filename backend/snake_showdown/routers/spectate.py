from fastapi import APIRouter, HTTPException
from ..models import ActivePlayersResponse, GameState
from ..database import db

router = APIRouter(prefix="/spectate", tags=["spectate"])

@router.get("/active", response_model=ActivePlayersResponse)
async def get_active_players():
    return ActivePlayersResponse(success=True, players=list(db.active_players.values()))

@router.get("/{player_id}")
async def get_player_game_state(player_id: str):
    player = db.active_players.get(player_id)
    if not player:
        return {"success": False, "error": "Player not found or no longer playing"}
    
    return {"success": True, "gameState": player.gameState}
