import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, User } from 'lucide-react';

interface AuthFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSignup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await onLogin(email, password);
      } else {
        if (!username.trim()) {
          setError('Username is required');
          setIsLoading(false);
          return;
        }
        result = await onSignup(username, email, password);
      }

      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-xl p-8 neon-border">
        <div className="text-center mb-8">
          <h1 className="font-pixel text-xl text-primary neon-text mb-2">
            {isLogin ? 'WELCOME BACK' : 'JOIN THE ARENA'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isLogin ? 'Login to save your scores' : 'Create an account to compete'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="SnakeMaster99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-secondary/50"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="player@snakearena.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary/50"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="p-3 bg-accent/10 border border-accent/50 rounded-lg">
              <p className="text-accent text-sm text-center">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="arcade"
            size="arcadeLg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isLogin ? 'LOGGING IN...' : 'SIGNING UP...'}
              </>
            ) : (
              isLogin ? 'LOGIN' : 'CREATE ACCOUNT'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            type="button"
            onClick={switchMode}
            className="text-primary hover:text-primary/80 text-sm font-medium mt-1 underline underline-offset-4"
          >
            {isLogin ? 'Sign up here' : 'Login here'}
          </button>
        </div>

        {/* Demo credentials hint */}
        {isLogin && (
          <div className="mt-6 p-3 bg-secondary/30 rounded-lg border border-border">
            <p className="text-muted-foreground text-xs text-center">
              Demo: snake@game.com / password123
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
