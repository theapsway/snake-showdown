import React from 'react';
import { Button } from '@/components/ui/button';
import { GameMode } from '@/types/game';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  gameMode: GameMode;
  score: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onModeChange: (mode: GameMode) => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  isPlaying,
  isPaused,
  isGameOver,
  gameMode,
  score,
  onStart,
  onPause,
  onResume,
  onReset,
  onModeChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="text-center">
        <p className="text-muted-foreground text-sm mb-1">SCORE</p>
        <p className="font-pixel text-3xl text-primary neon-text">{score}</p>
      </div>

      {/* Game Mode Selector */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm text-center">GAME MODE</p>
        <div className="flex gap-2">
          <Button
            variant={gameMode === 'walls' ? 'arcade' : 'arcadeOutline'}
            size="sm"
            onClick={() => onModeChange('walls')}
            className="flex-1 text-[10px]"
          >
            WALLS
          </Button>
          <Button
            variant={gameMode === 'pass-through' ? 'arcade' : 'arcadeOutline'}
            size="sm"
            onClick={() => onModeChange('pass-through')}
            className="flex-1 text-[10px]"
          >
            PASS-THROUGH
          </Button>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex flex-col gap-3">
        {!isPlaying || isGameOver ? (
          <Button variant="arcade" size="arcade" onClick={onStart} className="w-full">
            <Play className="w-4 h-4 mr-2" />
            {isGameOver ? 'PLAY AGAIN' : 'START GAME'}
          </Button>
        ) : (
          <>
            {isPaused ? (
              <Button variant="arcade" size="arcade" onClick={onResume} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                RESUME
              </Button>
            ) : (
              <Button variant="arcadeOutline" size="arcade" onClick={onPause} className="w-full">
                <Pause className="w-4 h-4 mr-2" />
                PAUSE
              </Button>
            )}
          </>
        )}
        
        <Button variant="arcadeGhost" size="sm" onClick={onReset} className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          RESET
        </Button>
      </div>

      {/* Controls Help */}
      <div className="p-4 bg-secondary/50 rounded-lg border border-border">
        <p className="text-muted-foreground text-xs mb-2 text-center">CONTROLS</p>
        <div className="grid grid-cols-3 gap-1 text-center text-xs">
          <div></div>
          <div className="bg-muted px-2 py-1 rounded font-pixel text-[8px]">W/↑</div>
          <div></div>
          <div className="bg-muted px-2 py-1 rounded font-pixel text-[8px]">A/←</div>
          <div className="bg-muted px-2 py-1 rounded font-pixel text-[8px]">S/↓</div>
          <div className="bg-muted px-2 py-1 rounded font-pixel text-[8px]">D/→</div>
        </div>
        <p className="text-muted-foreground text-[10px] mt-2 text-center">
          SPACE to pause
        </p>
      </div>
    </div>
  );
};
