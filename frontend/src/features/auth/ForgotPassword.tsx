import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import { KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import { AuthShell } from '../../components/auth/AuthShell';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await apiClient.post('/auth/password/forgot', { email });
      setMessage('Password reset OTP sent to your email!');
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell icon={KeyRound} title="Forgot password" subtitle="Enter your registered email to receive a reset OTP">
      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-6 rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm text-gold">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="you@example.com"
            className="h-12"
          />
        </div>

        <Button type="submit" disabled={loading} className="h-12 w-full gap-2">
          {loading ? 'Sending OTP...' : 'Send password reset OTP'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/login" className="inline-flex items-center gap-1 font-medium text-ember hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
      </p>
    </AuthShell>
  );
};
