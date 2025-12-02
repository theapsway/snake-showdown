import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Direction, Position, SnakeSegment, GameMode } from '@/types/game';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

const DIRECTION_MAP: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

const createInitialSnake = (): SnakeSegment[] => [
  { x: 10, y: 10, dotSide: 'left' },
  { x: 9, y: 10, dotSide: 'right' },
  { x: 8, y: 10, dotSide: 'left' },
];

const generateFood = (snake: SnakeSegment[]): Position => {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
  return food;
};

const createInitialState = (mode: GameMode): GameState => {
  const snake = createInitialSnake();
  return {
    snake,
    food: generateFood(snake),
    direction: 'RIGHT',
    score: 0,
    isGameOver: false,
    isPaused: false,
    gameMode: mode,
    speed: INITIAL_SPEED,
  };
};

interface UseSnakeGameReturn {
  gameState: GameState;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  setDirection: (direction: Direction) => void;
  setGameMode: (mode: GameMode) => void;
}

export function useSnakeGame(initialMode: GameMode = 'walls'): UseSnakeGameReturn {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(initialMode));
  const directionRef = useRef<Direction>(gameState.direction);
  const gameLoopRef = useRef<number | null>(null);

  const moveSnake = useCallback(() => {
    setGameState(prevState => {
      if (prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }

      const direction = directionRef.current;
      const move = DIRECTION_MAP[direction];
      const head = prevState.snake[0];
      
      let newX = head.x + move.x;
      let newY = head.y + move.y;

      // Handle boundaries based on game mode
      if (prevState.gameMode === 'pass-through') {
        newX = (newX + GRID_SIZE) % GRID_SIZE;
        newY = (newY + GRID_SIZE) % GRID_SIZE;
      } else {
        // Walls mode - game over on collision
        if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
          return { ...prevState, isGameOver: true };
        }
      }

      // Check self collision
      if (prevState.snake.some(s => s.x === newX && s.y === newY)) {
        return { ...prevState, isGameOver: true };
      }

      // Determine dot side (alternating based on previous)
      const lastDotSide = prevState.snake[0].dotSide;
      const newDotSide = lastDotSide === 'left' ? 'right' : 'left';

      const newHead: SnakeSegment = { x: newX, y: newY, dotSide: newDotSide };

      // Check food collision
      const ateFood = newX === prevState.food.x && newY === prevState.food.y;

      let newSnake: SnakeSegment[];
      let newFood = prevState.food;
      let newScore = prevState.score;
      let newSpeed = prevState.speed;

      if (ateFood) {
        newSnake = [newHead, ...prevState.snake];
        newScore += 10;
        newFood = generateFood(newSnake);
        // Increase speed every 50 points
        if (newScore % 50 === 0 && newSpeed > 50) {
          newSpeed -= 10;
        }
      } else {
        newSnake = [newHead, ...prevState.snake.slice(0, -1)];
      }

      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
        score: newScore,
        speed: newSpeed,
        direction,
      };
    });
  }, []);

  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    
    gameLoopRef.current = window.setInterval(() => {
      moveSnake();
    }, gameState.speed);
  }, [moveSnake, gameState.speed]);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...createInitialState(prev.gameMode),
      isPaused: false,
    }));
    directionRef.current = 'RIGHT';
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const resetGame = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    setGameState(prev => createInitialState(prev.gameMode));
    directionRef.current = 'RIGHT';
  }, []);

  const setDirection = useCallback((newDirection: Direction) => {
    // Prevent 180-degree turns
    if (OPPOSITE_DIRECTIONS[newDirection] !== directionRef.current) {
      directionRef.current = newDirection;
    }
  }, []);

  const setGameMode = useCallback((mode: GameMode) => {
    setGameState(createInitialState(mode));
    directionRef.current = 'RIGHT';
  }, []);

  // Update game loop when speed changes
  useEffect(() => {
    if (!gameState.isPaused && !gameState.isGameOver) {
      startGameLoop();
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPaused, gameState.isGameOver, gameState.speed, startGameLoop]);

  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    setDirection,
    setGameMode,
  };
}

// Export for testing
export { createInitialState, generateFood, GRID_SIZE, DIRECTION_MAP, OPPOSITE_DIRECTIONS };
