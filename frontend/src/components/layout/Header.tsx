import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from '@/types/game';
import { Gamepad2, Trophy, Eye, LogIn, LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 group-hover:shadow-[0_0_15px_hsl(var(--primary)/0.4)] transition-shadow">
            <Gamepad2 className="w-5 h-5 text-primary" />
          </div>
          <span className="font-pixel text-sm text-primary neon-text hidden sm:block">
            SNAKE ARENA
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Link to="/play">
            <Button 
              variant={isActive('/play') ? 'arcade' : 'arcadeGhost'} 
              size="sm"
              className="text-[10px]"
            >
              <Gamepad2 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">PLAY</span>
            </Button>
          </Link>
          
          <Link to="/leaderboard">
            <Button 
              variant={isActive('/leaderboard') ? 'arcade' : 'arcadeGhost'} 
              size="sm"
              className="text-[10px]"
            >
              <Trophy className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">RANKINGS</span>
            </Button>
          </Link>
          
          <Link to="/spectate">
            <Button 
              variant={isActive('/spectate') ? 'arcade' : 'arcadeGhost'} 
              size="sm"
              className="text-[10px]"
            >
              <Eye className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">WATCH</span>
            </Button>
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg border border-border">
                <UserIcon className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{user.username}</span>
              </div>
              <Button variant="arcadeGhost" size="sm" onClick={onLogout} className="text-[10px]">
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">LOGOUT</span>
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="arcade" size="sm" className="text-[10px]">
                <LogIn className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">LOGIN</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
