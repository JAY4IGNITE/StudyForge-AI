import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Layers,
  HelpCircle,
  Map,
  FileText,
  Flame,
  Timer,
  Pause,
  SkipForward,
  ArrowUpRight,
} from 'lucide-react';
import { apiClient } from '../lib/axios';
import { useAuth } from '../app/AuthProvider';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { TemperBar, TemperGauge } from '../components/ui/temper-gauge';

interface QuickAction {
  to: string;
  icon: React.ElementType;
  title: string;
  blurb: string;
  accent: 'ember' | 'steel' | 'gold';
}

const quickActions: QuickAction[] = [
  { to: '/ai-tutor', icon: Bot, title: 'Ask AI', blurb: 'Get instant help', accent: 'ember' },
  { to: '/flashcards', icon: Layers, title: 'Flashcards', blurb: 'Review daily deck', accent: 'gold' },
  { to: '/practice', icon: HelpCircle, title: 'Quiz Me', blurb: 'Test knowledge', accent: 'steel' },
  { to: '/resources', icon: FileText, title: 'Notes', blurb: 'Auto-summarize', accent: 'steel' },
];

const accentClasses: Record<QuickAction['accent'], string> = {
  ember: 'bg-ember/10 text-ember group-hover:bg-ember group-hover:text-ember-foreground',
  steel: 'bg-steel/10 text-steel group-hover:bg-steel group-hover:text-[hsl(228_40%_9%)]',
  gold: 'bg-gold/10 text-gold group-hover:bg-gold group-hover:text-[hsl(42_45%_9%)]',
};

const weekBars = [
  { day: 'M', hours: 2, pct: 40 },
  { day: 'T', hours: 3, pct: 60 },
  { day: 'W', hours: 4.5, pct: 90, peak: true },
  { day: 'T', hours: 1.5, pct: 30 },
  { day: 'F', hours: 3.5, pct: 70 },
  { day: 'S', hours: 0, pct: 4 },
  { day: 'S', hours: 0, pct: 4 },
];

export function Dashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [topicAnalytics, setTopicAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [resOverview, resTopics] = await Promise.all([
          apiClient.get('/analytics/overview'),
          apiClient.get('/analytics/topics'),
        ]);
        setOverview(resOverview.data);
        setTopicAnalytics(resTopics.data);
      } catch (err) {
        console.error('Error loading dashboard analytics', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="font-display text-3xl font-medium tracking-tight text-foreground text-balance">
              Welcome back, {user?.display_name?.split(' ')[0] || 'Student'}
            </h1>
            <p className="mt-1 text-muted-foreground">Ready to crush your goals today?</p>
          </div>
          <Card className="flex items-center gap-4 border-ember/20 bg-ember/5 px-5 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ember-gradient shadow-[0_0_0_1px_hsl(var(--ember)/0.4)]">
              <Flame className="h-5 w-5 text-ember-foreground" />
            </div>
            <div>
              <div className="font-mono text-xl font-semibold leading-none text-ember">7 Days</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Current streak
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-4 md:col-span-8 md:grid-cols-3">
            {quickActions.slice(0, 3).map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.to} to={action.to} className="group">
                  <Card className="h-full p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ember/30 hover:shadow-[0_12px_28px_-14px_hsl(var(--ember)/0.35)]">
                    <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${accentClasses[action.accent]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium text-foreground">{action.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{action.blurb}</p>
                  </Card>
                </Link>
              );
            })}

            <Link to="/roadmap" className="group col-span-2">
              <Card className="h-full p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ember/30 hover:shadow-[0_12px_28px_-14px_hsl(var(--ember)/0.35)]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-medium text-foreground">Study Roadmap</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">Calculus midterm prep</p>
                    <TemperBar value={75} className="mt-4 max-w-[220px]" />
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ember/10 text-ember transition-colors group-hover:bg-ember group-hover:text-ember-foreground">
                    <Map className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/resources" className="group">
              <Card className="h-full p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ember/30 hover:shadow-[0_12px_28px_-14px_hsl(var(--ember)/0.35)]">
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${accentClasses.steel}`}>
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-foreground">Notes</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">Auto-summarize</p>
              </Card>
            </Link>
          </div>

          {/* Focus session */}
          <Card className="relative overflow-hidden md:col-span-4">
            <div className="bg-forge-glow pointer-events-none absolute inset-0" />
            <CardContent className="relative flex flex-col items-center p-6">
              <div className="mb-6 flex w-full items-center justify-between">
                <Badge variant="ember" className="gap-1.5 rounded-md px-2.5 py-1">
                  <Timer className="h-3 w-3" /> Focus session
                </Badge>
              </div>
              <TemperGauge value={75} size={176} strokeWidth={8} className="mb-8">
                <span className="font-mono text-4xl font-semibold tracking-tight text-foreground">18:42</span>
                <span className="mt-1 text-xs text-muted-foreground">25/5 sprint</span>
              </TemperGauge>
              <div className="flex items-center gap-4">
                <Button size="icon" className="h-12 w-12 rounded-full">
                  <Pause className="h-5 w-5" />
                </Button>
                <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full">
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress snapshot */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Progress snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Weekly study time */}
            <div>
              <div className="mb-4 flex items-end justify-between">
                <span className="text-sm font-medium text-muted-foreground">Weekly study time</span>
                {loading ? (
                  <Skeleton className="h-4 w-28" />
                ) : (
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {overview?.completed_sessions ?? 0} sessions
                    <span className="ml-1.5 font-sans font-normal text-muted-foreground">
                      avg {overview?.average_score ?? 0}%
                    </span>
                  </span>
                )}
              </div>
              <div className="flex h-32 items-end justify-between gap-2 border-b border-border pb-2">
                {weekBars.map((bar, i) => (
                  <div key={i} className="group relative w-full">
                    <span
                      className={`absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-xs transition-opacity ${
                        bar.peak ? 'font-semibold text-ember opacity-100' : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {bar.hours}h
                    </span>
                    <div
                      className={`w-full rounded-t-sm transition-colors ${
                        bar.peak ? 'bg-ember-gradient' : 'bg-secondary hover:bg-ember/30'
                      }`}
                      style={{ height: `${bar.pct}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between px-1 font-mono text-xs text-muted-foreground">
                {weekBars.map((bar, i) => (
                  <span key={i}>{bar.day}</span>
                ))}
              </div>
            </div>

            {/* Mastery breakdown */}
            <div>
              <span className="mb-4 block text-sm font-medium text-muted-foreground">Mastery breakdown</span>
              <div className="space-y-4">
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </>
                ) : topicAnalytics?.weak_topics?.length > 0 ? (
                  topicAnalytics.weak_topics.map((topic: any) => (
                    <div key={topic.topic_name}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-ember" /> {topic.topic_name}
                        </span>
                        <span className="font-mono font-medium text-foreground">{topic.mastery_score}%</span>
                      </div>
                      <TemperBar value={topic.mastery_score} showValue={false} />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowUpRight className="h-4 w-4 text-gold" />
                    Great job! Keep practicing to uncover insights.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
