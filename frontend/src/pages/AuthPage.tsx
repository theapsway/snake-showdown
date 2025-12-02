import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { Gamepad2 } from 'lucide-react';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, signup, isLoading } = useAuth();

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/play');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/50">
          <Gamepad2 className="w-6 h-6 text-primary" />
        </div>
        <span className="font-pixel text-lg text-primary neon-text">
          SNAKE ARENA
        </span>
      </div>

      {/* Auth Form */}
      <AuthForm onLogin={login} onSignup={signup} />

      {/* Bottom decoration */}
      <div className="mt-12 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-primary/30"></div>
        <div className="w-2 h-2 rounded-full bg-primary/50"></div>
        <div className="w-2 h-2 rounded-full bg-primary/70"></div>
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <div className="w-2 h-2 rounded-full bg-primary/70"></div>
        <div className="w-2 h-2 rounded-full bg-primary/50"></div>
        <div className="w-2 h-2 rounded-full bg-primary/30"></div>
      </div>
    </div>
  );
};

export default AuthPage;
