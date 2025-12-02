import React from 'react';
import { LeaderboardEntry, GameMode } from '@/types/game';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUsername?: string;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  currentUsername,
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-leaderboard-gold" />;
      case 2:
        return <Medal className="w-5 h-5 text-leaderboard-silver" />;
      case 3:
        return <Medal className="w-5 h-5 text-leaderboard-bronze" />;
      default:
        return <span className="text-muted-foreground w-5 text-center">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-leaderboard-gold/10 border-leaderboard-gold/30';
      case 2:
        return 'bg-leaderboard-silver/10 border-leaderboard-silver/30';
      case 3:
        return 'bg-leaderboard-bronze/10 border-leaderboard-bronze/30';
      default:
        return 'bg-card border-border';
    }
  };

  const getModeLabel = (mode: GameMode) => {
    return mode === 'walls' ? 'WALLS' : 'PASS';
  };

  const getModeStyle = (mode: GameMode) => {
    return mode === 'walls' 
      ? 'bg-accent/20 text-accent border-accent/30' 
      : 'bg-primary/20 text-primary border-primary/30';
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No scores yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => {
        const isCurrentUser = currentUsername === entry.username;
        
        return (
          <div
            key={entry.id}
            className={`
              leaderboard-row flex items-center gap-4 p-4 rounded-lg border
              ${getRankStyle(entry.rank)}
              ${isCurrentUser ? 'ring-2 ring-primary/50' : ''}
            `}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-8">
              {getRankIcon(entry.rank)}
            </div>

            {/* Username */}
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                {entry.username}
                {isCurrentUser && <span className="text-xs text-muted-foreground ml-2">(you)</span>}
              </p>
              <p className="text-xs text-muted-foreground">{entry.date}</p>
            </div>

            {/* Game Mode Badge */}
            <div className={`px-2 py-1 rounded text-[10px] font-pixel border ${getModeStyle(entry.gameMode)}`}>
              {getModeLabel(entry.gameMode)}
            </div>

            {/* Score */}
            <div className="text-right">
              <p className="font-pixel text-lg text-primary">{entry.score.toLocaleString()}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
