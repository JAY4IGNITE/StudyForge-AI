import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { KeyRound, CheckCircle, Loader2 } from 'lucide-react';
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
  const [isVerifyingLink, setIsVerifyingLink] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const handleUrlTokens = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        const tokenHash = searchParams.get('token_hash');
        const type = (searchParams.get('type') as any) || 'signup';

        // 1. PKCE flow code in query string
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            setIsVerified(true);
            setMessage('Email verified successfully! Redirecting to workspace...');
            setTimeout(() => navigate('/dashboard'), 1500);
            return;
          }
        }

        // 2. Token hash in query string
        if (tokenHash) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type === 'email' ? 'email' : 'signup',
          });
          if (!error) {
            setIsVerified(true);
            setMessage('Email verified successfully! Redirecting to workspace...');
            setTimeout(() => navigate('/dashboard'), 1500);
            return;
          }
        }

        // 3. Existing verified session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email_confirmed_at) {
          setIsVerified(true);
          setMessage('Email already verified! Redirecting to workspace...');
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      } catch (err: any) {
        // Fall back to manual OTP input
      } finally {
        setIsVerifyingLink(false);
      }
    };

    handleUrlTokens();
  }, [navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      let { error } = await supabase.auth.verifyOtp({
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
      setIsVerified(true);
      setMessage('Email verified successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      icon={KeyRound}
      title={isVerified ? "Email verified" : "Verify your email"}
      subtitle={
        isVerifyingLink
          ? "Checking email verification link..."
          : isVerified
          ? "Your email has been verified successfully."
          : "Click the confirmation link sent to your email or enter the 6-digit OTP code below"
      }
    >
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

      {isVerifyingLink ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-ember" />
          <p className="text-sm text-secondary">Verifying your email link...</p>
        </div>
      ) : !isVerified && (
        <form onSubmit={handleVerify} className="space-y-4">
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
              placeholder="scholar@institute.edu"
              className="h-12"
            />
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
      )}
    </AuthShell>
  );
};
