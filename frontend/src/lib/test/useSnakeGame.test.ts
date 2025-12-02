import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  generateFood,
  GRID_SIZE,
  DIRECTION_MAP,
  OPPOSITE_DIRECTIONS,
} from '@/hooks/useSnakeGame';

describe('useSnakeGame utilities', () => {
  describe('createInitialState', () => {
    it('should create initial state with walls mode', () => {
      const state = createInitialState('walls');
      
      expect(state.gameMode).toBe('walls');
      expect(state.snake).toHaveLength(3);
      expect(state.score).toBe(0);
      expect(state.isGameOver).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.direction).toBe('RIGHT');
      expect(state.speed).toBe(150);
    });

    it('should create initial state with pass-through mode', () => {
      const state = createInitialState('pass-through');
      
      expect(state.gameMode).toBe('pass-through');
      expect(state.snake).toHaveLength(3);
    });

    it('should have valid food position', () => {
      const state = createInitialState('walls');
      
      expect(state.food.x).toBeGreaterThanOrEqual(0);
      expect(state.food.x).toBeLessThan(GRID_SIZE);
      expect(state.food.y).toBeGreaterThanOrEqual(0);
      expect(state.food.y).toBeLessThan(GRID_SIZE);
    });

    it('should have snake segments with alternating dot sides', () => {
      const state = createInitialState('walls');
      
      expect(state.snake[0].dotSide).toBe('left');
      expect(state.snake[1].dotSide).toBe('right');
      expect(state.snake[2].dotSide).toBe('left');
    });
  });

  describe('generateFood', () => {
    it('should generate food not on snake', () => {
      const snake = [
        { x: 10, y: 10, dotSide: 'left' as const },
        { x: 9, y: 10, dotSide: 'right' as const },
        { x: 8, y: 10, dotSide: 'left' as const },
      ];
      
      for (let i = 0; i < 100; i++) {
        const food = generateFood(snake);
        const isOnSnake = snake.some(s => s.x === food.x && s.y === food.y);
        expect(isOnSnake).toBe(false);
      }
    });

    it('should generate food within grid bounds', () => {
      const snake = [{ x: 0, y: 0, dotSide: 'left' as const }];
      
      for (let i = 0; i < 100; i++) {
        const food = generateFood(snake);
        expect(food.x).toBeGreaterThanOrEqual(0);
        expect(food.x).toBeLessThan(GRID_SIZE);
        expect(food.y).toBeGreaterThanOrEqual(0);
        expect(food.y).toBeLessThan(GRID_SIZE);
      }
    });
  });

  describe('DIRECTION_MAP', () => {
    it('should have correct direction vectors', () => {
      expect(DIRECTION_MAP.UP).toEqual({ x: 0, y: -1 });
      expect(DIRECTION_MAP.DOWN).toEqual({ x: 0, y: 1 });
      expect(DIRECTION_MAP.LEFT).toEqual({ x: -1, y: 0 });
      expect(DIRECTION_MAP.RIGHT).toEqual({ x: 1, y: 0 });
    });
  });

  describe('OPPOSITE_DIRECTIONS', () => {
    it('should have correct opposite mappings', () => {
      expect(OPPOSITE_DIRECTIONS.UP).toBe('DOWN');
      expect(OPPOSITE_DIRECTIONS.DOWN).toBe('UP');
      expect(OPPOSITE_DIRECTIONS.LEFT).toBe('RIGHT');
      expect(OPPOSITE_DIRECTIONS.RIGHT).toBe('LEFT');
    });
  });

  describe('GRID_SIZE', () => {
    it('should be 20', () => {
      expect(GRID_SIZE).toBe(20);
    });
  });
});
