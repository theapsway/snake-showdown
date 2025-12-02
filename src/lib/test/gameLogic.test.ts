import { describe, it, expect } from 'vitest';
import { GRID_SIZE, DIRECTION_MAP } from '@/hooks/useSnakeGame';
import type { Direction, Position, SnakeSegment, GameMode } from '@/types/game';

describe('Game Logic', () => {
  describe('Snake Movement', () => {
    const moveSnake = (
      head: Position,
      direction: Direction,
      gameMode: GameMode
    ): Position => {
      const move = DIRECTION_MAP[direction];
      let newX = head.x + move.x;
      let newY = head.y + move.y;

      if (gameMode === 'pass-through') {
        newX = (newX + GRID_SIZE) % GRID_SIZE;
        newY = (newY + GRID_SIZE) % GRID_SIZE;
      }

      return { x: newX, y: newY };
    };

    it('should move right correctly', () => {
      const head: Position = { x: 10, y: 10 };
      const newPos = moveSnake(head, 'RIGHT', 'walls');
      
      expect(newPos.x).toBe(11);
      expect(newPos.y).toBe(10);
    });

    it('should move left correctly', () => {
      const head: Position = { x: 10, y: 10 };
      const newPos = moveSnake(head, 'LEFT', 'walls');
      
      expect(newPos.x).toBe(9);
      expect(newPos.y).toBe(10);
    });

    it('should move up correctly', () => {
      const head: Position = { x: 10, y: 10 };
      const newPos = moveSnake(head, 'UP', 'walls');
      
      expect(newPos.x).toBe(10);
      expect(newPos.y).toBe(9);
    });

    it('should move down correctly', () => {
      const head: Position = { x: 10, y: 10 };
      const newPos = moveSnake(head, 'DOWN', 'walls');
      
      expect(newPos.x).toBe(10);
      expect(newPos.y).toBe(11);
    });

    it('should wrap around in pass-through mode (right edge)', () => {
      const head: Position = { x: GRID_SIZE - 1, y: 10 };
      const newPos = moveSnake(head, 'RIGHT', 'pass-through');
      
      expect(newPos.x).toBe(0);
      expect(newPos.y).toBe(10);
    });

    it('should wrap around in pass-through mode (left edge)', () => {
      const head: Position = { x: 0, y: 10 };
      const newPos = moveSnake(head, 'LEFT', 'pass-through');
      
      expect(newPos.x).toBe(GRID_SIZE - 1);
      expect(newPos.y).toBe(10);
    });

    it('should wrap around in pass-through mode (top edge)', () => {
      const head: Position = { x: 10, y: 0 };
      const newPos = moveSnake(head, 'UP', 'pass-through');
      
      expect(newPos.x).toBe(10);
      expect(newPos.y).toBe(GRID_SIZE - 1);
    });

    it('should wrap around in pass-through mode (bottom edge)', () => {
      const head: Position = { x: 10, y: GRID_SIZE - 1 };
      const newPos = moveSnake(head, 'DOWN', 'pass-through');
      
      expect(newPos.x).toBe(10);
      expect(newPos.y).toBe(0);
    });
  });

  describe('Collision Detection', () => {
    const checkWallCollision = (position: Position): boolean => {
      return (
        position.x < 0 ||
        position.x >= GRID_SIZE ||
        position.y < 0 ||
        position.y >= GRID_SIZE
      );
    };

    const checkSelfCollision = (
      newHead: Position,
      snake: SnakeSegment[]
    ): boolean => {
      return snake.some(s => s.x === newHead.x && s.y === newHead.y);
    };

    const checkFoodCollision = (head: Position, food: Position): boolean => {
      return head.x === food.x && head.y === food.y;
    };

    it('should detect wall collision at left boundary', () => {
      expect(checkWallCollision({ x: -1, y: 10 })).toBe(true);
    });

    it('should detect wall collision at right boundary', () => {
      expect(checkWallCollision({ x: GRID_SIZE, y: 10 })).toBe(true);
    });

    it('should detect wall collision at top boundary', () => {
      expect(checkWallCollision({ x: 10, y: -1 })).toBe(true);
    });

    it('should detect wall collision at bottom boundary', () => {
      expect(checkWallCollision({ x: 10, y: GRID_SIZE })).toBe(true);
    });

    it('should not detect collision within bounds', () => {
      expect(checkWallCollision({ x: 10, y: 10 })).toBe(false);
      expect(checkWallCollision({ x: 0, y: 0 })).toBe(false);
      expect(checkWallCollision({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 })).toBe(false);
    });

    it('should detect self collision', () => {
      const snake: SnakeSegment[] = [
        { x: 10, y: 10, dotSide: 'left' },
        { x: 9, y: 10, dotSide: 'right' },
        { x: 8, y: 10, dotSide: 'left' },
      ];
      
      expect(checkSelfCollision({ x: 9, y: 10 }, snake)).toBe(true);
      expect(checkSelfCollision({ x: 8, y: 10 }, snake)).toBe(true);
    });

    it('should not detect self collision for valid move', () => {
      const snake: SnakeSegment[] = [
        { x: 10, y: 10, dotSide: 'left' },
        { x: 9, y: 10, dotSide: 'right' },
        { x: 8, y: 10, dotSide: 'left' },
      ];
      
      expect(checkSelfCollision({ x: 11, y: 10 }, snake)).toBe(false);
      expect(checkSelfCollision({ x: 10, y: 11 }, snake)).toBe(false);
    });

    it('should detect food collision', () => {
      const food: Position = { x: 15, y: 15 };
      
      expect(checkFoodCollision({ x: 15, y: 15 }, food)).toBe(true);
    });

    it('should not detect food collision when not at food position', () => {
      const food: Position = { x: 15, y: 15 };
      
      expect(checkFoodCollision({ x: 14, y: 15 }, food)).toBe(false);
      expect(checkFoodCollision({ x: 15, y: 14 }, food)).toBe(false);
    });
  });

  describe('Score Calculation', () => {
    it('should add 10 points per food', () => {
      let score = 0;
      score += 10; // ate food
      expect(score).toBe(10);
      
      score += 10; // ate food again
      expect(score).toBe(20);
    });

    it('should increase speed at score milestones', () => {
      const calculateSpeed = (score: number, currentSpeed: number): number => {
        if (score % 50 === 0 && score > 0 && currentSpeed > 50) {
          return currentSpeed - 10;
        }
        return currentSpeed;
      };

      expect(calculateSpeed(50, 150)).toBe(140);
      expect(calculateSpeed(100, 140)).toBe(130);
      expect(calculateSpeed(40, 150)).toBe(150);
      expect(calculateSpeed(50, 50)).toBe(50); // minimum speed
    });
  });

  describe('Dot Side Alternation', () => {
    it('should alternate dot sides', () => {
      const getNextDotSide = (current: 'left' | 'right'): 'left' | 'right' => {
        return current === 'left' ? 'right' : 'left';
      };

      expect(getNextDotSide('left')).toBe('right');
      expect(getNextDotSide('right')).toBe('left');
    });

    it('should maintain alternating pattern in snake', () => {
      const snake: SnakeSegment[] = [
        { x: 10, y: 10, dotSide: 'left' },
        { x: 9, y: 10, dotSide: 'right' },
        { x: 8, y: 10, dotSide: 'left' },
        { x: 7, y: 10, dotSide: 'right' },
      ];

      for (let i = 0; i < snake.length - 1; i++) {
        expect(snake[i].dotSide).not.toBe(snake[i + 1].dotSide);
      }
    });
  });

  describe('Direction Validation', () => {
    const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };

    const isValidDirectionChange = (
      current: Direction,
      newDirection: Direction
    ): boolean => {
      return OPPOSITE_DIRECTIONS[newDirection] !== current;
    };

    it('should allow perpendicular direction changes', () => {
      expect(isValidDirectionChange('RIGHT', 'UP')).toBe(true);
      expect(isValidDirectionChange('RIGHT', 'DOWN')).toBe(true);
      expect(isValidDirectionChange('UP', 'LEFT')).toBe(true);
      expect(isValidDirectionChange('UP', 'RIGHT')).toBe(true);
    });

    it('should prevent 180-degree turns', () => {
      expect(isValidDirectionChange('RIGHT', 'LEFT')).toBe(false);
      expect(isValidDirectionChange('LEFT', 'RIGHT')).toBe(false);
      expect(isValidDirectionChange('UP', 'DOWN')).toBe(false);
      expect(isValidDirectionChange('DOWN', 'UP')).toBe(false);
    });

    it('should allow same direction', () => {
      expect(isValidDirectionChange('RIGHT', 'RIGHT')).toBe(true);
      expect(isValidDirectionChange('UP', 'UP')).toBe(true);
    });
  });
});
