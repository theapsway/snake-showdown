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
            {"id": "6", "username": "GameWizard", "email": "wizard@game.com", "createdAt": datetime(2024, 4, 15, 8, 30, 0)},
            {"id": "7", "username": "SnakeCharmer", "email": "charmer@game.com", "createdAt": datetime(2024, 5, 1, 13, 45, 0)},
            {"id": "8", "username": "ByteBiter", "email": "byte@game.com", "createdAt": datetime(2024, 5, 20, 16, 10, 0)},
            {"id": "9", "username": "CobraKid", "email": "cobra@game.com", "createdAt": datetime(2024, 6, 5, 9, 25, 0)},
            {"id": "10", "username": "VenomViper", "email": "venom@game.com", "createdAt": datetime(2024, 6, 18, 14, 50, 0)},
            {"id": "11", "username": "PythonPro", "email": "python@game.com", "createdAt": datetime(2024, 7, 2, 11, 15, 0)},
            {"id": "12", "username": "AnacondaAce", "email": "anaconda@game.com", "createdAt": datetime(2024, 7, 15, 15, 30, 0)},
            {"id": "13", "username": "SerpentSlayer", "email": "serpent@game.com", "createdAt": datetime(2024, 8, 1, 10, 40, 0)},
            {"id": "14", "username": "ViperVictory", "email": "viper@game.com", "createdAt": datetime(2024, 8, 20, 12, 55, 0)},
            {"id": "15", "username": "RattlerRuler", "email": "rattler@game.com", "createdAt": datetime(2024, 9, 5, 9, 5, 0)},
        ]
        
        for u in mock_users:
            user = User(**u)
            self.users[user.email] = user
            self.passwords[user.email] = "password123"

        # Mock Leaderboard - Expanded with more entries
        mock_leaderboard = [
            {"id": "1", "rank": 1, "username": "SnakeMaster", "score": 2450, "gameMode": GameMode.walls, "date": date(2024, 11, 27)},
            {"id": "2", "rank": 2, "username": "PixelKing", "score": 2180, "gameMode": GameMode.pass_through, "date": date(2024, 11, 26)},
            {"id": "3", "rank": 3, "username": "RetroGamer", "score": 1950, "gameMode": GameMode.walls, "date": date(2024, 11, 28)},
            {"id": "4", "rank": 4, "username": "ArcadeQueen", "score": 1820, "gameMode": GameMode.pass_through, "date": date(2024, 11, 25)},
            {"id": "5", "rank": 5, "username": "NeonPlayer", "score": 1650, "gameMode": GameMode.walls, "date": date(2024, 11, 27)},
            {"id": "6", "rank": 6, "username": "GameWizard", "score": 1480, "gameMode": GameMode.pass_through, "date": date(2024, 11, 24)},
            {"id": "7", "rank": 7, "username": "SnakeCharmer", "score": 1320, "gameMode": GameMode.walls, "date": date(2024, 11, 23)},
            {"id": "8", "rank": 8, "username": "ByteBiter", "score": 1150, "gameMode": GameMode.pass_through, "date": date(2024, 11, 22)},
            {"id": "9", "rank": 9, "username": "CobraKid", "score": 980, "gameMode": GameMode.walls, "date": date(2024, 11, 21)},
            {"id": "10", "rank": 10, "username": "VenomViper", "score": 850, "gameMode": GameMode.pass_through, "date": date(2024, 11, 20)},
            {"id": "11", "rank": 11, "username": "PythonPro", "score": 720, "gameMode": GameMode.walls, "date": date(2024, 11, 19)},
            {"id": "12", "rank": 12, "username": "AnacondaAce", "score": 650, "gameMode": GameMode.pass_through, "date": date(2024, 11, 18)},
            {"id": "13", "rank": 13, "username": "SerpentSlayer", "score": 580, "gameMode": GameMode.walls, "date": date(2024, 11, 17)},
            {"id": "14", "rank": 14, "username": "ViperVictory", "score": 520, "gameMode": GameMode.pass_through, "date": date(2024, 11, 16)},
            {"id": "15", "rank": 15, "username": "RattlerRuler", "score": 450, "gameMode": GameMode.walls, "date": date(2024, 11, 15)},
        ]
        
        for entry in mock_leaderboard:
            self.leaderboard.append(LeaderboardEntry(**entry))

        # Mock Active Players
        self._init_active_players()

    def _init_active_players(self):
        import random
        
        def create_mock_game_state(mode: GameMode, score: int, snake_length: int) -> GameState:
            # Create a snake with varied length
            snake = []
            for i in range(snake_length):
                snake.append(SnakeSegment(
                    x=10 - i,
                    y=10,
                    dotSide='left' if i % 2 == 0 else 'right'
                ))
            
            return GameState(
                snake=snake,
                food=Position(x=random.randint(0, 19), y=random.randint(0, 19)),
                direction=random.choice([Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT]),
                score=score,
                isGameOver=False,
                isPaused=False,
                gameMode=mode,
                speed=150 - (snake_length * 5)  # Speed increases with length
            )

        mock_active = [
            {
                "id": "active-1",
                "username": "LiveSnaker",
                "gameState": create_mock_game_state(GameMode.walls, 350, 8),
                "startedAt": datetime.now()
            },
            {
                "id": "active-2",
                "username": "ProGamer99",
                "gameState": create_mock_game_state(GameMode.pass_through, 520, 12),
                "startedAt": datetime.now()
            },
            {
                "id": "active-3",
                "username": "SnakeEnthusiast",
                "gameState": create_mock_game_state(GameMode.walls, 180, 5),
                "startedAt": datetime.now()
            },
            {
                "id": "active-4",
                "username": "QuickSlither",
                "gameState": create_mock_game_state(GameMode.pass_through, 720, 15),
                "startedAt": datetime.now()
            },
            {
                "id": "active-5",
                "username": "MegaSnake",
                "gameState": create_mock_game_state(GameMode.walls, 890, 18),
                "startedAt": datetime.now()
            }
        ]

        for p in mock_active:
            player = ActivePlayer(**p)
            self.active_players[player.id] = player

db = MockDatabase()
