import React, { useEffect, useCallback, useRef } from 'react';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { GameCanvas } from '@/components/game/GameCanvas';
import { GameControls } from '@/components/game/GameControls';
import { Direction } from '@/types/game';
import { leaderboardApi } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const PlayPage: React.FC = () => {
  const { user } = useAuth();
  const {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    setDirection,
    setGameMode,
  } = useSnakeGame('walls');

  const hasSubmittedScore = useRef(false);
  const lastScore = useRef(0);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const keyDirectionMap: Record<string, Direction> = {
      ArrowUp: 'UP',
      ArrowDown: 'DOWN',
      ArrowLeft: 'LEFT',
      ArrowRight: 'RIGHT',
      w: 'UP',
      W: 'UP',
      s: 'DOWN',
      S: 'DOWN',
      a: 'LEFT',
      A: 'LEFT',
      d: 'RIGHT',
      D: 'RIGHT',
    };

    if (keyDirectionMap[e.key]) {
      e.preventDefault();
      setDirection(keyDirectionMap[e.key]);
    }

    if (e.key === ' ') {
      e.preventDefault();
      if (gameState.isPaused) {
        resumeGame();
      } else if (!gameState.isGameOver) {
        pauseGame();
      }
    }
  }, [setDirection, gameState.isPaused, gameState.isGameOver, pauseGame, resumeGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Track score and submit on game over
  useEffect(() => {
    if (gameState.isGameOver && gameState.score > 0 && !hasSubmittedScore.current) {
      hasSubmittedScore.current = true;
      lastScore.current = gameState.score;

      if (user) {
        leaderboardApi.submitScore(gameState.score, gameState.gameMode)
          .then(response => {
            if (response.success) {
              toast({
                title: 'Score Submitted!',
                description: `Your score of ${gameState.score} has been recorded.`,
              });
            }
          });
      }
    }
  }, [gameState.isGameOver, gameState.score, gameState.gameMode, user]);

  // Reset submission flag when starting new game
  const handleStartGame = () => {
    hasSubmittedScore.current = false;
    startGame();
  };

  const handleModeChange = (mode: 'walls' | 'pass-through') => {
    hasSubmittedScore.current = false;
    setGameMode(mode);
  };

  const isPlaying = !gameState.isGameOver && gameState.snake.length > 0 && 
    (gameState.score > 0 || !gameState.isPaused);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="font-pixel text-2xl text-primary neon-text mb-2">PLAY</h1>
          <p className="text-muted-foreground">
            {user ? `Playing as ${user.username}` : 'Login to save your scores'}
          </p>
        </div>

        {/* Game Area */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
          {/* Game Canvas */}
          <div className="order-2 lg:order-1">
            <GameCanvas gameState={gameState} cellSize={22} />
          </div>

          {/* Controls Panel */}
          <div className="order-1 lg:order-2 w-full max-w-xs">
            <div className="bg-card border border-border rounded-xl p-6 neon-border">
              <GameControls
                isPlaying={isPlaying}
                isPaused={gameState.isPaused}
                isGameOver={gameState.isGameOver}
                gameMode={gameState.gameMode}
                score={gameState.score}
                onStart={handleStartGame}
                onPause={pauseGame}
                onResume={resumeGame}
                onReset={resetGame}
                onModeChange={handleModeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayPage;
