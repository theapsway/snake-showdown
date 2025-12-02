import { describe, it, expect } from 'vitest';
import type {
  Direction,
  GameMode,
  Position,
  SnakeSegment,
  GameState,
  User,
  LeaderboardEntry,
  ActivePlayer,
} from '@/types/game';

describe('Game Types', () => {
  describe('Direction type', () => {
    it('should allow valid directions', () => {
      const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
      expect(directions).toHaveLength(4);
    });
  });

  describe('GameMode type', () => {
    it('should allow valid game modes', () => {
      const modes: GameMode[] = ['pass-through', 'walls'];
      expect(modes).toHaveLength(2);
    });
  });

  describe('Position interface', () => {
    it('should have x and y coordinates', () => {
      const position: Position = { x: 10, y: 20 };
      expect(position.x).toBe(10);
      expect(position.y).toBe(20);
    });
  });

  describe('SnakeSegment interface', () => {
    it('should extend Position with dotSide', () => {
      const segment: SnakeSegment = { x: 5, y: 5, dotSide: 'left' };
      expect(segment.x).toBe(5);
      expect(segment.y).toBe(5);
      expect(segment.dotSide).toBe('left');
    });

    it('should allow both left and right dotSide', () => {
      const leftSegment: SnakeSegment = { x: 0, y: 0, dotSide: 'left' };
      const rightSegment: SnakeSegment = { x: 0, y: 0, dotSide: 'right' };
      
      expect(leftSegment.dotSide).toBe('left');
      expect(rightSegment.dotSide).toBe('right');
    });
  });

  describe('GameState interface', () => {
    it('should have all required properties', () => {
      const gameState: GameState = {
        snake: [{ x: 10, y: 10, dotSide: 'left' }],
        food: { x: 5, y: 5 },
        direction: 'RIGHT',
        score: 0,
        isGameOver: false,
        isPaused: false,
        gameMode: 'walls',
        speed: 150,
      };
      
      expect(gameState.snake).toHaveLength(1);
      expect(gameState.food).toBeDefined();
      expect(gameState.direction).toBe('RIGHT');
      expect(gameState.score).toBe(0);
      expect(gameState.isGameOver).toBe(false);
      expect(gameState.isPaused).toBe(false);
      expect(gameState.gameMode).toBe('walls');
      expect(gameState.speed).toBe(150);
    });
  });

  describe('User interface', () => {
    it('should have all required properties', () => {
      const user: User = {
        id: '123',
        username: 'TestUser',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00Z',
      };
      
      expect(user.id).toBe('123');
      expect(user.username).toBe('TestUser');
      expect(user.email).toBe('test@example.com');
      expect(user.createdAt).toBeDefined();
    });
  });

  describe('LeaderboardEntry interface', () => {
    it('should have all required properties', () => {
      const entry: LeaderboardEntry = {
        id: '1',
        rank: 1,
        username: 'Champion',
        score: 1000,
        gameMode: 'walls',
        date: '2024-11-28',
      };
      
      expect(entry.id).toBe('1');
      expect(entry.rank).toBe(1);
      expect(entry.username).toBe('Champion');
      expect(entry.score).toBe(1000);
      expect(entry.gameMode).toBe('walls');
      expect(entry.date).toBeDefined();
    });
  });

  describe('ActivePlayer interface', () => {
    it('should have all required properties', () => {
      const player: ActivePlayer = {
        id: 'player-1',
        username: 'LivePlayer',
        gameState: {
          snake: [{ x: 10, y: 10, dotSide: 'left' }],
          food: { x: 15, y: 15 },
          direction: 'UP',
          score: 50,
          isGameOver: false,
          isPaused: false,
          gameMode: 'pass-through',
          speed: 150,
        },
        startedAt: '2024-11-28T10:00:00Z',
      };
      
      expect(player.id).toBe('player-1');
      expect(player.username).toBe('LivePlayer');
      expect(player.gameState).toBeDefined();
      expect(player.startedAt).toBeDefined();
    });
  });
});
