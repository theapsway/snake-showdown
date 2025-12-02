from datetime import datetime, date
from typing import Dict, List, Optional
from .models import User, LeaderboardEntry, ActivePlayer, GameMode, GameState, Direction, Position, SnakeSegment

class MockDatabase:
    def __init__(self):
        self.users: Dict[str, User] = {}
        self.passwords: Dict[str, str] = {}  # email -> password
        self.leaderboard: List[LeaderboardEntry] = []
        self.active_players: Dict[str, ActivePlayer] = {}
        self._init_mock_data()

    def _init_mock_data(self):
        # Mock Users
        mock_users = [
            {"id": "1", "username": "SnakeMaster", "email": "snake@game.com", "createdAt": datetime(2024, 1, 15, 10, 0, 0)},
            {"id": "2", "username": "RetroGamer", "email": "retro@game.com", "createdAt": datetime(2024, 2, 20, 14, 30, 0)},
            {"id": "3", "username": "PixelKing", "email": "pixel@game.com", "createdAt": datetime(2024, 3, 10, 9, 15, 0)},
            {"id": "4", "username": "ArcadeQueen", "email": "arcade@game.com", "createdAt": datetime(2024, 3, 25, 16, 45, 0)},
            {"id": "5", "username": "NeonPlayer", "email": "neon@game.com", "createdAt": datetime(2024, 4, 1, 11, 20, 0)},
        ]
        
        for u in mock_users:
            user = User(**u)
            self.users[user.email] = user
            self.passwords[user.email] = "password123"

        # Mock Leaderboard
        mock_leaderboard = [
            {"id": "1", "rank": 1, "username": "SnakeMaster", "score": 2450, "gameMode": GameMode.walls, "date": date(2024, 11, 27)},
            {"id": "2", "rank": 2, "username": "PixelKing", "score": 2180, "gameMode": GameMode.pass_through, "date": date(2024, 11, 26)},
            {"id": "3", "rank": 3, "username": "RetroGamer", "score": 1950, "gameMode": GameMode.walls, "date": date(2024, 11, 28)},
            {"id": "4", "rank": 4, "username": "ArcadeQueen", "score": 1820, "gameMode": GameMode.pass_through, "date": date(2024, 11, 25)},
            {"id": "5", "rank": 5, "username": "NeonPlayer", "score": 1650, "gameMode": GameMode.walls, "date": date(2024, 11, 27)},
        ]
        
        for entry in mock_leaderboard:
            self.leaderboard.append(LeaderboardEntry(**entry))

        # Mock Active Players
        self._init_active_players()

    def _init_active_players(self):
        def create_mock_game_state(mode: GameMode) -> GameState:
            return GameState(
                snake=[
                    SnakeSegment(x=10, y=10, dotSide='left'),
                    SnakeSegment(x=9, y=10, dotSide='right'),
                    SnakeSegment(x=8, y=10, dotSide='left'),
                ],
                food=Position(x=15, y=10),
                direction=Direction.RIGHT,
                score=100,
                isGameOver=False,
                isPaused=False,
                gameMode=mode,
                speed=150
            )

        mock_active = [
            {
                "id": "active-1",
                "username": "LiveSnaker",
                "gameState": create_mock_game_state(GameMode.walls),
                "startedAt": datetime.now()
            },
            {
                "id": "active-2",
                "username": "ProGamer99",
                "gameState": create_mock_game_state(GameMode.pass_through),
                "startedAt": datetime.now()
            }
        ]

        for p in mock_active:
            player = ActivePlayer(**p)
            self.active_players[player.id] = player

db = MockDatabase()
