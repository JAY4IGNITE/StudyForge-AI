import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { KeyRound, CheckCircle } from 'lucide-react';
import { AuthShell } from '../../components/auth/AuthShell';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otpCode, setOtpCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      let { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'signup',
      });
      if (error) {
        const fallback = await supabase.auth.verifyOtp({
          email,
          token: otpCode,
          type: 'email',
        });
        if (fallback.error) throw fallback.error;
      }
      setMessage('Email verified! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell icon={KeyRound} title="Verify your email" subtitle="Enter the 6-digit OTP code sent to your email">
      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm text-gold">
          <CheckCircle className="h-4 w-4" />
          {message}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <Label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email address
          </Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
        </div>

        <div>
          <Label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-foreground">
            6-digit OTP code
          </Label>
          <Input
            id="otp"
            type="text"
            required
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="123456"
            className="h-14 text-center font-mono text-2xl tracking-widest"
          />
        </div>

        <Button type="submit" disabled={loading} className="h-12 w-full">
          {loading ? 'Verifying...' : 'Verify email'}
        </Button>
      </form>
    </AuthShell>
  );
};
