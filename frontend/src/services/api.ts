import {
  User,
  LeaderboardEntry,
  ActivePlayer,
  AuthResponse,
  LeaderboardResponse,
  ActivePlayersResponse,
  SubmitScoreResponse,
  GameMode,
  GameState,
  Direction,
  Position,
  SnakeSegment,
} from '@/types/game';

// Simulated delay for mock API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage
let currentUser: User | null = null;
const registeredUsers: Map<string, { user: User; password: string }> = new Map();

// Initialize with some mock users
const mockUsers = [
  { id: '1', username: 'SnakeMaster', email: 'snake@game.com', createdAt: '2024-01-15T10:00:00Z' },
  { id: '2', username: 'RetroGamer', email: 'retro@game.com', createdAt: '2024-02-20T14:30:00Z' },
  { id: '3', username: 'PixelKing', email: 'pixel@game.com', createdAt: '2024-03-10T09:15:00Z' },
  { id: '4', username: 'ArcadeQueen', email: 'arcade@game.com', createdAt: '2024-03-25T16:45:00Z' },
  { id: '5', username: 'NeonPlayer', email: 'neon@game.com', createdAt: '2024-04-01T11:20:00Z' },
];

mockUsers.forEach(user => {
  registeredUsers.set(user.email, { user, password: 'password123' });
});

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', rank: 1, username: 'SnakeMaster', score: 2450, gameMode: 'walls', date: '2024-11-27' },
  { id: '2', rank: 2, username: 'PixelKing', score: 2180, gameMode: 'pass-through', date: '2024-11-26' },
  { id: '3', rank: 3, username: 'RetroGamer', score: 1950, gameMode: 'walls', date: '2024-11-28' },
  { id: '4', rank: 4, username: 'ArcadeQueen', score: 1820, gameMode: 'pass-through', date: '2024-11-25' },
  { id: '5', rank: 5, username: 'NeonPlayer', score: 1650, gameMode: 'walls', date: '2024-11-27' },
  { id: '6', rank: 6, username: 'GameWizard', score: 1480, gameMode: 'pass-through', date: '2024-11-24' },
  { id: '7', rank: 7, username: 'SnakeCharmer', score: 1320, gameMode: 'walls', date: '2024-11-23' },
  { id: '8', rank: 8, username: 'ByteBiter', score: 1150, gameMode: 'pass-through', date: '2024-11-22' },
  { id: '9', rank: 9, username: 'CobraKid', score: 980, gameMode: 'walls', date: '2024-11-21' },
  { id: '10', rank: 10, username: 'VenomViper', score: 850, gameMode: 'pass-through', date: '2024-11-20' },
];

// Helper to create initial game state for mock players
const createMockGameState = (mode: GameMode): GameState => ({
  snake: [
    { x: 10, y: 10, dotSide: 'left' },
    { x: 9, y: 10, dotSide: 'right' },
    { x: 8, y: 10, dotSide: 'left' },
  ],
  food: { x: 15, y: 10 },
  direction: 'RIGHT',
  score: Math.floor(Math.random() * 500) + 100,
  isGameOver: false,
  isPaused: false,
  gameMode: mode,
  speed: 150,
});

// Mock active players
let mockActivePlayers: ActivePlayer[] = [
  {
    id: 'active-1',
    username: 'LiveSnaker',
    gameState: createMockGameState('walls'),
    startedAt: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: 'active-2',
    username: 'ProGamer99',
    gameState: createMockGameState('pass-through'),
    startedAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'active-3',
    username: 'SnakeEnthusiast',
    gameState: createMockGameState('walls'),
    startedAt: new Date(Date.now() - 120000).toISOString(),
  },
];

// =============================================================================
// AUTH API
// =============================================================================

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(500);
    
    const userData = registeredUsers.get(email);
    if (!userData) {
      return { success: false, error: 'User not found. Please sign up first.' };
    }
    
    if (userData.password !== password) {
      return { success: false, error: 'Invalid password.' };
    }
    
    currentUser = userData.user;
    localStorage.setItem('snake_user', JSON.stringify(currentUser));
    return { success: true, user: currentUser };
  },

  async signup(username: string, email: string, password: string): Promise<AuthResponse> {
    await delay(500);
    
    if (registeredUsers.has(email)) {
      return { success: false, error: 'Email already registered.' };
    }
    
    const existingUsername = Array.from(registeredUsers.values()).find(
      u => u.user.username.toLowerCase() === username.toLowerCase()
    );
    if (existingUsername) {
      return { success: false, error: 'Username already taken.' };
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      email,
      createdAt: new Date().toISOString(),
    };
    
    registeredUsers.set(email, { user: newUser, password });
    currentUser = newUser;
    localStorage.setItem('snake_user', JSON.stringify(currentUser));
    return { success: true, user: newUser };
  },

  async logout(): Promise<{ success: boolean }> {
    await delay(200);
    currentUser = null;
    localStorage.removeItem('snake_user');
    return { success: true };
  },

  async getCurrentUser(): Promise<AuthResponse> {
    await delay(100);
    const stored = localStorage.getItem('snake_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return { success: true, user: currentUser! };
    }
    return { success: false, error: 'Not logged in' };
  },
};

