import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { codingProfileApi } from '../services/codingProfileApi';
import { CodingProfile } from '../types/coding_profile';
import { Layout } from '../components/layout/Layout';
import { Loader2, Share2, MapPin, Calendar, Briefcase, RefreshCw, AlertTriangle } from 'lucide-react';
import { AnimatedButton as Button } from '../components/motion';

import { LeetCodeCard } from '../features/coding_profile/LeetCodeCard';
import { CodeforcesCard } from '../features/coding_profile/CodeforcesCard';
import { GitHubCard } from '../features/coding_profile/GitHubCard';

export const PublicProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<CodingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchProfile = async () => {
      try {
        const data = await codingProfileApi.getPublicProfile(slug);
        setProfile(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Profile not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Profile link copied to clipboard!');
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const data = await codingProfileApi.syncStats();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-ember" />
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <div className="text-center py-20">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">Error Loading Profile</h2>
          <p className="text-secondary mb-6">{error}</p>
        </div>
      </Layout>
    );
  }

  const { cached_stats } = profile;

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-8 pb-20">
        
        {/* Profile Header */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-ember/20 via-primary/20 to-blue-500/20 opacity-50 blur-3xl"></div>
          
          <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="h-24 w-24 rounded-full border-4 border-black/50 bg-white/5 overflow-hidden flex items-center justify-center flex-shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.display_name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-secondary">{profile.display_name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="font-display text-3xl font-bold text-white mb-2">{profile.display_name}</h1>
                <p className="text-lg text-secondary max-w-lg mb-4">{profile.bio || "No bio provided."}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
              <Button onClick={handleCopyLink} className="gap-2 flex-1 md:flex-none">
                <Share2 className="h-4 w-4" /> Share Profile
              </Button>
              <Button onClick={handleSync} disabled={syncing} variant="outline" className="gap-2 flex-1 md:flex-none">
                <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} /> Sync Stats
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cached_stats.leetcode && (
            <LeetCodeCard stats={cached_stats.leetcode} />
          )}
          
          {cached_stats.codeforces && (
            <CodeforcesCard stats={cached_stats.codeforces} />
          )}
          
          {cached_stats.github && (
            <GitHubCard stats={cached_stats.github} />
          )}
        </div>

        {/* Empty State for Platforms */}
        {!cached_stats.leetcode && !cached_stats.codeforces && !cached_stats.github && (
          <div className="rounded-2xl border border-white/10 bg-black/40 p-12 text-center backdrop-blur-xl">
            <h3 className="text-xl font-medium text-white mb-2">No connected platforms</h3>
            <p className="text-secondary max-w-sm mx-auto">
              This user hasn't connected any coding platforms yet, or their stats are currently syncing.
            </p>
          </div>
        )}

      </div>
    </Layout>
  );
};
