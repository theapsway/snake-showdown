import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gamepad2, Trophy, Eye, Zap } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          {/* Animated snake icon */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-primary/20 border-2 border-primary flex items-center justify-center neon-border animate-pulse-glow">
              <Gamepad2 className="w-12 h-12 text-primary" />
            </div>
            {/* Decorative dots */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-snake animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 rounded-full bg-snake animate-bounce" style={{ animationDelay: '100ms' }}></div>
              <div className="w-3 h-3 rounded-full bg-snake animate-bounce" style={{ animationDelay: '200ms' }}></div>
            </div>
          </div>

          <h1 className="font-pixel text-3xl sm:text-4xl md:text-5xl text-primary neon-text mb-6">
            SNAKE ARENA
          </h1>
          
          <p className="text-muted-foreground text-lg sm:text-xl mb-8 max-w-xl mx-auto">
            The classic arcade game reimagined. Compete for high scores, watch live matches, and climb the leaderboard.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/play">
              <Button variant="arcade" size="arcadeLg" className="w-full sm:w-auto">
                <Zap className="w-5 h-5 mr-2" />
                PLAY NOW
              </Button>
            </Link>
            <Link to="/spectate">
              <Button variant="arcadeOutline" size="arcadeLg" className="w-full sm:w-auto">
                <Eye className="w-5 h-5 mr-2" />
                WATCH LIVE
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/20 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-pixel text-xs text-primary mb-2">2 GAME MODES</h3>
              <p className="text-muted-foreground text-sm">
                Classic walls or pass-through mode
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-pixel text-xs text-primary mb-2">LEADERBOARD</h3>
              <p className="text-muted-foreground text-sm">
                Compete for the top spot globally
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-pixel text-xs text-primary mb-2">SPECTATE</h3>
              <p className="text-muted-foreground text-sm">
                Watch other players live
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-border">
        <p className="text-center text-muted-foreground text-sm">
          Use arrow keys or WASD to control • Space to pause
        </p>
      </footer>
    </div>
  );
};

export default Index;
