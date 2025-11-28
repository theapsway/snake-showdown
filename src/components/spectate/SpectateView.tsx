import React from 'react';
import { ActivePlayer } from '@/types/game';
import { GameCanvas } from '@/components/game/GameCanvas';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Target } from 'lucide-react';

interface SpectateViewProps {
  player: ActivePlayer;
  onBack: () => void;
}

export const SpectateView: React.FC<SpectateViewProps> = ({ player, onBack }) => {
  const getPlayTime = () => {
    const startTime = new Date(player.startedAt).getTime();
    const now = Date.now();
    const minutes = Math.floor((now - startTime) / 60000);
    const seconds = Math.floor(((now - startTime) % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Back button */}
      <div className="w-full max-w-2xl mb-6">
        <Button variant="arcadeGhost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          BACK TO PLAYERS
        </Button>
      </div>

      {/* Player info header */}
      <div className="w-full max-w-2xl mb-6 p-4 bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-pixel text-lg text-primary neon-text">{player.username}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {getPlayTime()}
              </span>
              <span className={`
                px-2 py-0.5 rounded text-[10px] font-pixel
                ${player.gameState.gameMode === 'walls' 
                  ? 'bg-accent/20 text-accent' 
                  : 'bg-primary/20 text-primary'
                }
              `}>
                {player.gameState.gameMode === 'walls' ? 'WALLS' : 'PASS-THROUGH'}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
              <Target className="w-4 h-4" />
              SCORE
            </p>
            <p className="font-pixel text-3xl text-primary neon-text">
              {player.gameState.score}
            </p>
          </div>
        </div>
      </div>

      {/* Live game view */}
      <div className="relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent rounded-full">
          <span className="font-pixel text-[10px] text-accent-foreground flex items-center gap-1">
            <span className="w-2 h-2 bg-accent-foreground rounded-full animate-pulse"></span>
            LIVE
          </span>
        </div>
        <GameCanvas gameState={player.gameState} cellSize={22} />
      </div>

      {/* Snake length indicator */}
      <div className="mt-6 p-3 bg-card border border-border rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          Snake length: <span className="text-primary font-pixel">{player.gameState.snake.length}</span>
        </p>
      </div>
    </div>
  );
};
