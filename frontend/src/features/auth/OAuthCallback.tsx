import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../app/AuthProvider';
import { Flame, Loader2 } from 'lucide-react';

export const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const isProcessing = useRef(false);

  useEffect(() => {
    if (isProcessing.current) return;
    
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token') || hashParams.get('refresh_token');
    const errorParam = searchParams.get('error') || hashParams.get('error');

    let timeoutId: ReturnType<typeof setTimeout>;

    if (errorParam) {
      let errorMsg = `OAuth Login Failed: ${errorParam}`;
      if (errorParam === 'oauth_failed') {
        errorMsg = 'Authentication provider failed to complete the request.';
      } else if (errorParam === 'no_email') {
        errorMsg = 'Could not access your email address from the provider.';
      } else if (errorParam === 'unverified_email') {
        errorMsg = 'Your email address must be verified with the provider first.';
      }
      
      setError(errorMsg);
      timeoutId = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timeoutId);
    }

    if (accessToken && refreshToken) {
      isProcessing.current = true;
      login({ access_token: accessToken, refresh_token: refreshToken })
        .then(() => {
          navigate('/dashboard');
        })
        .catch(() => {
          setError('Failed to configure local session after OAuth.');
          timeoutId = setTimeout(() => navigate('/login'), 3000);
        });
    } else {
      setError('Invalid OAuth callback payload. Missing tokens.');
      timeoutId = setTimeout(() => navigate('/login'), 3000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [searchParams, navigate, login]);

  return (
    <div className="bg-blueprint bg-forge-glow relative flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-ember-gradient shadow-[0_0_0_1px_hsl(var(--ember)/0.4),0_8px_30px_-6px_hsl(var(--ember)/0.6)]">
        <Flame className="h-8 w-8 animate-pulse text-ember-foreground" strokeWidth={2.25} />
      </div>
      
      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-6 py-4 text-center">
          <p className="font-semibold text-destructive">{error}</p>
          <p className="mt-1 text-xs text-muted-foreground">Redirecting back to login...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-ember" />
          <h2 className="font-display text-lg font-medium text-foreground">Completing authentication</h2>
          <p className="text-sm text-muted-foreground">Please wait while we set up your workspace.</p>
        </div>
      )}
    </div>
  );
};
