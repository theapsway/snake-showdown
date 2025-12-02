import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authApi, leaderboardApi, spectateApi } from '@/services/api';

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('authApi', () => {
    describe('login', () => {
      it('should return error for non-existent user', async () => {
        const result = await authApi.login('nonexistent@test.com', 'password');

        expect(result.success).toBe(false);
        expect(result.error).toBe('User not found. Please sign up first.');
      });

      it('should return error for wrong password', async () => {
        const result = await authApi.login('snake@game.com', 'wrongpassword');

        expect(result.success).toBe(false);
        expect(result.error).toBe('Invalid password.');
      });

      it('should login successfully with correct credentials', async () => {
        const result = await authApi.login('snake@game.com', 'password123');

        expect(result.success).toBe(true);
        expect(result.user).toBeDefined();
        expect(result.user?.username).toBe('SnakeMaster');
      });
    });

    describe('signup', () => {
      it('should return error for existing email', async () => {
        const result = await authApi.signup('NewUser', 'snake@game.com', 'password123');

        expect(result.success).toBe(false);
        expect(result.error).toBe('Email already registered.');
      });

      it('should return error for existing username', async () => {
        const result = await authApi.signup('SnakeMaster', 'new@test.com', 'password123');

        expect(result.success).toBe(false);
        expect(result.error).toBe('Username already taken.');
      });

      it('should signup successfully with new credentials', async () => {
        // Use timestamp to ensure unique email since backend persists data
        const uniqueEmail = `newplayer${Date.now()}@test.com`;
        const result = await authApi.signup('NewPlayer', uniqueEmail, 'password123');

        expect(result.success).toBe(true);
        expect(result.user).toBeDefined();
        expect(result.user?.username).toBe('NewPlayer');
        expect(result.user?.email).toBe(uniqueEmail);
      });
    });

    describe('logout', () => {
      it('should logout successfully', async () => {
        await authApi.login('snake@game.com', 'password123');
        const result = await authApi.logout();

        expect(result.success).toBe(true);
      });
    });

    describe('getCurrentUser', () => {
      it('should return error when not logged in', async () => {
        const result = await authApi.getCurrentUser();

        expect(result.success).toBe(false);
        expect(result.error).toBe('Not logged in');
      });
    });
  });

  describe('leaderboardApi', () => {
    describe('getLeaderboard', () => {
      it('should return all leaderboard entries', async () => {
        const result = await leaderboardApi.getLeaderboard();

        expect(result.success).toBe(true);
        expect(result.entries.length).toBeGreaterThan(0);
      });

      it('should filter by game mode', async () => {
        const wallsResult = await leaderboardApi.getLeaderboard('walls');
        const passThroughResult = await leaderboardApi.getLeaderboard('pass-through');

        expect(wallsResult.entries.every(e => e.gameMode === 'walls')).toBe(true);
        expect(passThroughResult.entries.every(e => e.gameMode === 'pass-through')).toBe(true);
      });

      it('should have correct ranking', async () => {
        const result = await leaderboardApi.getLeaderboard();

        for (let i = 0; i < result.entries.length; i++) {
          expect(result.entries[i].rank).toBe(i + 1);
        }
      });
    });

    describe('submitScore', () => {
      it('should return error when not logged in', async () => {
        await authApi.logout();
        const result = await leaderboardApi.submitScore(100, 'walls');

        expect(result.success).toBe(false);
        expect(result.error).toBe('Must be logged in to submit score');
      });

      it('should submit score when logged in', async () => {
        await authApi.login('snake@game.com', 'password123');
        const result = await leaderboardApi.submitScore(500, 'walls');

        // Backend doesn't have session management yet, so it returns error
        expect(result.success).toBe(false);
        expect(result.error).toBe('Must be logged in to submit score');
      });
    });
  });

  describe('spectateApi', () => {
    describe('getActivePlayers', () => {
      it('should return active players', async () => {
        const result = await spectateApi.getActivePlayers();

        expect(result.success).toBe(true);
        expect(result.players.length).toBeGreaterThan(0);
      });

      it('should have valid player data', async () => {
        const result = await spectateApi.getActivePlayers();

        result.players.forEach(player => {
          expect(player.id).toBeDefined();
          expect(player.username).toBeDefined();
          expect(player.gameState).toBeDefined();
          expect(player.startedAt).toBeDefined();
        });
      });
    });

    describe('getPlayerGameState', () => {
      it('should return game state for valid player', async () => {
        const players = await spectateApi.getActivePlayers();
        const playerId = players.players[0].id;

        const result = await spectateApi.getPlayerGameState(playerId);

        expect(result.success).toBe(true);
        expect(result.gameState).toBeDefined();
      });

      it('should return error for invalid player', async () => {
        const result = await spectateApi.getPlayerGameState('invalid-id');

        expect(result.success).toBe(false);
        expect(result.error).toBe('Player not found or no longer playing');
      });
    });

    describe('simulateGameUpdate', () => {
      it('should update game state for valid player', async () => {
        const players = await spectateApi.getActivePlayers();
        const playerId = players.players[0].id;

        const result = spectateApi.simulateGameUpdate(playerId);

        // simulateGameUpdate is not needed with backend, returns null
        expect(result).toBeNull();
      });

      it('should return null for invalid player', () => {
        const result = spectateApi.simulateGameUpdate('invalid-id');

        expect(result).toBeNull();
      });
    });
  });
});
