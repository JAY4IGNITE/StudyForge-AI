import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { codingProfileApi } from '../../services/codingProfileApi';
import { CodingProfile } from '../../types/coding_profile';
import { Layout } from '../../components/layout/Layout';
import { Loader2, Link as LinkIcon, Save, Github, Code, CheckCircle2, XCircle } from 'lucide-react';
import { AnimatedButton as Button } from '../../components/motion';
import { Input } from '../../components/ui/input';

export const ProfileSetupPage: React.FC = () => {
  const [profile, setProfile] = useState<CodingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Setup forms
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profileSlug, setProfileSlug] = useState('');
  
  // Connect forms
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [codeforcesUsername, setCodeforcesUsername] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [connectLoading, setConnectLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await codingProfileApi.getMe();
        setProfile(data);
        setDisplayName(data.display_name || '');
        setBio(data.bio || '');
        setProfileSlug(data.profile_slug || '');
      } catch (err: any) {
        if (err.response?.status === 404) {
          // Profile doesn't exist yet, that's fine
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      if (profile) {
        const updated = await codingProfileApi.updateProfile({
          display_name: displayName,
          bio,
          profile_slug: profileSlug
        });
        setProfile(updated);
      } else {
        const created = await codingProfileApi.createProfile({
          display_name: displayName,
          bio,
          profile_slug: profileSlug
        });
        setProfile(created);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save profile. Slug might be taken.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: string, username: string) => {
    if (!username) return;
    setConnectLoading({ ...connectLoading, [platform]: true });
    try {
      const updated = await codingProfileApi.connectPlatform(platform, username);
      setProfile(updated);
      if (platform === 'leetcode') setLeetcodeUsername('');
      if (platform === 'codeforces') setCodeforcesUsername('');
      if (platform === 'github') setGithubUsername('');
    } catch (err) {
      console.error(err);
      alert(`Failed to connect ${platform}. Username might be invalid.`);
    } finally {
      setConnectLoading({ ...connectLoading, [platform]: false });
    }
  };

  const handleDisconnect = async (platform: string) => {
    setConnectLoading({ ...connectLoading, [platform]: true });
    try {
      const updated = await codingProfileApi.disconnectPlatform(platform);
      setProfile(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setConnectLoading({ ...connectLoading, [platform]: false });
    }
  };

  if (loading && !profile && !displayName) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-ember" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-8 pb-20">
        <header className="space-y-4">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Developer Portfolio
          </h1>
          <p className="text-lg text-secondary">
            Set up your unified coding profile and connect your platforms.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Details Section */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl space-y-6">
            <h2 className="text-xl font-semibold text-white">Basic Info</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-secondary mb-1.5 block">Display Name</label>
                <Input 
                  value={displayName} 
                  onChange={e => setDisplayName(e.target.value)} 
                  placeholder="e.g. John Doe"
                  className="bg-white/5 border-white/10"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-secondary mb-1.5 block">Profile Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-secondary whitespace-nowrap">studyforge.ai/profile/</span>
                  <Input 
                    value={profileSlug} 
                    onChange={e => setProfileSlug(e.target.value)} 
                    placeholder="johndoe"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-secondary mb-1.5 block">Bio</label>
                <textarea 
                  value={bio} 
                  onChange={e => setBio(e.target.value)} 
                  placeholder="Tell us about yourself..."
                  className="w-full min-h-[100px] rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:ring-2 focus:ring-ember/50"
                />
              </div>
              
              <Button onClick={handleSaveProfile} disabled={loading || !displayName || !profileSlug} className="w-full gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Profile
              </Button>
            </div>
          </div>

          {/* Connect Platforms Section */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl space-y-6 opacity-100 transition-opacity">
            {!profile ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-black/80 backdrop-blur-sm p-6 text-center">
                <p className="text-white mb-4">Please create your profile first before connecting platforms.</p>
              </div>
            ) : null}

            <h2 className="text-xl font-semibold text-white">Connect Platforms</h2>
            
            <div className="space-y-4">
              {/* LeetCode */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-amber-500" />
                    <span className="font-medium text-white">LeetCode</span>
                  </div>
                  {profile?.platforms?.leetcode?.verified ? (
                    <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full"><CheckCircle2 className="h-3 w-3" /> Connected</span>
                  ) : null}
                </div>
                
                {profile?.platforms?.leetcode?.verified ? (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-secondary">@{profile.platforms.leetcode.username}</span>
                    <button onClick={() => handleDisconnect('leetcode')} className="text-xs text-red-400 hover:text-red-300">Disconnect</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input 
                      value={leetcodeUsername} 
                      onChange={e => setLeetcodeUsername(e.target.value)} 
                      placeholder="Username"
                      className="bg-black/50 border-white/10 h-9"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleConnect('leetcode', leetcodeUsername)} 
                      disabled={connectLoading['leetcode'] || !leetcodeUsername}
                    >
                      {connectLoading['leetcode'] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Connect'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Codeforces */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-white">Codeforces</span>
                  </div>
                  {profile?.platforms?.codeforces?.verified ? (
                    <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full"><CheckCircle2 className="h-3 w-3" /> Connected</span>
                  ) : null}
                </div>
                
                {profile?.platforms?.codeforces?.verified ? (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-secondary">@{profile.platforms.codeforces.username}</span>
                    <button onClick={() => handleDisconnect('codeforces')} className="text-xs text-red-400 hover:text-red-300">Disconnect</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input 
                      value={codeforcesUsername} 
                      onChange={e => setCodeforcesUsername(e.target.value)} 
                      placeholder="Handle"
                      className="bg-black/50 border-white/10 h-9"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleConnect('codeforces', codeforcesUsername)} 
                      disabled={connectLoading['codeforces'] || !codeforcesUsername}
                    >
                      {connectLoading['codeforces'] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Connect'}
                    </Button>
                  </div>
                )}
              </div>

              {/* GitHub */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5 text-white" />
                    <span className="font-medium text-white">GitHub</span>
                  </div>
                  {profile?.platforms?.github?.verified ? (
                    <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full"><CheckCircle2 className="h-3 w-3" /> Connected</span>
                  ) : null}
                </div>
                
                {profile?.platforms?.github?.verified ? (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-secondary">@{profile.platforms.github.username}</span>
                    <button onClick={() => handleDisconnect('github')} className="text-xs text-red-400 hover:text-red-300">Disconnect</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input 
                      value={githubUsername} 
                      onChange={e => setGithubUsername(e.target.value)} 
                      placeholder="Username"
                      className="bg-black/50 border-white/10 h-9"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleConnect('github', githubUsername)} 
                      disabled={connectLoading['github'] || !githubUsername}
                    >
                      {connectLoading['github'] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Connect'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {profile && (
          <div className="mt-8 flex justify-center">
             <Button variant="outline" className="gap-2" onClick={() => window.open(`/profile/${profile.profile_slug}`, '_blank')}>
               <LinkIcon className="h-4 w-4" />
               View Public Profile
             </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};