// =============================================================================
// LEADERBOARD API
// =============================================================================

export const leaderboardApi = {
  async getLeaderboard(mode?: GameMode): Promise<LeaderboardResponse> {
    await delay(300);
    
    let entries = [...mockLeaderboard];
    if (mode) {
      entries = entries.filter(e => e.gameMode === mode);
    }
    
    // Re-rank after filtering
    entries = entries.map((e, i) => ({ ...e, rank: i + 1 }));
    
    return { success: true, entries };
  },

  async submitScore(score: number, gameMode: GameMode): Promise<SubmitScoreResponse> {
    await delay(400);
    
    if (!currentUser) {
      return { success: false, error: 'Must be logged in to submit score' };
    }
    
    const newEntry: LeaderboardEntry = {
      id: `entry-${Date.now()}`,
      rank: 0,
      username: currentUser.username,
      score,
      gameMode,
      date: new Date().toISOString().split('T')[0],
    };
    
    mockLeaderboard.push(newEntry);
    mockLeaderboard.sort((a, b) => b.score - a.score);
    mockLeaderboard.forEach((e, i) => e.rank = i + 1);
    
    newEntry.rank = mockLeaderboard.findIndex(e => e.id === newEntry.id) + 1;
    
    return { success: true, entry: newEntry };
  },
};

// =============================================================================
// SPECTATE API
// =============================================================================

export const spectateApi = {
  async getActivePlayers(): Promise<ActivePlayersResponse> {
    await delay(200);
    return { success: true, players: mockActivePlayers };
  },

  async getPlayerGameState(playerId: string): Promise<{ success: boolean; gameState?: GameState; error?: string }> {
    await delay(100);
    
    const player = mockActivePlayers.find(p => p.id === playerId);
    if (!player) {
      return { success: false, error: 'Player not found or no longer playing' };
    }
    
    return { success: true, gameState: player.gameState };
  },

  // This simulates a live game update for spectating
  simulateGameUpdate(playerId: string): GameState | null {
    const player = mockActivePlayers.find(p => p.id === playerId);
    if (!player) return null;

    const state = player.gameState;
    const head = state.snake[0];
    
    // Simple AI: move toward food with some randomness
    const dx = state.food.x - head.x;
    const dy = state.food.y - head.y;
    
    let newDirection: Direction = state.direction;
    
    // 70% chance to move toward food, 30% random
    if (Math.random() > 0.3) {
      if (Math.abs(dx) > Math.abs(dy)) {
        newDirection = dx > 0 ? 'RIGHT' : 'LEFT';
      } else {
        newDirection = dy > 0 ? 'DOWN' : 'UP';
      }
    } else {
      const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
      newDirection = directions[Math.floor(Math.random() * 4)];
    }
    
    // Prevent 180-degree turns
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT'
    };
    if (newDirection === opposites[state.direction]) {
      newDirection = state.direction;
    }
    
    state.direction = newDirection;
    
    // Calculate new head position
    const directionMap: Record<Direction, Position> = {
      UP: { x: 0, y: -1 },
      DOWN: { x: 0, y: 1 },
      LEFT: { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 },
    };
    
    const move = directionMap[state.direction];
    let newX = head.x + move.x;
    let newY = head.y + move.y;
    
    const GRID_SIZE = 20;
    
    // Handle boundaries based on game mode
    if (state.gameMode === 'pass-through') {
      newX = (newX + GRID_SIZE) % GRID_SIZE;
      newY = (newY + GRID_SIZE) % GRID_SIZE;
    } else {
      if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
        state.isGameOver = true;
        return state;
      }
    }
    
    // Check self collision
    if (state.snake.some(s => s.x === newX && s.y === newY)) {
      state.isGameOver = true;
      return state;
    }
    
    // Determine dot side (alternating)
    const lastDotSide = state.snake[0].dotSide;
    const newDotSide: 'left' | 'right' = lastDotSide === 'left' ? 'right' : 'left';
    
    const newHead: SnakeSegment = { x: newX, y: newY, dotSide: newDotSide };
    
    // Check food collision
    const ateFood = newX === state.food.x && newY === state.food.y;
    
    if (ateFood) {
      state.snake = [newHead, ...state.snake];
      state.score += 10;
      // Generate new food
      let newFoodPos: Position;
      do {
        newFoodPos = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        };
      } while (state.snake.some(s => s.x === newFoodPos.x && s.y === newFoodPos.y));
      state.food = newFoodPos;
    } else {
      state.snake = [newHead, ...state.snake.slice(0, -1)];
    }
    
    return state;
  },
};

// Initialize mock active players with periodic updates
let updateInterval: number | null = null;

export const startMockPlayerUpdates = () => {
  if (updateInterval) return;
  
  updateInterval = window.setInterval(() => {
    mockActivePlayers.forEach(player => {
      if (!player.gameState.isGameOver) {
        spectateApi.simulateGameUpdate(player.id);
      } else {
        // Restart the game for mock players
        player.gameState = createMockGameState(player.gameState.gameMode);
      }
    });
  }, 200);
};

export const stopMockPlayerUpdates = () => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
};
