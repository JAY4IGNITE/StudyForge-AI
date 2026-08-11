import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/axios';
import { useAuth } from '../app/AuthProvider';
import { Layout } from '../components/layout/Layout';
import { StaggerContainer, FadeUp } from '../components/motion';

import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { ReadinessScore } from '../components/dashboard/ReadinessScore';
import { NextBestAction } from '../components/dashboard/NextBestAction';
import { TodayPlan } from '../components/dashboard/TodayPlan';

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
      <div className="mx-auto w-full max-w-7xl">
        <StaggerContainer className="flex flex-col gap-6">
          {/* Header Area */}
          <FadeUp>
            <DashboardHeader />
          </FadeUp>

          {/* Tier 1 Decision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <FadeUp className="md:col-span-4 h-full">
              <ReadinessScore />
            </FadeUp>
            <FadeUp className="md:col-span-4 h-full">
              <NextBestAction />
            </FadeUp>
            <FadeUp className="md:col-span-4 h-full">
              <TodayPlan />
            </FadeUp>
          </div>

          {/* Tier 2: Progress & Mastery (Legacy integration for now) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <FadeUp>
              <div className="bg-card/40 border border-border rounded-xl p-6 backdrop-blur-md">
                <h3 className="font-display text-lg font-medium tracking-tight text-foreground mb-4">Weekly Study Time</h3>
                {loading ? (
                  <div className="h-40 flex items-center justify-center text-secondary">Loading...</div>
                ) : (
                  <div>
                    <div className="text-sm text-secondary mb-4">
                      {overview?.completed_sessions ?? 0} sessions completed this week.
                    </div>
                    {/* Placeholder for actual chart to be added in Phase 2 */}
                    <div className="h-32 bg-secondary/10 rounded-lg flex items-center justify-center border border-border/50">
                      <span className="text-xs text-secondary font-mono">Chart Data Placeholder</span>
                    </div>
                  </div>
                )}
              </div>
            </FadeUp>

            <FadeUp>
              <div className="bg-card/40 border border-border rounded-xl p-6 backdrop-blur-md">
                <h3 className="font-display text-lg font-medium tracking-tight text-foreground mb-4">Mastery Breakdown</h3>
                {loading ? (
                  <div className="h-40 flex items-center justify-center text-secondary">Loading...</div>
                ) : (
                  <div className="space-y-4">
                    {topicAnalytics?.weak_topics?.length > 0 ? (
                      topicAnalytics.weak_topics.slice(0, 4).map((topic: any) => (
                        <div key={topic.topic_name}>
                          <div className="mb-1.5 flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-foreground">
                              <span className="h-1.5 w-1.5 rounded-full bg-ember" /> {topic.topic_name}
                            </span>
                            <span className="font-mono font-medium text-foreground">{topic.mastery_score}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-secondary/20 rounded-full overflow-hidden">
                            <div className="h-full bg-steel rounded-full" style={{ width: `${topic.mastery_score}%` }} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-secondary">Great job! Keep practicing to uncover insights.</div>
                    )}
                  </div>
                )}
              </div>
            </FadeUp>
          </div>
        </StaggerContainer>
      </div>
    </Layout>
  );
}
