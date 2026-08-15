import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../app/AuthProvider';
import { Flame, Loader2 } from 'lucide-react';

export const OAuthCallback: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/dashboard');
      } else {
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const errorParam = hashParams.get('error_description') || hashParams.get('error');
        if (errorParam) {
          setError(errorParam);
          setTimeout(() => navigate('/login'), 3000);
        } else {
           navigate('/login');
        }
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="bg-blueprint bg-forge-glow relative flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-ember-gradient shadow-[0_0_0_1px_hsl(var(--ember)/0.4),0_8px_30px_-6px_hsl(var(--ember)/0.6)]">
        <Flame className="h-8 w-8 animate-pulse text-ember-foreground" strokeWidth={2.25} />
      </div>
      
      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-6 py-4 text-center">
          <p className="font-semibold text-destructive">{error}</p>
          <p className="mt-1 text-xs text-secondary">Redirecting back to login...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-ember" />
          <h2 className="font-display text-lg font-medium text-foreground">Completing authentication</h2>
          <p className="text-sm text-secondary">Please wait while we set up your workspace.</p>
        </div>
      )}
    </div>
  );
};
