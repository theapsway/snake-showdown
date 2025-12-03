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
} from '@/types/game';

// API Base URL
const API_BASE_URL = 'http://localhost:8000';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// =============================================================================
// AUTH API
// =============================================================================

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async signup(username: string, email: string, password: string): Promise<AuthResponse> {
    return apiCall<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  async logout(): Promise<{ success: boolean }> {
    return apiCall<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    });
  },

  async getCurrentUser(): Promise<AuthResponse> {
    return apiCall<AuthResponse>('/auth/me');
  },
};

// =============================================================================
// LEADERBOARD API
// =============================================================================

export const leaderboardApi = {
  async getLeaderboard(mode?: GameMode): Promise<LeaderboardResponse> {
    const queryParam = mode ? `?mode=${mode}` : '';
    return apiCall<LeaderboardResponse>(`/leaderboard${queryParam}`);
  },

  async submitScore(score: number, gameMode: GameMode): Promise<SubmitScoreResponse> {
    return apiCall<SubmitScoreResponse>('/leaderboard', {
      method: 'POST',
      body: JSON.stringify({ score, gameMode }),
    });
  },
};

// =============================================================================
// SPECTATE API
// =============================================================================

export const spectateApi = {
  async getActivePlayers(): Promise<ActivePlayersResponse> {
    return apiCall<ActivePlayersResponse>('/spectate/active');
  },

  async getPlayerGameState(playerId: string): Promise<{ success: boolean; gameState?: GameState; error?: string }> {
    return apiCall<{ success: boolean; gameState?: GameState; error?: string }>(`/spectate/${playerId}`);
  },

  // This simulates a live game update for spectating
  // In a real implementation, this would use WebSockets
  simulateGameUpdate(playerId: string): GameState | null {
    // This is a client-side simulation and doesn't need backend integration
    // In production, you'd use WebSockets to get real-time updates
    return null;
  },
};

// Mock player updates are not needed with real backend
export const startMockPlayerUpdates = () => {
  // No-op - backend handles this
};

export const stopMockPlayerUpdates = () => {
  // No-op - backend handles this
};
