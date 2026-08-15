import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthProvider';
import { supabase } from '../../lib/supabase';
import { UserPlus, Flame, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Separator } from '../../components/ui/separator';

export const Register: React.FC = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/oauth/callback',
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
          },
        },
      });
      if (error) throw error;
      
      if (data.session) {
        navigate('/dashboard');
      } else {
        navigate('/verify-email', { state: { email } });
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blueprint bg-forge-glow relative flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ember-gradient shadow-[0_0_0_1px_hsl(var(--ember)/0.4),0_8px_20px_-6px_hsl(var(--ember)/0.6)]">
            <Flame className="h-6 w-6 text-ember-foreground" strokeWidth={2.25} />
          </div>
          <h1 className="font-display text-2xl font-medium text-foreground">Create your StudyForge account</h1>
          <p className="mt-1 text-sm text-secondary">Start your adaptive practice journey today</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
              Full name
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Jane Doe"
              className="h-12"
            />
          </div>

          <div>
            <Label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="h-12"
            />
          </div>

          <div>
            <Label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
              Password
            </Label>
            <PasswordInput
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12"
            />
          </div>

          <Button type="submit" disabled={loading} className="h-12 w-full gap-2">
            <UserPlus className="h-4 w-4" />
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <Separator className="absolute inset-x-0" />
          <span className="relative bg-card px-4 font-mono text-[10px] uppercase tracking-widest text-secondary">
            Or authenticate via
          </span>
        </div>

        <div className="space-y-3">
          <Button
            variant="secondary"
            className="h-12 w-full gap-3 overflow-hidden relative"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
          >
            <AnimatePresence mode="wait">
              {googleLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Loader2 className="h-4 w-4" />
                  </motion.div>
                  Redirecting...
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                    />
                  </svg>
                  Continue with Google
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-ember hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
};
