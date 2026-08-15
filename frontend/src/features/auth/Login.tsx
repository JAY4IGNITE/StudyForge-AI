import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Flame, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { PasswordInput } from '../../components/ui/PasswordInput';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // We don't need to manually set login since AuthProvider listens to session changes.
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-blueprint bg-forge-glow relative flex min-h-screen items-center justify-center bg-background p-6"
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -10 }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
              className="flex flex-col items-center gap-4 rounded-3xl bg-card p-10 shadow-2xl border border-border/50"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="flex items-center justify-center rounded-xl bg-ember/10 p-4"
              >
                <Loader2 className="h-10 w-10 text-ember" />
              </motion.div>
              <div className="text-center">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Authenticating</h2>
                <p className="text-sm text-secondary mt-1">Please wait a moment...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Card className="w-full max-w-lg p-8 shadow-2xl overflow-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ember-gradient shadow-[0_0_0_1px_hsl(var(--ember)/0.4),0_8px_20px_-6px_hsl(var(--ember)/0.6)]">
              <Flame className="h-6 w-6 text-ember-foreground" strokeWidth={2.25} />
            </div>
            <h1 className="font-display text-2xl font-medium tracking-tight text-foreground">
              StudyForge<span className="text-ember">.</span>
            </h1>
            <p className="mt-2 max-w-[250px] text-sm text-secondary">
              Access your AI-powered learning workspace.
            </p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center text-sm text-destructive">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-2 block text-[11px] uppercase tracking-wider text-secondary">
              Email address
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
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
              <Label htmlFor="password" className="text-[11px] uppercase tracking-wider text-secondary">
                Password
              </Label>
              <Link to="/forgot-password" className="text-[11px] font-medium text-ember hover:text-ember/80">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary z-10" />
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

          <Button type="submit" disabled={loading} className="mt-2 h-12 w-full gap-2 text-xs font-bold uppercase tracking-wide overflow-hidden">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    <Loader2 className="h-4 w-4" />
                  </motion.div>
                  Authenticating...
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  Continue to workspace
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.form>

        <motion.div variants={itemVariants} className="relative my-6 flex items-center justify-center">
          <Separator className="absolute inset-x-0" />
          <span className="relative bg-card px-4 font-mono text-[10px] uppercase tracking-widest text-secondary">
            Or authenticate via
          </span>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3">
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
        </motion.div>

        <motion.p variants={itemVariants} className="mt-6 text-center text-xs text-secondary">
          New researcher?{' '}
          <Link to="/register" className="font-medium text-ember hover:text-ember/80 hover:underline">
            Sign up
          </Link>
        </motion.p>
        </motion.div>
      </Card>
    </motion.div>
  );
};
