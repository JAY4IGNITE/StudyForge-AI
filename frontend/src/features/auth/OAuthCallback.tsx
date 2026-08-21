import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthProvider';
import { Loader2, Flame } from 'lucide-react';
import { AnimatedGradient } from '../../components/landing/AnimatedGradient';

import { supabase } from '../../lib/supabase';

export const OAuthCallback: React.FC = () => {
  const { user, loading, token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  // Capture URL params on initial render before Supabase clears them
  const initialHash = useRef(window.location.hash).current;
  const initialSearch = useRef(window.location.search).current;

  useEffect(() => {
    // If we have a user, authentication is successful!
    if (user) {
      if (user.email_verified) {
        navigate('/dashboard');
      } else {
        navigate('/verify-email', { state: { email: user.email } });
      }
      return;
    }

    // Parse the captured hash and search params
    const hashParams = new URLSearchParams(initialHash.slice(1));
    const searchParams = new URLSearchParams(initialSearch);
    const errorParam = 
      hashParams.get('error_description') || 
      hashParams.get('error') || 
      searchParams.get('error_description') || 
      searchParams.get('error');
    
    // If the provider returned an explicit error
    if (errorParam) {
      setError(errorParam);
      const timer = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timer);
    }

    // Listen to Supabase auth state changes directly to catch immediate sign out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, navigate, initialHash, initialSearch]);

  // Handle intermediate loading fallback: 
  // If loading finishes, we still have no user, AND we aren't processing an access token or code from the URL, auth failed.
  useEffect(() => {
    if (!loading && !user) {
      if (token) {
        setError('Failed to fetch user profile from the server.');
        const timer = setTimeout(() => navigate('/login'), 3000);
        return () => clearTimeout(timer);
      }
      
      const hashParams = new URLSearchParams(initialHash.slice(1));
      const searchParams = new URLSearchParams(initialSearch);
      if (!hashParams.get('access_token') && !searchParams.get('code')) {
        navigate('/login');
      }
    }
  }, [loading, user, token, navigate, initialHash, initialSearch]);

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
