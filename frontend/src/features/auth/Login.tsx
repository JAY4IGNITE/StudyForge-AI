import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import { useAuth } from '../../app/AuthProvider';
import { Flame, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { PasswordInput } from '../../components/ui/PasswordInput';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      await login(res.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to login. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blueprint bg-forge-glow relative flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-10 shadow-2xl">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ember-gradient shadow-[0_0_0_1px_hsl(var(--ember)/0.4),0_8px_20px_-6px_hsl(var(--ember)/0.6)]">
            <Flame className="h-6 w-6 text-ember-foreground" strokeWidth={2.25} />
          </div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-foreground">
            StudyForge<span className="text-ember">.</span>
          </h1>
          <p className="mt-2 max-w-[250px] text-sm text-muted-foreground">
            Access your AI-powered learning workspace.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="mb-2 block text-[11px] uppercase tracking-wider text-muted-foreground">
              Email address
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scholar@institute.edu"
                className="h-12 pl-10"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label htmlFor="password" className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <Link to="/forgot-password" className="text-[11px] font-medium text-ember hover:text-ember/80">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
              <PasswordInput
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 pl-10"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="mt-2 h-12 w-full gap-2 text-xs font-bold uppercase tracking-wide">
            {loading ? 'Authenticating...' : 'Continue to workspace'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>

        <div className="relative my-8 flex items-center justify-center">
          <Separator className="absolute inset-x-0" />
          <span className="relative bg-card px-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Or authenticate via
          </span>
        </div>

        <div className="space-y-3">
          <Button 
            variant="secondary" 
            className="h-12 w-full gap-3"
            onClick={() => window.location.href = 'http://localhost:8000/api/v1/oauth/google/login'}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
              />
            </svg>
            Continue with Google
          </Button>
          <Button 
            variant="secondary" 
            className="h-12 w-full gap-3"
            onClick={() => window.location.href = 'http://localhost:8000/api/v1/oauth/github/login'}
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </Button>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          New researcher?{' '}
          <Link to="/register" className="font-medium text-ember hover:text-ember/80 hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
};
