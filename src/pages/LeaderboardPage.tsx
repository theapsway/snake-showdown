import React, { useEffect, useState } from 'react';
import { LeaderboardEntry, GameMode } from '@/types/game';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { leaderboardApi } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<GameMode | 'all'>('all');

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const mode = filter === 'all' ? undefined : filter;
      const response = await leaderboardApi.getLeaderboard(mode);
      if (response.success) {
        setEntries(response.entries);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="font-pixel text-2xl text-primary neon-text mb-2">LEADERBOARD</h1>
          <p className="text-muted-foreground">Top players worldwide</p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'arcade' : 'arcadeOutline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="text-[10px]"
            >
              ALL
            </Button>
            <Button
              variant={filter === 'walls' ? 'arcade' : 'arcadeOutline'}
              size="sm"
              onClick={() => setFilter('walls')}
              className="text-[10px]"
            >
              WALLS
            </Button>
            <Button
              variant={filter === 'pass-through' ? 'arcade' : 'arcadeOutline'}
              size="sm"
              onClick={() => setFilter('pass-through')}
              className="text-[10px]"
            >
              PASS-THROUGH
            </Button>
          </div>

          <Button
            variant="arcadeGhost"
            size="sm"
            onClick={fetchLeaderboard}
            disabled={isLoading}
            className="text-[10px]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Leaderboard Content */}
        <div className="bg-card border border-border rounded-xl p-6 neon-border">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <LeaderboardTable 
              entries={entries} 
              currentUsername={user?.username}
            />
          )}
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            {user 
              ? 'Your scores are automatically submitted when you play.' 
              : 'Login to submit your scores to the leaderboard.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
