import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { AuthShell } from '../../components/auth/AuthShell';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  React.useEffect(() => {
    const handleUrlTokens = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          setHasRecoverySession(true);
          return;
        }
      } else if (tokenHash && type === 'recovery') {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery',
        });
        if (!error) {
          setHasRecoverySession(true);
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasRecoverySession(true);
      }
    };

    handleUrlTokens();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      // 1. If no active recovery session yet, verify OTP code provided by user
      if (!hasRecoverySession && otpCode) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token: otpCode,
          type: 'recovery',
        });
        if (verifyError) throw verifyError;
      }

      // 2. Update user password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please check your OTP code or link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell icon={ShieldCheck} title="Set new password" subtitle="Enter your OTP code and new account password">
      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm text-gold">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <Label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email address
          </Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
        </div>

        {!hasRecoverySession && (
          <div>
            <Label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-foreground">
              6-digit reset OTP code
            </Label>
            <Input
              id="otp"
              type="text"
              required={!hasRecoverySession}
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="123456"
              className="h-14 text-center font-mono text-2xl tracking-widest"
            />
          </div>
        )}

        <div>
          <Label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-foreground">
            New password
          </Label>
          <Input
            id="new-password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12"
          />
        </div>

        <Button type="submit" disabled={loading} className="h-12 w-full">
          {loading ? 'Resetting password...' : 'Reset password'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-secondary">
        <Link to="/login" className="inline-flex items-center gap-1 font-medium text-ember hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
      </p>
    </AuthShell>
  );
};
