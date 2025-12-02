import React from 'react';
import { ActivePlayer } from '@/types/game';
import { Eye, Clock } from 'lucide-react';
import { GameCanvas } from '@/components/game/GameCanvas';

interface PlayerCardProps {
  player: ActivePlayer;
  onWatch: (playerId: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onWatch }) => {
  const getPlayTime = () => {
    const startTime = new Date(player.startedAt).getTime();
    const now = Date.now();
    const minutes = Math.floor((now - startTime) / 60000);
    return minutes < 1 ? 'Just started' : `${minutes}m playing`;
  };

  const getModeLabel = (mode: string) => {
    return mode === 'walls' ? 'WALLS' : 'PASS-THROUGH';
  };

  return (
    <div
      onClick={() => onWatch(player.id)}
      className="spectate-card bg-card border border-border rounded-xl p-4 overflow-hidden"
    >
      {/* Mini game preview */}
      <div className="relative mb-4 flex justify-center">
        <div className="transform scale-50 origin-center" style={{ margin: '-60px 0' }}>
          <GameCanvas gameState={player.gameState} cellSize={15} showGrid={false} />
        </div>
        
        {/* Watch overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex items-center gap-2 text-primary">
            <Eye className="w-6 h-6" />
            <span className="font-pixel text-xs">WATCH LIVE</span>
          </div>
        </div>
      </div>

      {/* Player info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground truncate">{player.username}</h3>
          <span className={`
            px-2 py-0.5 rounded text-[8px] font-pixel
            ${player.gameState.gameMode === 'walls' 
              ? 'bg-accent/20 text-accent' 
              : 'bg-primary/20 text-primary'
            }
          `}>
            {getModeLabel(player.gameState.gameMode)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{getPlayTime()}</span>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground text-xs">Score: </span>
            <span className="font-pixel text-primary">{player.gameState.score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
