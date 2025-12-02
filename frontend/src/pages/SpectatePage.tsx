import React, { useEffect, useState, useCallback } from 'react';
import { ActivePlayer } from '@/types/game';
import { spectateApi, startMockPlayerUpdates, stopMockPlayerUpdates } from '@/services/api';
import { PlayerCard } from '@/components/spectate/PlayerCard';
import { SpectateView } from '@/components/spectate/SpectateView';
import { Loader2, Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SpectatePage: React.FC = () => {
  const [players, setPlayers] = useState<ActivePlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<ActivePlayer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlayers = useCallback(async () => {
    try {
      const response = await spectateApi.getActivePlayers();
      if (response.success) {
        setPlayers(response.players);
        
        // Update selected player's game state if watching
        if (selectedPlayer) {
          const updatedPlayer = response.players.find(p => p.id === selectedPlayer.id);
          if (updatedPlayer) {
            setSelectedPlayer(updatedPlayer);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch active players:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPlayer]);

  useEffect(() => {
    // Start mock player updates
    startMockPlayerUpdates();
    
    // Initial fetch
    fetchPlayers();

    // Poll for updates
    const interval = setInterval(fetchPlayers, 200);

    return () => {
      clearInterval(interval);
      stopMockPlayerUpdates();
    };
  }, [fetchPlayers]);

  const handleWatchPlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      setSelectedPlayer(player);
    }
  };

  const handleBackToList = () => {
    setSelectedPlayer(null);
  };

  if (selectedPlayer) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
        <div className="container mx-auto">
          <SpectateView player={selectedPlayer} onBack={handleBackToList} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="font-pixel text-2xl text-primary neon-text mb-2">SPECTATE</h1>
          <p className="text-muted-foreground">Watch players compete in real-time</p>
        </div>

        {/* Active Players Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-5 h-5" />
            <span>{players.length} player{players.length !== 1 ? 's' : ''} online</span>
          </div>
          
          <Button
            variant="arcadeGhost"
            size="sm"
            onClick={() => { setIsLoading(true); fetchPlayers(); }}
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

        {/* Players Grid */}
        {isLoading && players.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : players.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Active Players</h3>
            <p className="text-muted-foreground">
              Check back later or start a game yourself!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                onWatch={handleWatchPlayer}
              />
            ))}
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-4 bg-card border border-border rounded-xl text-center">
          <p className="text-muted-foreground text-sm">
            Click on a player card to watch their game live.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpectatePage;
