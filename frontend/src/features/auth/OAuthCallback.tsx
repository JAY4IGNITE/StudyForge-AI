import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../app/AuthProvider';
import { Loader2 } from 'lucide-react';
import { AnimatedGradient } from '../../components/landing/AnimatedGradient';

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
        const accessToken = hashParams.get('access_token');
        
        if (errorParam) {
          setError(errorParam);
          setTimeout(() => navigate('/login'), 3000);
        } else if (accessToken) {
          // Tokens are present in URL hash, Supabase auth is still processing
          // Do nothing, wait for AuthProvider to update user state
        } else {
           navigate('/login');
        }
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-6 overflow-hidden">
      <AnimatedGradient className="fixed inset-0 z-0 h-full w-full" />
      <div className="relative z-10 flex flex-col items-center">
        <img
          src="/branding/studyforge-logo.svg"
          alt="StudyForge Logo"
          className="mb-6 h-16 w-auto object-contain drop-shadow-xl"
        />
      
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
    </div>
  );
};
