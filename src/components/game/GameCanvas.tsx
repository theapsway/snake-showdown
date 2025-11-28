import React from 'react';
import { GameState, Direction } from '@/types/game';

interface GameCanvasProps {
  gameState: GameState;
  cellSize?: number;
  showGrid?: boolean;
}

const GRID_SIZE = 20;

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  cellSize = 20,
  showGrid = true,
}) => {
  const canvasSize = GRID_SIZE * cellSize;

  const getRotationForDirection = (direction: Direction): number => {
    switch (direction) {
      case 'UP': return -90;
      case 'DOWN': return 90;
      case 'LEFT': return 180;
      case 'RIGHT': return 0;
    }
  };

  return (
    <div
      className="game-canvas relative overflow-hidden"
      style={{ width: canvasSize, height: canvasSize }}
    >
      {/* Grid background */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
          }}
        />
      )}

      {/* Food */}
      <div
        className="absolute rounded-full animate-pulse-glow"
        style={{
          left: gameState.food.x * cellSize + 2,
          top: gameState.food.y * cellSize + 2,
          width: cellSize - 4,
          height: cellSize - 4,
          backgroundColor: 'hsl(var(--accent))',
          boxShadow: '0 0 10px hsl(var(--accent)), 0 0 20px hsl(var(--accent) / 0.5)',
        }}
      />

      {/* Snake */}
      {gameState.snake.map((segment, index) => {
        const isHead = index === 0;
        const rotation = getRotationForDirection(gameState.direction);
        
        // Calculate dot position based on movement direction and dotSide
        let dotOffsetX = 0;
        let dotOffsetY = 0;
        const dotOffset = cellSize * 0.25;

        if (gameState.direction === 'UP' || gameState.direction === 'DOWN') {
          dotOffsetX = segment.dotSide === 'left' ? -dotOffset : dotOffset;
        } else {
          dotOffsetY = segment.dotSide === 'left' ? -dotOffset : dotOffset;
        }

        return (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className="absolute transition-all duration-75"
            style={{
              left: segment.x * cellSize + 2,
              top: segment.y * cellSize + 2,
              width: cellSize - 4,
              height: cellSize - 4,
              backgroundColor: 'hsl(var(--snake))',
              borderRadius: isHead ? '30%' : '20%',
              boxShadow: isHead 
                ? '0 0 15px hsl(var(--snake)), 0 0 30px hsl(var(--snake) / 0.3)'
                : '0 0 8px hsl(var(--snake) / 0.5)',
              transform: isHead ? `rotate(${rotation}deg)` : undefined,
            }}
          >
            {/* Black dot on each segment */}
            <div
              className="absolute rounded-full"
              style={{
                width: cellSize * 0.25,
                height: cellSize * 0.25,
                backgroundColor: 'hsl(var(--snake-dot))',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${dotOffsetX}px), calc(-50% + ${dotOffsetY}px))`,
              }}
            />
            
            {/* Eyes for head */}
            {isHead && (
              <>
                <div
                  className="absolute rounded-full bg-background"
                  style={{
                    width: cellSize * 0.2,
                    height: cellSize * 0.2,
                    top: '25%',
                    right: '15%',
                  }}
                >
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: '50%',
                      height: '50%',
                      backgroundColor: 'hsl(var(--snake-dot))',
                      top: '25%',
                      right: '10%',
                    }}
                  />
                </div>
                <div
                  className="absolute rounded-full bg-background"
                  style={{
                    width: cellSize * 0.2,
                    height: cellSize * 0.2,
                    bottom: '25%',
                    right: '15%',
                  }}
                >
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: '50%',
                      height: '50%',
                      backgroundColor: 'hsl(var(--snake-dot))',
                      bottom: '25%',
                      right: '10%',
                    }}
                  />
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Game Over Overlay */}
      {gameState.isGameOver && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <h2 className="font-pixel text-2xl text-accent neon-text mb-2">GAME OVER</h2>
            <p className="font-pixel text-sm text-primary">Score: {gameState.score}</p>
          </div>
        </div>
      )}

      {/* Pause Overlay */}
      {gameState.isPaused && !gameState.isGameOver && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <h2 className="font-pixel text-xl text-primary neon-text">PAUSED</h2>
        </div>
      )}
    </div>
  );
};
