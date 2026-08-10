import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../app/AuthProvider';
import { apiClient } from '../../lib/axios';
import { Save, CheckCircle2, Flame } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Separator } from '../../components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

function initials(name?: string) {
  if (!name) return 'SF';
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? '').concat(parts[1]?.[0] ?? '').toUpperCase() || 'SF';
}

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [targetRole, setTargetRole] = useState(user?.target_role || 'Software Engineer');
  const [difficultyPref, setDifficultyPref] = useState(user?.preferences?.difficulty_preference || 'medium');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await apiClient.patch('/me', {
        display_name: displayName,
        target_role: targetRole,
        difficulty_preference: difficultyPref,
      });
      await refreshUser();
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight text-foreground text-balance">
            Profile &amp; goals
          </h1>
          <p className="mt-1 text-secondary">Manage target roles, goals, and practice preferences</p>
        </div>

        <Card className="flex items-center gap-4 p-6">
          <Avatar className="h-16 w-16 text-lg">
            <AvatarFallback>{initials(user?.display_name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-display text-lg font-medium text-foreground">{user?.display_name}</p>
            <p className="text-sm text-secondary">{user?.email}</p>
          </div>
        </Card>

        {message && (
          <div className="flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm text-gold">
            <CheckCircle2 className="h-5 w-5" />
            {message}
          </div>
        )}

        <Card className="p-0">
          <form onSubmit={handleSave} className="space-y-6 p-8">
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-foreground">Email address</Label>
              <Input type="text" disabled value={user?.email || ''} className="h-12 cursor-not-allowed opacity-60" />
            </div>

            <div>
              <Label htmlFor="displayName" className="mb-1.5 block text-sm font-medium text-foreground">
                Display name
              </Label>
              <Input
                id="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="targetRole" className="mb-1.5 block text-sm font-medium text-foreground">
                Target role
              </Label>
              <Input
                id="targetRole"
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Senior Full-Stack Engineer"
                className="h-12"
              />
            </div>

            <div>
              <Label className="mb-1.5 block text-sm font-medium text-foreground">
                Preferred starting difficulty
              </Label>
              <Select value={difficultyPref} onValueChange={setDifficultyPref}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <Button type="submit" disabled={loading} className="h-14 w-full gap-2">
              <Save className="h-5 w-5" />
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};
